import React, { useState, useMemo, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import {
    Coffee,
    LogOut,
    Clock,
    CheckCircle2,
    Flame,
    Snowflake,
    Search,
    Trash2,
    DollarSign,
    Package,
    Store,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Calendar,
} from "lucide-react";

interface OrderItem {
    id: number;
    menu_item_id: number;
    item_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    customization?: {
        temperature?: string;
        milk?: string;
        sweetness?: string;
        upgrade?: string;
    } | null;
}

interface PickupOrder {
    id: number;
    reference: string;
    customer_name: string;
    email: string;
    pickup_in_minutes: number;
    subtotal: number;
    currency: string;
    status: string;
    created_at_formatted: string;
    created_at_diff: string;
    estimated_ready_time: string;
    items: OrderItem[];
}

interface CustomizeOrder {
    id: number;
    quantity: number;
    pickup_in_minutes: number;
    temperature: string;
    sweetness: string;
    is_cold: boolean;
    created_at_formatted: string;
}

interface Props {
    adminUser: {
        name: string;
        email: string;
    };
    pickupOrders: PickupOrder[];
    customizeOrders: CustomizeOrder[];
    stats: {
        total_revenue: number;
        total_orders: number;
        pending_count: number;
        preparing_count: number;
        ready_count: number;
        completed_count: number;
        customize_orders_count: number;
    };
    flash?: {
        success?: string;
    };
}

export default function AdminDashboard({
    adminUser,
    pickupOrders = [],
    customizeOrders = [],
    stats,
    flash,
}: Props) {
    const [activeTab, setActiveTab] = useState<"pickup" | "customize">("pickup");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedOrderIds, setExpandedOrderIds] = useState<Record<number, boolean>>({});
    const [currentTime, setCurrentTime] = useState<string>("");
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedOrderIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleUpdateStatus = (orderId: number, nextStatus: string) => {
        setProcessingId(orderId);
        router.patch(
            `/admin/orders/${orderId}/status`,
            { status: nextStatus },
            {
                preserveScroll: true,
                onFinish: () => setProcessingId(null),
            }
        );
    };

    const handleDeleteOrder = (orderId: number) => {
        if (confirm("Are you sure you want to remove this order from history?")) {
            setProcessingId(orderId);
            router.delete(`/admin/orders/${orderId}`, {
                preserveScroll: true,
                onFinish: () => setProcessingId(null),
            });
        }
    };

    const handleDeleteCustomizeOrder = (id: number) => {
        if (confirm("Clear this custom recipe request?")) {
            router.delete(`/admin/customize-orders/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    // Filter pickup orders
    const filteredOrders = useMemo(() => {
        return pickupOrders.filter((order) => {
            const matchesStatus =
                statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                order.customer_name.toLowerCase().includes(q) ||
                order.email.toLowerCase().includes(q) ||
                order.reference.toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [pickupOrders, statusFilter, searchQuery]);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                    </span>
                );
            case "preparing":
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-sky-600" />
                        Preparing
                    </span>
                );
            case "ready":
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Ready for Pickup
                    </span>
                );
            case "completed":
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F3EFEA] text-stone-600 border border-stone-200">
                        Completed
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] pb-24">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#E6ECE8] text-[#3A4D40] border border-[#6B7F69]/20 flex items-center justify-center shadow-xs">
                            <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-semibold tracking-[-0.06em]">
                                    whisk
                                    <span className="font-serif font-normal italic text-[#8C5A3C]">
                                        _brew
                                    </span>
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#E6ECE8] border border-[#6B7F69]/30 text-[#3A4D40] text-[10px] font-semibold uppercase tracking-wider">
                                    Barista KDS
                                </span>
                            </div>
                            <p className="text-xs text-[#78716C] font-serif italic">
                                Kitchen Display & Order Queue Operations
                            </p>
                        </div>
                    </div>

                    {/* Right Tools & Profile */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Live Digital Clock */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-mono text-[#3A4D40] shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-[#8C5A3C]" />
                            <span>{currentTime || "00:00:00"}</span>
                        </div>

                        {/* Customer Storefront Link */}
                        <Link
                            href="/menu"
                            className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors px-3.5 py-2 rounded-full border border-stone-200 bg-white hover:bg-[#F3EFEA]"
                        >
                            <Store className="w-3.5 h-3.5" />
                            <span>Customer Menu</span>
                        </Link>

                        {/* User Identity */}
                        <div className="hidden lg:flex flex-col text-right">
                            <span className="text-xs font-semibold text-[#1C1917]">{adminUser.name}</span>
                            <span className="text-[11px] text-[#78716C] font-mono">{adminUser.email}</span>
                        </div>

                        {/* Logout Button */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4ECE8] hover:bg-[#EBDDD6] border border-stone-200 text-[#8C5A3C] text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-8">
                {/* Flash Success Notification */}
                {flash?.success && (
                    <div className="mb-6 p-4 rounded-2xl bg-[#E6ECE8] border border-[#6B7F69]/40 text-[#3A4D40] text-sm flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#3A4D40]" />
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* Real-time KPI Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Revenue */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
                            <span>Total Revenue</span>
                            <div className="w-7 h-7 rounded-full bg-[#F7F4EF] flex items-center justify-center text-[#8C5A3C]">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-[#8C5A3C]">
                            ₱{stats.total_revenue.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-[#A8A29E] mt-1 font-mono">
                            {stats.total_orders} lifetime orders
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
                            <span>Pending In Kitchen</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                        </div>
                        <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-amber-700">
                            {stats.pending_count}
                        </div>
                        <div className="text-[11px] text-[#A8A29E] mt-1">Awaiting prep queue</div>
                    </div>

                    {/* In Preparation & Ready */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
                            <span>Preparing / Ready</span>
                            <div className="w-7 h-7 rounded-full bg-[#E6ECE8] flex items-center justify-center text-[#3A4D40]">
                                <Flame className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-[#3A4D40]">
                            {stats.preparing_count + stats.ready_count}
                        </div>
                        <div className="text-[11px] text-[#A8A29E] mt-1">
                            {stats.ready_count} ready for pickup
                        </div>
                    </div>

                    {/* Custom Drinks */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
                            <span>Custom Drink Queue</span>
                            <div className="w-7 h-7 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#6B7F69]">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-[#6B7F69]">
                            {stats.customize_orders_count}
                        </div>
                        <div className="text-[11px] text-[#A8A29E] mt-1">Formula customizations</div>
                    </div>
                </div>

                {/* Primary Navigation Tabs */}
                <div className="flex items-center gap-3 mb-6 border-b border-stone-200 pb-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab("pickup")}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === "pickup"
                                ? "bg-[#1C1917] text-white shadow-xs"
                                : "text-[#78716C] hover:text-[#1C1917] bg-white border border-stone-200"
                        }`}
                    >
                        <Package className="w-3.5 h-3.5" />
                        <span>Pickup Orders (KDS Queue)</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                activeTab === "pickup"
                                    ? "bg-stone-700 text-stone-100"
                                    : "bg-[#F3EFEA] text-[#78716C]"
                            }`}
                        >
                            {pickupOrders.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("customize")}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === "customize"
                                ? "bg-[#3A4D40] text-white shadow-xs"
                                : "text-[#78716C] hover:text-[#1C1917] bg-white border border-stone-200"
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Custom Drink Formulas</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                activeTab === "customize"
                                    ? "bg-[#2C3B31] text-emerald-100"
                                    : "bg-[#F3EFEA] text-[#78716C]"
                            }`}
                        >
                            {customizeOrders.length}
                        </span>
                    </button>
                </div>

                {/* TAB 1: PICKUP ORDERS */}
                {activeTab === "pickup" && (
                    <div className="space-y-6">
                        {/* Filter & Search Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
                            {/* Status Filter Buttons */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                                {["all", "pending", "preparing", "ready", "completed"].map((st) => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                                            statusFilter === st
                                                ? "bg-[#3A4D40] text-white font-semibold"
                                                : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3EFEA]"
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>

                            {/* Search Input */}
                            <div className="relative min-w-[260px]">
                                <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search customer, email, UUID..."
                                    className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-stone-200 rounded-full text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#3A4D40]"
                                />
                            </div>
                        </div>

                        {/* Orders List */}
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-20 rounded-3xl bg-white border border-stone-200/80">
                                <Package className="w-12 h-12 text-[#A8A29E] mx-auto mb-3" />
                                <h3 className="text-[#1C1917] font-semibold text-base">No orders found</h3>
                                <p className="text-[#78716C] text-xs mt-1">
                                    {searchQuery
                                        ? "No matching orders found for this query"
                                        : "The queue is currently clear"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => {
                                    const isExpanded = expandedOrderIds[order.id] ?? true;
                                    const isProcessing = processingId === order.id;

                                    return (
                                        <div
                                            key={order.id}
                                            className="rounded-3xl bg-white border border-stone-200/80 shadow-xs overflow-hidden transition-all hover:border-stone-300"
                                        >
                                            {/* Order Card Header */}
                                            <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/60 bg-[#FBF9F6]">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="font-mono text-xs font-bold text-[#3A4D40] bg-[#E6ECE8] border border-[#6B7F69]/30 px-2.5 py-0.5 rounded-md">
                                                            #{order.reference.slice(0, 8)}
                                                        </span>
                                                        <h3 className="text-base font-bold text-[#1C1917]">
                                                            {order.customer_name}
                                                        </h3>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-[#78716C] flex-wrap">
                                                        <span>{order.email}</span>
                                                        <span>•</span>
                                                        <span>Ordered {order.created_at_diff}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1 text-[#8C5A3C] font-semibold">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            Ready ~{order.estimated_ready_time} (in {order.pickup_in_minutes}m)
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Total & Quick Workflow Actions */}
                                                <div className="flex items-center gap-3 flex-wrap justify-between md:justify-end">
                                                    <div className="text-right mr-2">
                                                        <div className="text-xs text-[#78716C]">Total</div>
                                                        <div className="text-lg font-serif font-bold text-[#8C5A3C]">
                                                            ₱{order.subtotal.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* Workflow Progression Button */}
                                                    {order.status === "pending" && (
                                                        <button
                                                            type="button"
                                                            disabled={isProcessing}
                                                            onClick={() => handleUpdateStatus(order.id, "preparing")}
                                                            className="px-4 py-2 rounded-full bg-[#8C5A3C] hover:bg-[#73482F] text-white font-medium text-xs shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                                                        >
                                                            Start Preparing →
                                                        </button>
                                                    )}

                                                    {order.status === "preparing" && (
                                                        <button
                                                            type="button"
                                                            disabled={isProcessing}
                                                            onClick={() => handleUpdateStatus(order.id, "ready")}
                                                            className="px-4 py-2 rounded-full bg-[#3A4D40] hover:bg-[#2C3B31] text-white font-medium text-xs shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                                                        >
                                                            Mark Ready for Pickup ✓
                                                        </button>
                                                    )}

                                                    {order.status === "ready" && (
                                                        <button
                                                            type="button"
                                                            disabled={isProcessing}
                                                            onClick={() => handleUpdateStatus(order.id, "completed")}
                                                            className="px-4 py-2 rounded-full bg-[#F3EFEA] hover:bg-stone-200 text-stone-800 font-medium text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 border border-stone-200"
                                                        >
                                                            Complete Order
                                                        </button>
                                                    )}

                                                    {/* Expand Toggle */}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleExpand(order.id)}
                                                        className="p-2 rounded-full border border-stone-200 bg-white hover:bg-[#F3EFEA] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                                                        title="Toggle Items"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </button>

                                                    {/* Delete Order Button */}
                                                    <button
                                                        type="button"
                                                        disabled={isProcessing}
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        className="p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-50"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Order Items Detail Table */}
                                            {isExpanded && (
                                                <div className="p-5 sm:p-6 bg-white">
                                                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-3">
                                                        Drink & Pastry Lines ({order.items.length})
                                                    </div>
                                                    <div className="divide-y divide-stone-100">
                                                        {order.items.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                                                            >
                                                                <div>
                                                                    <div className="font-semibold text-[#1C1917] flex items-center gap-2">
                                                                        <span className="w-6 h-6 rounded-md bg-[#F3EFEA] text-[#3A4D40] font-mono text-xs flex items-center justify-center font-bold">
                                                                            {item.quantity}x
                                                                        </span>
                                                                        <span>{item.item_name}</span>
                                                                    </div>

                                                                    {/* Customization Pills */}
                                                                    {item.customization && (
                                                                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5 ml-8">
                                                                            {item.customization.temperature && (
                                                                                <span
                                                                                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${
                                                                                        item.customization.temperature ===
                                                                                        "Iced"
                                                                                            ? "bg-sky-50 text-sky-800 border border-sky-200/80"
                                                                                            : "bg-amber-50 text-amber-800 border border-amber-200/80"
                                                                                    }`}
                                                                                >
                                                                                    {item.customization.temperature ===
                                                                                    "Iced" ? (
                                                                                        <Snowflake className="w-3 h-3" />
                                                                                    ) : (
                                                                                        <Flame className="w-3 h-3" />
                                                                                    )}
                                                                                    {item.customization.temperature}
                                                                                </span>
                                                                            )}

                                                                            {item.customization.milk && (
                                                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F3EFEA] text-[#78716C] border border-stone-200">
                                                                                    {item.customization.milk}
                                                                                </span>
                                                                            )}

                                                                            {item.customization.sweetness && (
                                                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F3EFEA] text-[#78716C] border border-stone-200">
                                                                                    Sweetness: {item.customization.sweetness}
                                                                                </span>
                                                                            )}

                                                                            {item.customization.upgrade &&
                                                                                item.customization.upgrade !== "None" && (
                                                                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E6ECE8] text-[#3A4D40] border border-[#6B7F69]/30">
                                                                                        ★ {item.customization.upgrade}
                                                                                    </span>
                                                                                )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="text-right sm:text-right font-mono font-semibold text-[#8C5A3C] ml-8 sm:ml-0">
                                                                    ₱{item.line_total.toLocaleString()}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: CUSTOMIZE ORDERS */}
                {activeTab === "customize" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-stone-200 shadow-xs">
                            <div>
                                <h3 className="text-sm font-semibold text-[#1C1917]">
                                    Customer Tailored Formulations
                                </h3>
                                <p className="text-xs text-[#78716C]">
                                    Real-time custom recipe modifications submitted from the customer customize interface
                                </p>
                            </div>
                            <Link
                                href="/customize-orders"
                                className="px-4 py-2 rounded-full bg-[#E6ECE8] hover:bg-[#D8E3DC] text-[#3A4D40] text-xs font-semibold transition-all border border-[#6B7F69]/30"
                            >
                                Open Customer Interface ↗
                            </Link>
                        </div>

                        {customizeOrders.length === 0 ? (
                            <div className="text-center py-20 rounded-3xl bg-white border border-stone-200">
                                <Sparkles className="w-12 h-12 text-[#A8A29E] mx-auto mb-3" />
                                <h3 className="text-[#1C1917] font-semibold text-base">
                                    No custom formulations in queue
                                </h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {customizeOrders.map((ord) => (
                                    <div
                                        key={ord.id}
                                        className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#E6ECE8] text-[#3A4D40] border border-[#6B7F69]/30">
                                                    Custom #{ord.id}
                                                </span>
                                                <span className="text-xs text-[#A8A29E]">
                                                    {ord.created_at_formatted}
                                                </span>
                                            </div>

                                            <div className="space-y-2.5 mb-5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-[#78716C]">Quantity</span>
                                                    <span className="font-bold text-[#1C1917]">
                                                        {ord.quantity} cups
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-[#78716C]">Temperature</span>
                                                    <span
                                                        className={`font-semibold flex items-center gap-1 ${
                                                            ord.is_cold ? "text-sky-700" : "text-amber-700"
                                                        }`}
                                                    >
                                                        {ord.is_cold ? (
                                                            <Snowflake className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <Flame className="w-3.5 h-3.5" />
                                                        )}
                                                        {ord.temperature}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-[#78716C]">Sweetness</span>
                                                    <span className="font-bold text-[#1C1917]">
                                                        {ord.sweetness}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-[#78716C]">Prep Window</span>
                                                    <span className="text-[#1C1917] font-medium">
                                                        {ord.pickup_in_minutes} mins
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCustomizeOrder(ord.id)}
                                            className="w-full py-2.5 rounded-full bg-[#F4ECE8] hover:bg-[#EBDDD6] border border-stone-200 text-[#8C5A3C] text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Dismiss Custom Recipe</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
