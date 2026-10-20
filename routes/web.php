<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CustomizeOrderController;
use App\Http\Controllers\PickupOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Customer Facing Routes
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/menu', function (Request $request) {
    $menuItems = [];
    foreach (config('whisk_brew.menu') as $id => $item) {
        $menuItems[] = ['id' => $id, ...$item];
    }

    return Inertia::render('Menu', [
        'menuItems' => $menuItems,
        'orderConfirmation' => $request->session()->get('order_confirmation'),
    ]);
})->name('menu');

Route::post('/orders', [PickupOrderController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('orders.store');

// Customize Orders Routes
Route::get('/customize-orders', [CustomizeOrderController::class, 'index'])->name('customize-orders.index');
Route::post('/customize-orders', [CustomizeOrderController::class, 'store'])->name('customize-orders.store');
Route::put('/customize-orders/{id}', [CustomizeOrderController::class, 'update'])->name('customize-orders.update');
Route::delete('/customize-orders/{id}', [CustomizeOrderController::class, 'destroy'])->name('customize-orders.destroy');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('login.store');
});

Route::post('/logout', [LoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Staff Portal Direct URL Access & Aliases
Route::redirect('/staff', '/admin');
Route::redirect('/staff-portal', '/admin');

// Protected Admin Portal Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::patch('/orders/{id}/status', [AdminDashboardController::class, 'updateOrderStatus'])->name('orders.status');
    Route::delete('/orders/{id}', [AdminDashboardController::class, 'destroyOrder'])->name('orders.destroy');
    Route::delete('/customize-orders/{id}', [AdminDashboardController::class, 'destroyCustomizeOrder'])->name('customize-orders.destroy');
});