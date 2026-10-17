import React, { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import type { PageProps } from "../types";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Minus,
    Plus,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Trash2,
    X,
} from "lucide-react";

type Category =
    | "Artisanal Matcha"
    | "Espresso & Pour Over"
    | "Signature Cold Brews"
    | "Pastries & Artisanal Bakes";
type Temperature = "Hot" | "Iced";
type Milk =
    | "Whole Dairy"
    | "Barista Oat Milk"
    | "Organic Soy"
    | "Roasted Almond";
type Sweetness = "0%" | "50%" | "100%";
type Upgrade =
    | "None"
    | "Ceremonial Uji Grade Upgrade"
    | "Extra Single-Origin Shot"
    | "Sea Salt Muscovado Cold Foam";

interface MenuItem {
    id: number;
    name: string;
    category: Category;
    notes: string;
    calories: number;
    caffeine: string;
    price: number;
    imageUrl: string;
    isDrink: boolean;
    allowedUpgrades: Upgrade[];
}

interface MenuPageProps extends PageProps {
    menuItems: MenuItem[];
    orderConfirmation: { reference: string; total: number } | null;
}

interface Customization {
    temperature: Temperature;
    milk: Milk;
    sweetness: Sweetness;
    upgrade: Upgrade;
}

interface CartLine {
    key: string;
    item: MenuItem;
    customization: Customization;
    quantity: number;
    unitPrice: number;
}

const categories: Array<"All" | Category> = [
    "All",
    "Artisanal Matcha",
    "Espresso & Pour Over",
    "Signature Cold Brews",
    "Pastries & Artisanal Bakes",
];

const milkOptions: Array<{ name: Milk; price: number }> = [
    { name: "Whole Dairy", price: 0 },
    { name: "Barista Oat Milk", price: 30 },
    { name: "Organic Soy", price: 20 },
    { name: "Roasted Almond", price: 30 },
];

const upgrades: Array<{ name: Upgrade; price: number }> = [
    { name: "None", price: 0 },
    { name: "Ceremonial Uji Grade Upgrade", price: 45 },
    { name: "Extra Single-Origin Shot", price: 40 },
    { name: "Sea Salt Muscovado Cold Foam", price: 35 },
];

const defaultCustomization: Customization = {
    temperature: "Hot",
    milk: "Barista Oat Milk",
    sweetness: "100%",
    upgrade: "None",
};

const peso = (amount: number) =>
    `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

function getUnitPrice(item: MenuItem, customization: Customization) {
    const milkPrice =
        milkOptions.find((option) => option.name === customization.milk)?.price ?? 0;
    const upgradePrice =
        upgrades.find((option) => option.name === customization.upgrade)?.price ?? 0;

    return (
        item.price +
        (item.isDrink ? milkPrice + upgradePrice : 0) +
        (customization.temperature === "Iced" && item.isDrink ? 15 : 0)
    );
}

function getCustomizationLabel(customization: Customization) {
    return [
        customization.temperature,
        customization.milk,
        `${customization.sweetness} sweet`,
        customization.upgrade !== "None" ? customization.upgrade : null,
    ]
        .filter(Boolean)
        .join(" · ");
}

export default function Menu() {
    const { menuItems, orderConfirmation } = usePage<MenuPageProps>().props;
    const [category, setCategory] = useState<(typeof categories)[number]>("All");
    const [search, setSearch] = useState("");
    const [icedOnly, setIcedOnly] = useState(false);
    const [caffeineFree, setCaffeineFree] = useState(false);
    const [oatMilkDefault, setOatMilkDefault] = useState(true);
    const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
    const [customization, setCustomization] =
        useState<Customization>(defaultCustomization);
    const [upgrade, setUpgrade] = useState<Upgrade>("None");
    const [cart, setCart] = useState<CartLine[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutName, setCheckoutName] = useState("");
    const [checkoutEmail, setCheckoutEmail] = useState("");
    const [pickupInMinutes, setPickupInMinutes] = useState(20);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderReference, setOrderReference] = useState("");
    const [checkoutError, setCheckoutError] = useState("");
    const [checkoutProcessing, setCheckoutProcessing] = useState(false);

    const visibleItems = useMemo(() => {
        const query = search.trim().toLowerCase();

        return menuItems.filter((item) => {
            const matchesCategory = category === "All" || item.category === category;
            const matchesSearch =
                !query ||
                `${item.name} ${item.notes} ${item.category}`
                    .toLowerCase()
                    .includes(query);
            const matchesIced = !icedOnly || item.category === "Signature Cold Brews";
            const matchesCaffeine =
                !caffeineFree || item.caffeine.toLowerCase().includes("caffeine-free");

            return matchesCategory && matchesSearch && matchesIced && matchesCaffeine;
        });
    }, [category, search, icedOnly, caffeineFree]);

    const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
    const subtotal = cart.reduce(
        (total, line) => total + line.unitPrice * line.quantity,
        0,
    );
    const customizerPrice = customizingItem
        ? getUnitPrice(customizingItem, {
              ...customization,
              upgrade,
          })
        : 0;

    useEffect(() => {
        if (orderConfirmation) {
            setOrderReference(orderConfirmation.reference);
            setOrderConfirmed(true);
        }
    }, [orderConfirmation]);

    useEffect(() => {
        if (!customizingItem && !cartOpen && !checkoutOpen) {
            return;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setCustomizingItem(null);
                setCartOpen(false);
                setCheckoutOpen(false);
            }
        }

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [customizingItem, cartOpen, checkoutOpen]);

    function openCustomizer(item: MenuItem) {
        setCustomizingItem(item);
        setUpgrade("None");
        setCustomization({
            ...defaultCustomization,
            milk: oatMilkDefault ? "Barista Oat Milk" : "Whole Dairy",
            temperature: item.category === "Signature Cold Brews" ? "Iced" : "Hot",
        });
    }

    function addToCart(item: MenuItem, selectedCustomization: Customization) {
        const key = `${item.id}:${JSON.stringify(selectedCustomization)}`;
        const unitPrice = getUnitPrice(item, selectedCustomization);

        setCart((current) => {
            const existing = current.find((line) => line.key === key);
            if (existing) {
                return current.map((line) =>
                    line.key === key
                        ? { ...line, quantity: line.quantity + 1 }
                        : line,
                );
            }

            return [
                ...current,
                {
                    key,
                    item,
                    customization: selectedCustomization,
                    quantity: 1,
                    unitPrice,
                },
            ];
        });
        setCustomizingItem(null);
        setCartOpen(true);
    }

    function changeQuantity(key: string, change: number) {
        setCart((current) =>
            current
                .map((line) =>
                    line.key === key
                        ? { ...line, quantity: line.quantity + change }
                        : line,
                )
                .filter((line) => line.quantity > 0),
        );
    }

    function removeFromCart(key: string) {
        setCart((current) => current.filter((line) => line.key !== key));
    }

    function handleCheckout(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCheckoutError("");
        setCheckoutProcessing(true);
        router.post(
            "/orders",
            {
                customer_name: checkoutName,
                email: checkoutEmail,
                pickup_in_minutes: pickupInMinutes,
                items: cart.map((line) => ({
                    menu_item_id: line.item.id,
                    quantity: line.quantity,
                    customization: {
                        temperature: line.customization.temperature,
                        milk: line.customization.milk,
                        sweetness: line.customization.sweetness,
                        upgrade: line.customization.upgrade,
                    },
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCart([]);
                    setOrderConfirmed(true);
                },
                onError: (errors) => {
                    setCheckoutError(
                        Object.values(errors)[0] ??
                            "We couldn't place your pickup order. Please try again.",
                    );
                },
                onFinish: () => setCheckoutProcessing(false),
            },
        );
    }

    function closeCheckout() {
        setCheckoutOpen(false);
        setOrderConfirmed(false);
    }

    return (
        <main className="min-h-screen bg-[#F7F4EF] text-[#1E1B18]">
            <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#F7F4EF]/90 backdrop-blur-md">
                <nav
                    aria-label="Main navigation"
                    className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-[#78716C] transition-colors hover:text-[#1E1B18]"
                    >
                        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
                        <span className="hidden sm:inline">Back to home</span>
                        <span className="sm:hidden">Home</span>
                    </Link>
                    <Link
                        href="/"
                        aria-label="whisk brew home"
                        className="text-xl font-semibold tracking-[-0.06em]"
                    >
                        whisk
                        <span className="font-serif font-normal italic text-[#8C5A3C]">
                            _brew
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setCartOpen(true)}
                        aria-label={`Open cart, ${cartCount} items, subtotal ${peso(subtotal)}`}
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 transition-all duration-300 ease-out hover:border-[#6B7F69] hover:bg-[#EFECE6]"
                    >
                        <ShoppingBag size={17} strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-xs font-medium">{cartCount}</span>
                        <span className="hidden text-xs text-[#78716C] sm:inline">
                            {peso(subtotal)}
                        </span>
                    </button>
                </nav>
            </header>

            <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:px-12">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7F69]">
                    Made slowly, served warmly
                </p>
                <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="font-serif text-5xl tracking-[-0.045em] sm:text-6xl">
                            The menu<span className="italic text-[#8C5A3C]">.</span>
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#78716C] sm:text-base">
                            Thoughtful little things, whisked and brewed just for you.
                        </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#A8A29E]">
                        Monday – Sunday · 7 AM – 7 PM
                    </p>
                </div>
            </section>

            <section
                aria-label="Search and filter menu"
                className="sticky top-[65px] z-30 border-y border-stone-200/70 bg-[#F7F4EF]/95 backdrop-blur-md"
            >
                <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-12">
                    <label className="flex max-w-xl items-center gap-3 rounded-full border border-stone-200 bg-white/70 px-4 py-3 focus-within:border-[#6B7F69]">
                        <Search
                            size={17}
                            strokeWidth={1.5}
                            className="shrink-0 text-[#78716C]"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Search drinks and tasting notes</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search drinks, notes, or ingredients"
                            className="w-full border-0 bg-transparent p-0 text-sm placeholder:text-[#A8A29E] focus:ring-0"
                        />
                    </label>
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {categories.map((option) => (
                            <button
                                key={option}
                                type="button"
                                aria-pressed={category === option}
                                onClick={() => setCategory(option)}
                                className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-all duration-300 ease-out ${
                                    category === option
                                        ? "border-[#1E1B18] bg-[#1E1B18] text-white"
                                        : "border-stone-200 text-[#78716C] hover:border-[#6B7F69] hover:text-[#3A4D40]"
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto">
                        <SlidersHorizontal
                            size={14}
                            strokeWidth={1.5}
                            className="shrink-0 text-[#A8A29E]"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Quick filters</span>
                        <button
                            type="button"
                            aria-pressed={oatMilkDefault}
                            onClick={() => setOatMilkDefault((value) => !value)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                                oatMilkDefault
                                    ? "bg-[#E6ECE8] text-[#3A4D40]"
                                    : "bg-[#EFECE6] text-[#78716C]"
                            }`}
                        >
                            Oat milk default {oatMilkDefault ? "· On" : "· Off"}
                        </button>
                        <button
                            type="button"
                            aria-pressed={icedOnly}
                            onClick={() => setIcedOnly((value) => !value)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                                icedOnly
                                    ? "bg-[#E6ECE8] text-[#3A4D40]"
                                    : "bg-[#EFECE6] text-[#78716C]"
                            }`}
                        >
                            Iced only
                        </button>
                        <button
                            type="button"
                            aria-pressed={caffeineFree}
                            onClick={() => setCaffeineFree((value) => !value)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                                caffeineFree
                                    ? "bg-[#E6ECE8] text-[#3A4D40]"
                                    : "bg-[#EFECE6] text-[#78716C]"
                            }`}
                        >
                            Caffeine-free
                        </button>
                    </div>
                </div>
            </section>

            <section
                aria-label="Menu items"
                className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12"
            >
                <div className="mb-7 flex items-center justify-between">
                    <p className="text-sm text-[#78716C]">
                        {visibleItems.length} thoughtfully made{" "}
                        {visibleItems.length === 1 ? "favorite" : "favorites"}
                    </p>
                    {(search || icedOnly || caffeineFree) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setIcedOnly(false);
                                setCaffeineFree(false);
                                setCategory("All");
                            }}
                            className="text-xs text-[#6B7F69] underline underline-offset-4"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
                {visibleItems.length ? (
                    <div className="grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleItems.map((item) => (
                            <article
                                key={item.id}
                                className="group rounded-2xl border border-transparent p-2 transition-all duration-300 ease-out hover:border-stone-200/80 hover:bg-white/70"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#EFECE6]">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute left-3 top-3 rounded-full bg-[#F7F4EF]/90 px-3 py-1.5 text-[10px] font-medium text-[#3A4D40] backdrop-blur-sm">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="px-1 pb-1 pt-4">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <h2 className="font-serif text-xl">
                                            {item.name}
                                        </h2>
                                        <span className="shrink-0 text-sm font-medium">
                                            {peso(item.price)}
                                        </span>
                                    </div>
                                    <p className="mt-1 min-h-10 text-sm leading-5 text-[#78716C]">
                                        {item.notes}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#6B7F69]">
                                        <span className="rounded-full bg-[#E6ECE8] px-2.5 py-1">
                                            {item.calories} kcal
                                        </span>
                                        <span className="rounded-full bg-[#EFECE6] px-2.5 py-1">
                                            {item.caffeine}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openCustomizer(item)}
                                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out hover:border-[#6B7F69] hover:bg-[#6B7F69] hover:text-white active:scale-[0.98]"
                                    >
                                        Customize
                                        <ArrowRight
                                            size={15}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl bg-[#EFECE6] px-6 py-16 text-center">
                        <p className="font-serif text-2xl">Nothing on the bar just yet.</p>
                        <p className="mt-2 text-sm text-[#78716C]">
                            Try another search or clear a filter to see more favorites.
                        </p>
                    </div>
                )}
            </section>

            <footer className="border-t border-stone-200/70 bg-[#EFECE6]/60">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-[#78716C] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
                    <Link
                        href="/"
                        className="text-sm font-semibold tracking-[-0.06em] text-[#1E1B18]"
                    >
                        whisk
                        <span className="font-serif font-normal italic text-[#8C5A3C]">
                            _brew
                        </span>
                    </Link>
                    <p>Small batches, made with care.</p>
                    <span>Open daily · 7 AM – 7 PM</span>
                </div>
            </footer>

            {customizingItem && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-[#1E1B18]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setCustomizingItem(null);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="customizer-title"
                        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-[#F7F4EF] shadow-2xl sm:rounded-3xl"
                    >
                        <div className="relative h-40 overflow-hidden sm:h-48">
                            <img
                                src={customizingItem.imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setCustomizingItem(null)}
                                aria-label="Close drink customizer"
                                className="absolute right-4 top-4 rounded-full bg-[#F7F4EF]/90 p-2 backdrop-blur-sm"
                            >
                                <X size={18} strokeWidth={1.5} aria-hidden="true" />
                            </button>
                        </div>
                        <div className="p-5 sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#6B7F69]">
                                        {customizingItem.category}
                                    </p>
                                    <h2
                                        id="customizer-title"
                                        className="mt-1 font-serif text-2xl"
                                    >
                                        {customizingItem.name}
                                    </h2>
                                </div>
                                <span className="pt-1 text-sm font-medium">
                                    {peso(customizerPrice)}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-[#78716C]">
                                {customizingItem.notes}
                            </p>

                            {customizingItem.isDrink ? (
                                <div className="mt-6 space-y-6">
                                    <fieldset>
                                        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.14em]">
                                            Temperature
                                        </legend>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(["Hot", "Iced"] as Temperature[]).map(
                                                (option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        aria-pressed={
                                                            customization.temperature ===
                                                            option
                                                        }
                                                        onClick={() =>
                                                            setCustomization((current) => ({
                                                                ...current,
                                                                temperature: option,
                                                            }))
                                                        }
                                                        className={`rounded-xl border px-4 py-2.5 text-sm ${
                                                            customization.temperature ===
                                                            option
                                                                ? "border-[#6B7F69] bg-[#E6ECE8] text-[#3A4D40]"
                                                                : "border-stone-200"
                                                        }`}
                                                    >
                                                        {option}
                                                        {option === "Iced" && (
                                                            <span className="ml-1 text-xs">
                                                                +₱15
                                                            </span>
                                                        )}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.14em]">
                                            Milk
                                        </legend>
                                        <div className="grid grid-cols-2 gap-2">
                                            {milkOptions.map((option) => (
                                                <button
                                                    key={option.name}
                                                    type="button"
                                                    aria-pressed={
                                                        customization.milk === option.name
                                                    }
                                                    onClick={() =>
                                                        setCustomization((current) => ({
                                                            ...current,
                                                            milk: option.name,
                                                        }))
                                                    }
                                                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs ${
                                                        customization.milk === option.name
                                                            ? "border-[#6B7F69] bg-[#E6ECE8] text-[#3A4D40]"
                                                            : "border-stone-200"
                                                    }`}
                                                >
                                                    <span>{option.name}</span>
                                                    <span className="shrink-0">
                                                        {option.price
                                                            ? `+₱${option.price}`
                                                            : "Included"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.14em]">
                                            Sweetness
                                        </legend>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(
                                                ["0%", "50%", "100%"] as Sweetness[]
                                            ).map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    aria-pressed={
                                                        customization.sweetness === option
                                                    }
                                                    onClick={() =>
                                                        setCustomization((current) => ({
                                                            ...current,
                                                            sweetness: option,
                                                        }))
                                                    }
                                                    className={`rounded-xl border px-2 py-2.5 text-xs ${
                                                        customization.sweetness === option
                                                            ? "border-[#6B7F69] bg-[#E6ECE8] text-[#3A4D40]"
                                                            : "border-stone-200"
                                                    }`}
                                                >
                                                    {option}
                                                    <span className="mt-1 block text-[10px] text-[#78716C]">
                                                        {option === "0%"
                                                            ? "Unsweetened"
                                                            : option === "50%"
                                                              ? "Less sweet"
                                                              : "House standard"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>
                                    {customizingItem.category !==
                                        "Signature Cold Brews" && (
                                        <fieldset>
                                            <legend className="mb-2 text-xs font-medium uppercase tracking-[0.14em]">
                                                Make it special
                                            </legend>
                                            <div className="space-y-2">
                                                {upgrades
                                                    .filter(
                                                        (option) =>
                                                            option.name === "None" ||
                                                            customizingItem.allowedUpgrades.includes(
                                                                option.name,
                                                            ),
                                                    )
                                                    .map((option) => (
                                                        <button
                                                            key={option.name}
                                                            type="button"
                                                            aria-pressed={
                                                                upgrade === option.name
                                                            }
                                                            onClick={() =>
                                                                setUpgrade(option.name)
                                                            }
                                                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                                                                upgrade === option.name
                                                                    ? "border-[#6B7F69] bg-[#E6ECE8] text-[#3A4D40]"
                                                                    : "border-stone-200"
                                                            }`}
                                                        >
                                                            <span className="inline-flex items-center gap-2">
                                                                {upgrade ===
                                                                    option.name && (
                                                                    <Check
                                                                        size={14}
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                {option.name}
                                                            </span>
                                                            <span>
                                                                {option.price
                                                                    ? `+₱${option.price}`
                                                                    : "No upgrade"}
                                                            </span>
                                                        </button>
                                                    ))}
                                            </div>
                                        </fieldset>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-6 rounded-xl bg-[#EFECE6] p-4 text-sm text-[#57534E]">
                                    Freshly baked and ready to enjoy as is.
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    addToCart(customizingItem, {
                                        ...customization,
                                        upgrade: customizingItem.isDrink
                                            ? upgrade
                                            : "None",
                                    })
                                }
                                className="mt-7 inline-flex w-full items-center justify-between rounded-full bg-[#6B7F69] px-5 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#586B57] active:scale-[0.98]"
                            >
                                <span>
                                    {customizingItem.isDrink
                                        ? "Add to order"
                                        : "Add pastry to order"}
                                </span>
                                <span>{peso(customizerPrice)}</span>
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {cartOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-end bg-[#1E1B18]/40 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setCartOpen(false);
                        }
                    }}
                >
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-title"
                        className="flex h-full w-full max-w-md flex-col bg-[#F7F4EF] shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5 sm:px-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6B7F69]">
                                    Freshly made for you
                                </p>
                                <h2 id="cart-title" className="mt-1 font-serif text-2xl">
                                    Your order · {cartCount}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCartOpen(false)}
                                aria-label="Close cart"
                                className="rounded-full p-2 transition-colors hover:bg-[#EFECE6]"
                            >
                                <X size={19} strokeWidth={1.5} aria-hidden="true" />
                            </button>
                        </div>

                        {cart.length ? (
                            <>
                                <div className="flex-1 overflow-y-auto px-5 sm:px-6">
                                    {cart.map((line) => (
                                        <article
                                            key={line.key}
                                            className="flex gap-3 border-b border-stone-200 py-4"
                                        >
                                            <img
                                                src={line.item.imageUrl}
                                                alt=""
                                                className="h-20 w-20 shrink-0 rounded-xl object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="font-serif text-lg leading-tight">
                                                            {line.item.name}
                                                        </h3>
                                                        <p className="mt-1 text-[11px] leading-4 text-[#78716C]">
                                                            {line.item.isDrink
                                                                ? getCustomizationLabel(
                                                                      line.customization,
                                                                  )
                                                                : "Freshly baked"}
                                                        </p>
                                                    </div>
                                                    <span className="shrink-0 text-sm font-medium">
                                                        {peso(
                                                            line.unitPrice * line.quantity,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="inline-flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                changeQuantity(
                                                                    line.key,
                                                                    -1,
                                                                )
                                                            }
                                                            aria-label={`Remove one ${line.item.name}`}
                                                            className="rounded-full border border-stone-200 p-1.5 hover:bg-[#EFECE6]"
                                                        >
                                                            <Minus
                                                                size={13}
                                                                strokeWidth={1.5}
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                        <span className="min-w-4 text-center text-xs">
                                                            {line.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                changeQuantity(
                                                                    line.key,
                                                                    1,
                                                                )
                                                            }
                                                            aria-label={`Add one ${line.item.name}`}
                                                            className="rounded-full border border-stone-200 p-1.5 hover:bg-[#EFECE6]"
                                                        >
                                                            <Plus
                                                                size={13}
                                                                strokeWidth={1.5}
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeFromCart(line.key)
                                                        }
                                                        aria-label={`Remove ${line.item.name} from cart`}
                                                        className="rounded-full p-2 text-[#A8A29E] transition-colors hover:bg-[#EFECE6] hover:text-[#8C5A3C]"
                                                    >
                                                        <Trash2
                                                            size={15}
                                                            strokeWidth={1.5}
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                <div className="border-t border-stone-200 bg-white/50 px-5 py-5 sm:px-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#78716C]">Subtotal</span>
                                        <span className="font-medium">
                                            {peso(subtotal)}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs text-[#78716C]">
                                        Estimated prep time: 8–12 minutes
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCartOpen(false);
                                            setCheckoutOpen(true);
                                            setOrderConfirmed(false);
                                        }}
                                        className="mt-5 w-full rounded-full bg-[#6B7F69] px-5 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#586B57] active:scale-[0.98]"
                                    >
                                        Proceed to checkout
                                    </button>
                                    <p className="mt-3 text-center text-[10px] text-[#A8A29E]">
                                        Pickup order · Pay at the cafe
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
                                <ShoppingBag
                                    size={28}
                                    strokeWidth={1.3}
                                    className="text-[#A8A29E]"
                                    aria-hidden="true"
                                />
                                <p className="mt-4 font-serif text-xl">
                                    Your bag is still empty.
                                </p>
                                <p className="mt-2 text-sm text-[#78716C]">
                                    Pick something lovely from the menu.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setCartOpen(false)}
                                    className="mt-5 inline-flex items-center gap-2 text-sm text-[#6B7F69]"
                                >
                                    <ArrowLeft size={15} aria-hidden="true" />
                                    Back to menu
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            )}

            {checkoutOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#1E1B18]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="checkout-title"
                        className="w-full max-w-md rounded-t-3xl bg-[#F7F4EF] p-6 shadow-2xl sm:rounded-3xl"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6B7F69]">
                                    Pickup · Pay at the cafe
                                </p>
                                <h2
                                    id="checkout-title"
                                    className="mt-1 font-serif text-2xl"
                                >
                                    {orderConfirmed
                                        ? "Pickup details noted"
                                        : "Almost something lovely"}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeCheckout}
                                aria-label="Close checkout"
                                className="rounded-full p-2 hover:bg-[#EFECE6]"
                            >
                                <X size={18} strokeWidth={1.5} aria-hidden="true" />
                            </button>
                        </div>
                        {orderConfirmed ? (
                            <div className="mt-5">
                                <p className="text-sm leading-6 text-[#57534E]">
                                    Thank you, {checkoutName}. Your pickup order has
                                    been saved. Reference:{" "}
                                    <span className="font-medium">{orderReference}</span>.
                                </p>
                                <p className="mt-4 rounded-xl bg-[#E6ECE8] p-4 text-sm leading-6 text-[#3A4D40]">
                                    Pickup in {pickupInMinutes} minutes. Pay at the cafe;
                                    no online payment was taken.
                                </p>
                                <button
                                    type="button"
                                    onClick={closeCheckout}
                                    className="mt-5 w-full rounded-full bg-[#6B7F69] px-5 py-3 text-sm font-medium text-white hover:bg-[#586B57]"
                                >
                                    Back to menu
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCheckout} className="mt-5">
                                <p className="mb-5 flex justify-between rounded-xl bg-[#EFECE6] p-4 text-sm">
                                    <span className="text-[#78716C]">
                                        {cartCount} items
                                    </span>
                                    <span className="font-medium">
                                        {peso(subtotal)}
                                    </span>
                                </p>
                                <label
                                    htmlFor="menu-checkout-name"
                                    className="mb-4 block text-sm font-medium"
                                >
                                    Name for pickup
                                    <input
                                        id="menu-checkout-name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={checkoutName}
                                        onChange={(event) =>
                                            setCheckoutName(event.target.value)
                                        }
                                        className="mt-2 block w-full rounded-xl border-stone-200 bg-white px-4 py-3 text-sm focus:border-[#6B7F69] focus:ring-[#6B7F69]"
                                    />
                                </label>
                                <label
                                    htmlFor="menu-checkout-email"
                                    className="block text-sm font-medium"
                                >
                                    Email
                                    <input
                                        id="menu-checkout-email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={checkoutEmail}
                                        onChange={(event) =>
                                            setCheckoutEmail(event.target.value)
                                        }
                                        className="mt-2 block w-full rounded-xl border-stone-200 bg-white px-4 py-3 text-sm focus:border-[#6B7F69] focus:ring-[#6B7F69]"
                                    />
                                </label>
                                <label
                                    htmlFor="menu-pickup-time"
                                    className="mt-4 block text-sm font-medium"
                                >
                                    Pickup time
                                    <select
                                        id="menu-pickup-time"
                                        value={pickupInMinutes}
                                        onChange={(event) =>
                                            setPickupInMinutes(
                                                Number(event.target.value),
                                            )
                                        }
                                        className="mt-2 block w-full rounded-xl border-stone-200 bg-white px-4 py-3 text-sm focus:border-[#6B7F69] focus:ring-[#6B7F69]"
                                    >
                                        <option value={10}>In 10 minutes</option>
                                        <option value={20}>In 20 minutes</option>
                                        <option value={30}>In 30 minutes</option>
                                        <option value={45}>In 45 minutes</option>
                                    </select>
                                </label>
                                {checkoutError && (
                                    <p role="alert" className="mt-4 text-sm text-red-700">
                                        {checkoutError}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={checkoutProcessing}
                                    className="mt-6 w-full rounded-full bg-[#6B7F69] px-5 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#586B57] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                                >
                                    {checkoutProcessing
                                        ? "Placing order…"
                                        : "Place pickup order"}
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
}
