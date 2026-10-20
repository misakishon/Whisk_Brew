import React, { useState, type FormEvent } from "react";
import { router } from "@inertiajs/react";
import { ShoppingBag, X, Minus, Plus, ArrowLeft } from "lucide-react";
import { MenuItem } from "../../types/whisk";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cart: Record<number, number>;
    items: MenuItem[];
    onUpdateQuantity: (id: number, delta: number) => void;
    onClearCart: () => void;
}

export default function CartDrawer({
    isOpen,
    onClose,
    cart,
    items,
    onUpdateQuantity,
    onClearCart,
}: CartDrawerProps) {
    const [stage, setStage] = useState<"cart" | "checkout" | "confirmation">("cart");
    const [pickupName, setPickupName] = useState("");
    const [pickupEmail, setPickupEmail] = useState("");
    const [pickupTime, setPickupTime] = useState("In 20 minutes");
    const [submitting, setSubmitting] = useState(false);
    const [orderError, setOrderError] = useState("");

    if (!isOpen) return null;

    const cartList = items
        .map((item) => ({ ...item, quantity: cart[item.id] ?? 0 }))
        .filter((item) => item.quantity > 0);

    const totalCount = cartList.reduce((acc, i) => acc + i.quantity, 0);
    const subtotalUsd = cartList.reduce((acc, i) => acc + i.usdPrice * i.quantity, 0);

    const minutesMap: Record<string, number> = {
        "In 10 minutes": 10,
        "In 20 minutes": 20,
        "In 30 minutes": 30,
        "In 45 minutes": 45,
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setOrderError("");

        router.post(
            "/orders",
            {
                customer_name: pickupName,
                email: pickupEmail,
                pickup_in_minutes: minutesMap[pickupTime] ?? 20,
                items: cartList.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                    customization: {
                        temperature: item.category === "Non-Coffee" ? "Iced" : "Hot",
                        milk: "Whole Dairy",
                        sweetness: "100%",
                        upgrade: "None",
                    },
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setStage("confirmation");
                    onClearCart();
                },
                onError: (errors) => {
                    setOrderError(
                        Object.values(errors)[0] ??
                            "Failed to place order. Please review your details."
                    );
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-[#1C1917]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
                className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-2xl sm:rounded-3xl border border-stone-200"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-5 bg-white/50">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#955B3D]">
                            WHISK_BREW PICKUP
                        </p>
                        <h2 id="cart-title" className="font-serif text-2xl text-[#1C1917] mt-0.5">
                            {stage === "confirmation"
                                ? "Order Confirmed"
                                : stage === "checkout"
                                  ? "Pickup Details"
                                  : `Your Bag (${totalCount})`}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close bag"
                        className="rounded-full p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 flex-1">
                    {stage === "confirmation" ? (
                        <div className="py-4 text-center sm:text-left">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E3EAE3] text-[#102B24] mb-4">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="font-serif text-2xl text-[#1C1917]">
                                Thank you, {pickupName}!
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#78716C]">
                                Your ticket has been sent directly to the baristas at 24 Garden Lane.
                                Your order will be whisked and ready for pickup{" "}
                                <strong className="text-[#1C1917]">{pickupTime.toLowerCase()}</strong>.
                            </p>
                            <div className="mt-5 rounded-2xl bg-[#E3EAE3]/70 p-4 text-xs leading-relaxed text-[#102B24] border border-[#D0DDD0]/80">
                                <strong>Ticket Routed:</strong> A receipt has been logged. Pay in person at the counter when you arrive.
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setStage("cart");
                                    onClose();
                                }}
                                className="mt-6 w-full rounded-full bg-[#955B3D] px-5 py-3 text-sm font-medium text-white hover:bg-[#7D492E] transition-colors"
                            >
                                Back to website
                            </button>
                        </div>
                    ) : stage === "checkout" ? (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="rounded-2xl bg-white p-4 border border-stone-200/80">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-[#78716C]">
                                        {totalCount} {totalCount === 1 ? "item" : "items"}
                                    </span>
                                    <span>${subtotalUsd.toFixed(2)}</span>
                                </div>
                                <p className="mt-1 text-xs text-[#78716C]">
                                    Pickup at Garden Lane Flagship · Pay in person
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="order-name"
                                    className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
                                >
                                    Name for Order
                                </label>
                                <input
                                    id="order-name"
                                    type="text"
                                    required
                                    value={pickupName}
                                    onChange={(e) => setPickupName(e.target.value)}
                                    placeholder="e.g. Jordan Miller"
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm focus:border-[#955B3D] focus:ring-1 focus:ring-[#955B3D] outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="order-email"
                                    className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="order-email"
                                    type="email"
                                    required
                                    value={pickupEmail}
                                    onChange={(e) => setPickupEmail(e.target.value)}
                                    placeholder="e.g. jordan@example.com"
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm focus:border-[#955B3D] focus:ring-1 focus:ring-[#955B3D] outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="order-time"
                                    className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
                                >
                                    Pickup Window
                                </label>
                                <select
                                    id="order-time"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm focus:border-[#955B3D] focus:ring-1 focus:ring-[#955B3D] outline-none"
                                >
                                    <option>In 10 minutes</option>
                                    <option>In 20 minutes</option>
                                    <option>In 30 minutes</option>
                                    <option>In 45 minutes</option>
                                </select>
                            </div>

                            {orderError && (
                                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                                    {orderError}
                                </div>
                            )}

                            <div className="pt-2 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStage("cart")}
                                    disabled={submitting}
                                    className="rounded-full border border-stone-200 p-3 text-stone-700 hover:bg-stone-200/50"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 rounded-full bg-[#955B3D] py-3 text-sm font-medium text-white hover:bg-[#7D492E] disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    {submitting ? "Transmitting..." : "Send to Barista Display"}
                                </button>
                            </div>
                        </form>
                    ) : cartList.length === 0 ? (
                        <div className="py-12 text-center">
                            <ShoppingBag size={32} className="mx-auto text-stone-300" />
                            <h3 className="mt-3 font-serif text-xl text-[#1C1917]">
                                Your bag is currently empty
                            </h3>
                            <p className="mt-1 text-xs text-[#78716C]">
                                Add an iced americano, ceremonial matcha, or warm pastry to begin.
                            </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-6 rounded-full bg-[#1C1917] px-5 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors"
                            >
                                Browse menu
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartList.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3.5 border-b border-stone-200/70 pb-4"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-16 w-16 rounded-xl object-cover border border-stone-200/60"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-serif text-base font-medium text-[#1C1917] truncate">
                                                {item.name}
                                            </h4>
                                            <span className="text-xs font-semibold text-[#1C1917]">
                                                ${(item.usdPrice * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#78716C]">{item.category}</p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                                className="rounded-full border border-stone-200 p-1 text-stone-700 hover:bg-stone-200/50"
                                            >
                                                <Minus size={11} />
                                            </button>
                                            <span className="min-w-4 text-center text-xs font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                                className="rounded-full border border-stone-200 p-1 text-stone-700 hover:bg-stone-200/50"
                                            >
                                                <Plus size={11} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer on cart stage */}
                {stage === "cart" && cartList.length > 0 && (
                    <div className="border-t border-stone-200/80 bg-white/60 p-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#78716C]">Estimated Subtotal</span>
                            <span className="font-semibold text-[#1C1917]">
                                ${subtotalUsd.toFixed(2)}
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-[#78716C]">
                            Tax and local options settled upon café counter pickup.
                        </p>
                        <button
                            type="button"
                            onClick={() => setStage("checkout")}
                            className="mt-4 w-full rounded-full bg-[#955B3D] py-3 text-sm font-medium text-white transition-colors hover:bg-[#7D492E] shadow-sm"
                        >
                            Proceed to Pickup Selection
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
