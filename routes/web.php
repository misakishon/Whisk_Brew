<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\PickupOrderController;

Route::get('/', function () {
    return Inertia::render('Home');
});

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