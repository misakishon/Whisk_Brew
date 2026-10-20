import React, { useState } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Plus, Trash2, Flame, Snowflake, Clock, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

interface TransformedOrder {
    id: number;
    quantity: number;
    pickup_in_minutes: number;
    temperature: string;
    sweetness: string;
    is_cold: boolean;
    estimated_pickup_time: string;
    created_at_formatted: string;
}

interface Props {
    orders: TransformedOrder[];
    flash?: {
        success?: string;
    };
}

export default function CustomizeOrders({ orders }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        quantity: 1,
        pickup_in_minutes: 15,
        temperature: "Hot",
        sweetness: "100%",
    });

    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/customize-orders", {
            onSuccess: () => reset(),
        });
    };

    // Toggle temperature to demonstrate modifying value via Controller
    const handleToggleTemperature = (order: TransformedOrder) => {
        setUpdatingId(order.id);
        const nextTemp = order.temperature === "HOT" ? "Iced" : "Hot";
        router.put(
            `/customize-orders/${order.id}`,
            { temperature: nextTemp },
            {
                onFinish: () => setUpdatingId(null),
            }
        );
    };

    // Cycle sweetness level
    const handleCycleSweetness = (order: TransformedOrder) => {
        setUpdatingId(order.id);
        const levels = ["0%", "50%", "100%"];
        const currentIndex = levels.indexOf(order.sweetness);
        const nextSweetness = levels[(currentIndex + 1) % levels.length];
        router.put(
            `/customize-orders/${order.id}`,
            { sweetness: nextSweetness },
            {
                onFinish: () => setUpdatingId(null),
            }
        );
    };

    // Delete order
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this order?")) {
            router.delete(`/customize-orders/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Navigation */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/menu"
                                className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1.5" />
                                Back to Menu
                            </Link>
                        </div>
                        <h1 className="text-3xl font-semibold tracking-[-0.04em] mt-2 text-[#1C1917]">
                            Customized Orders
                        </h1>
                        <p className="text-sm text-[#78716C] mt-1 font-serif italic">
                            Live records queried from the SQLite database & modified by the controller.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6ECE8] text-[#3A4D40] border border-[#6B7F69]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3A4D40]" />
                            SQLite Connected
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form to Insert New Record */}
                    <div className="lg:col-span-1 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-base font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-[#8C5A3C]" />
                            Create New Custom Order
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
                                    Quantity (cups)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={data.quantity}
                                    onChange={(e) => setData("quantity", parseInt(e.target.value) || 1)}
                                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-[#1C1917] text-sm focus:outline-none focus:border-[#3A4D40]"
                                />
                                {errors.quantity && (
                                    <p className="text-rose-600 text-xs mt-1">{errors.quantity}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
                                    Pickup Window
                                </label>
                                <select
                                    value={data.pickup_in_minutes}
                                    onChange={(e) =>
                                        setData("pickup_in_minutes", parseInt(e.target.value))
                                    }
                                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-[#1C1917] text-sm focus:outline-none focus:border-[#3A4D40]"
                                >
                                    <option value={10}>10 minutes</option>
                                    <option value={15}>15 minutes</option>
                                    <option value={20}>20 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                </select>
                                {errors.pickup_in_minutes && (
                                    <p className="text-rose-600 text-xs mt-1">
                                        {errors.pickup_in_minutes}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
                                    Temperature
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData("temperature", "Hot")}
                                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                                            data.temperature === "Hot"
                                                ? "bg-amber-50 text-amber-800 border-amber-300 shadow-2xs"
                                                : "bg-[#FAF8F5] text-[#78716C] border-stone-200 hover:bg-[#F3EFEA]"
                                        }`}
                                    >
                                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                                        Hot
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData("temperature", "Iced")}
                                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                                            data.temperature === "Iced"
                                                ? "bg-sky-50 text-sky-800 border-sky-300 shadow-2xs"
                                                : "bg-[#FAF8F5] text-[#78716C] border-stone-200 hover:bg-[#F3EFEA]"
                                        }`}
                                    >
                                        <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                                        Iced
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
                                    Sweetness Level
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["0%", "50%", "100%"] as const).map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setData("sweetness", level)}
                                            className={`py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                                                data.sweetness === level
                                                    ? "bg-[#3A4D40] text-white border-[#3A4D40] shadow-2xs"
                                                    : "bg-[#FAF8F5] text-[#78716C] border-stone-200 hover:bg-[#F3EFEA]"
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-4 bg-[#3A4D40] hover:bg-[#2C3B31] disabled:opacity-50 text-white font-medium py-3 px-4 rounded-full transition shadow-md shadow-[#3A4D40]/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Save to SQLite Database
                            </button>
                        </form>
                    </div>

                    {/* Table / List displaying Orders */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-[#1C1917]">
                                Orders in Database ({orders.length})
                            </h2>
                            <span className="text-xs text-[#78716C]">
                                Tap badges below to mutate values live
                            </span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center shadow-xs">
                                <Clock className="w-12 h-12 text-[#A8A29E] mx-auto mb-3" />
                                <h3 className="text-base font-semibold text-[#1C1917]">
                                    No customized orders found
                                </h3>
                                <p className="text-xs text-[#78716C] mt-1">
                                    Use the form on the left to add your first order.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border border-stone-200/80 hover:border-stone-300 rounded-2xl p-5 shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-mono font-bold bg-[#E6ECE8] text-[#3A4D40] border border-[#6B7F69]/30 px-2 py-0.5 rounded">
                                                    #{order.id}
                                                </span>
                                                <span className="text-sm font-bold text-[#1C1917]">
                                                    Qty: {order.quantity} cups
                                                </span>
                                                <span className="text-xs text-[#A8A29E]">
                                                    • {order.created_at_formatted}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                                                {/* Temperature (clickable to modify) */}
                                                <button
                                                    onClick={() => handleToggleTemperature(order)}
                                                    disabled={updatingId === order.id}
                                                    title="Click to toggle temperature in database"
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 transition cursor-pointer ${
                                                        order.is_cold
                                                            ? "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100"
                                                            : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                                    }`}
                                                >
                                                    {order.is_cold ? (
                                                        <Snowflake className="w-3 h-3 text-sky-600" />
                                                    ) : (
                                                        <Flame className="w-3 h-3 text-amber-600" />
                                                    )}
                                                    {order.temperature} (Tap to toggle)
                                                </button>

                                                {/* Sweetness (clickable to modify) */}
                                                <button
                                                    onClick={() => handleCycleSweetness(order)}
                                                    disabled={updatingId === order.id}
                                                    title="Click to cycle sweetness in database"
                                                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6ECE8] text-[#3A4D40] border border-[#6B7F69]/30 hover:bg-[#D8E3DC] flex items-center gap-1 transition cursor-pointer"
                                                >
                                                    Sweet: {order.sweetness} (Tap to cycle)
                                                </button>

                                                {/* Estimated pickup time */}
                                                <span className="px-3 py-1 rounded-full text-xs bg-[#FAF8F5] text-[#78716C] border border-stone-200 flex items-center gap-1 font-mono">
                                                    <Clock className="w-3 h-3 text-[#8C5A3C]" />
                                                    {order.pickup_in_minutes}m (~{order.estimated_pickup_time})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {updatingId === order.id && (
                                                <RefreshCw className="w-4 h-4 text-[#8C5A3C] animate-spin" />
                                            )}
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
                                                title="Delete Order"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
