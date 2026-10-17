import React, { useState, type FormEvent } from "react";
import { Link } from "@inertiajs/react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    MapPin,
    Menu as MenuIcon,
    Minus,
    Plus,
    ShoppingBag,
    X,
} from "lucide-react";

interface FeaturedItem {
    id: number;
    name: string;
    category: string;
    description: string;
    price: string;
    tag: string;
    imageUrl: string;
}

interface FeatureHighlight {
    number: string;
    name: string;
    description: string;
    detail: string;
}

const categories = ["All", "Slow Brew", "Whisked Matcha", "Artisanal Pastry"];

const featuredItems: FeaturedItem[] = [
    {
        id: 1,
        name: "Honey Oat Flat White",
        category: "Slow Brew",
        description: "Double espresso, local honey, silky oat milk.",
        price: "$5.50",
        tag: "House favorite",
        imageUrl:
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 2,
        name: "Uji Cloud Matcha",
        category: "Whisked Matcha",
        description: "Stone-ground Uji matcha, whisked to order.",
        price: "$6.00",
        tag: "Ceremonial grade",
        imageUrl:
            "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 3,
        name: "Brown Butter Croissant",
        category: "Artisanal Pastry",
        description: "Slow-laminated, baked fresh every morning.",
        price: "$4.75",
        tag: "Baked daily",
        imageUrl:
            "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 4,
        name: "Ethiopia Pour Over",
        category: "Slow Brew",
        description: "Bergamot, stone fruit, and a honeyed finish.",
        price: "$6.50",
        tag: "Single origin",
        imageUrl:
            "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 5,
        name: "Strawberry Matcha",
        category: "Whisked Matcha",
        description: "Bright Uji matcha layered over ripe berries.",
        price: "$6.75",
        tag: "Seasonal",
        imageUrl:
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 6,
        name: "Rosemary Morning Bun",
        category: "Artisanal Pastry",
        description: "Citrus sugar, flaky layers, a little rosemary.",
        price: "$5.00",
        tag: "Small batch",
        imageUrl:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    },
];

const philosophy: FeatureHighlight[] = [
    {
        number: "01",
        name: "The Whisk",
        description:
            "A slower kind of morning, rooted in the quiet ritual of a bowl and a bamboo whisk.",
        detail:
            "We source ceremonial-grade matcha from Uji, Japan, and pair every cup with pastries laminated by hand before sunrise.",
    },
    {
        number: "02",
        name: "The Brew",
        description:
            "Good coffee starts long before it reaches your cup. We like to know the whole story.",
        detail:
            "Our rotating single origins come from thoughtful growers, roasted in small batches, and brewed with patience and precision.",
    },
];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [cart, setCart] = useState<Record<number, number>>({});
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutStage, setCheckoutStage] = useState<
        "cart" | "checkout" | "confirmation"
    >("cart");
    const [pickupName, setPickupName] = useState("");
    const [checkoutEmail, setCheckoutEmail] = useState("");
    const [pickupTime, setPickupTime] = useState("In 20 minutes");
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const cartItems = featuredItems
        .map((item) => ({ ...item, quantity: cart[item.id] ?? 0 }))
        .filter((item) => item.quantity > 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const subtotal = cartItems.reduce(
        (total, item) =>
            total + Number.parseFloat(item.price.replace("$", "")) * item.quantity,
        0,
    );

    const visibleItems =
        activeCategory === "All"
            ? featuredItems
            : featuredItems.filter((item) => item.category === activeCategory);

    function updateCart(itemId: number, change: number) {
        setCart((currentCart) => {
            const quantity = (currentCart[itemId] ?? 0) + change;
            const nextCart = { ...currentCart };

            if (quantity > 0) {
                nextCart[itemId] = quantity;
            } else {
                delete nextCart[itemId];
            }

            return nextCart;
        });
    }

    function openCart() {
        setCheckoutStage("cart");
        setCartOpen(true);
    }

    function closeCart() {
        setCartOpen(false);
        setCheckoutStage("cart");
    }

    function handlePickupSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCheckoutStage("confirmation");
    }

    function handleSubscribe(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
        }
    }

    return (
        <main className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
            <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#FAF8F5]/90 backdrop-blur-md">
                <nav
                    aria-label="Main navigation"
                    className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
                >
                    <a
                        href="#home"
                        aria-label="whisk brew home"
                        className="text-xl font-semibold tracking-[-0.06em]"
                    >
                        <span>whisk</span>
                        <span className="font-serif font-normal italic text-[#8C5A3C]">
                            _brew
                        </span>
                    </a>

                    <div className="hidden items-center gap-9 text-sm text-[#78716C] md:flex">
                        <Link
                            className="transition-colors hover:text-[#1C1917]"
                            href="/menu"
                        >
                            Menu
                        </Link>
                        <a className="transition-colors hover:text-[#1C1917]" href="#craft">
                            The Craft
                        </a>
                        <a className="transition-colors hover:text-[#1C1917]" href="#visit">
                            Locations
                        </a>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <button
                            type="button"
                            onClick={openCart}
                            aria-label={`Shopping bag, ${cartCount} items`}
                            className="relative rounded-full p-2 transition-colors hover:bg-[#F3EFEA]"
                        >
                            <ShoppingBag size={19} strokeWidth={1.5} aria-hidden="true" />
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8C5A3C] px-1 text-[10px] font-medium text-white">
                                {cartCount}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={openCart}
                            className="hidden rounded-full bg-[#8C5A3C] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#73482F] active:scale-[0.98] sm:inline-flex"
                        >
                            Order ahead
                        </button>
                        <Link
                            href="/menu"
                            aria-label="Browse the menu"
                            className="rounded-full p-2 transition-colors hover:bg-[#F3EFEA] md:hidden"
                        >
                            <MenuIcon size={20} strokeWidth={1.5} aria-hidden="true" />
                        </Link>
                    </div>
                </nav>
            </header>

            {cartOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-end justify-center bg-[#1C1917]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeCart();
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-dialog-title"
                        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[#FAF8F5] shadow-2xl sm:rounded-3xl"
                    >
                        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8C5A3C]">
                                    Whisk_brew pickup
                                </p>
                                <h2
                                    id="cart-dialog-title"
                                    className="mt-1 font-serif text-2xl"
                                >
                                    {checkoutStage === "confirmation"
                                        ? "Pickup summary"
                                        : checkoutStage === "checkout"
                                          ? "A few details"
                                          : `Your bag (${cartCount})`}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeCart}
                                aria-label="Close bag"
                                className="rounded-full p-2 transition-colors hover:bg-[#F3EFEA]"
                            >
                                <X size={19} strokeWidth={1.5} aria-hidden="true" />
                            </button>
                        </div>

                        {checkoutStage === "confirmation" ? (
                            <div className="overflow-y-auto px-6 py-6">
                                <p className="font-serif text-xl">
                                    Thanks, {pickupName}.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[#78716C]">
                                    Your pickup details are ready for{" "}
                                    {pickupTime.toLowerCase()}. A summary for{" "}
                                    {checkoutEmail} would be sent after checkout is connected.
                                </p>
                                <div className="mt-5 rounded-2xl bg-[#E6ECE8] p-4 text-sm leading-6 text-[#3A4D40]">
                                    This is a demo checkout. No order was sent to
                                    the cafe and no payment was taken.
                                </div>
                                <button
                                    type="button"
                                    onClick={closeCart}
                                    className="mt-6 w-full rounded-full bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#73482F] active:scale-[0.98]"
                                >
                                    Back to the menu
                                </button>
                            </div>
                        ) : checkoutStage === "checkout" ? (
                            <form
                                onSubmit={handlePickupSubmit}
                                className="overflow-y-auto px-6 py-6"
                            >
                                <div className="mb-6 rounded-2xl bg-[#F3EFEA] p-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#78716C]">
                                            {cartCount} {cartCount === 1 ? "item" : "items"}
                                        </span>
                                        <span className="font-medium">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-[#78716C]">
                                        Pickup at whisk_brew · Pay in person
                                    </p>
                                </div>
                                <label
                                    htmlFor="pickup-name"
                                    className="mb-4 block text-sm font-medium"
                                >
                                    Name for your order
                                    <input
                                        id="pickup-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={pickupName}
                                        onChange={(event) =>
                                            setPickupName(event.target.value)
                                        }
                                        className="mt-2 block w-full rounded-xl border-stone-200 bg-white px-4 py-3 text-sm focus:border-[#8C5A3C] focus:ring-[#8C5A3C]"
                                    />
                                </label>
                                <label
                                    htmlFor="pickup-email"
                                    className="mb-4 block text-sm font-medium"
                                >
                                    Email address
                                    <input
                                        id="pickup-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={checkoutEmail}
                                        onChange={(event) =>
                                            setCheckoutEmail(event.target.value)
                                        }
                                        className="mt-2 block w-full rounded-xl border-stone-200 bg-white px-4 py-3 text-sm focus:border-[#8C5A3C] focus:ring-[#8C5A3C]"
                                    />
                                </label>
                                <label
                                    htmlFor="pickup-time"
                                    className="block text-sm font-medium"
                                >
                                    Pickup time
                                    <select
                                        id="pickup-time"
                                        name="pickupTime"
                                        value={pickupTime}
                                        onChange={(event) =>
                                            setPickupTime(event.target.value)
                                        }
                                        className="mt-2 block w-full rounded-xl border-stone-200 bg-white px-4 py-3 text-sm focus:border-[#8C5A3C] focus:ring-[#8C5A3C]"
                                    >
                                        <option>In 10 minutes</option>
                                        <option>In 20 minutes</option>
                                        <option>In 30 minutes</option>
                                        <option>In 45 minutes</option>
                                    </select>
                                </label>
                                <div className="mt-6 grid grid-cols-[auto_1fr] gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCheckoutStage("cart")}
                                        aria-label="Back to bag"
                                        className="rounded-full border border-stone-200 px-4 py-3 transition-colors hover:bg-[#F3EFEA]"
                                    >
                                        <ArrowLeft
                                            size={17}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-full bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#73482F] active:scale-[0.98]"
                                    >
                                        Review pickup
                                    </button>
                                </div>
                            </form>
                        ) : cartItems.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <ShoppingBag
                                    size={28}
                                    strokeWidth={1.3}
                                    className="mx-auto text-[#A8A29E]"
                                    aria-hidden="true"
                                />
                                <p className="mt-4 font-serif text-xl">
                                    Your bag is taking a little break.
                                </p>
                                <p className="mt-2 text-sm text-[#78716C]">
                                    Add a coffee, matcha, or pastry to get started.
                                </p>
                                <button
                                    type="button"
                                    onClick={closeCart}
                                    className="mt-6 rounded-full bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#73482F] active:scale-[0.98]"
                                >
                                    Browse the menu
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-y-auto px-6">
                                    {cartItems.map((item) => (
                                        <article
                                            key={item.id}
                                            className="flex gap-4 border-b border-stone-200 py-4"
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt=""
                                                className="h-20 w-20 rounded-xl object-cover"
                                            />
                                            <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="font-serif text-lg leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    <span className="shrink-0 text-sm font-medium">
                                                        $
                                                        {(
                                                            Number.parseFloat(
                                                                item.price.replace("$", ""),
                                                            ) * item.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateCart(item.id, -1)
                                                        }
                                                        aria-label={`Remove one ${item.name}`}
                                                        className="rounded-full border border-stone-200 p-1.5 transition-colors hover:bg-[#F3EFEA]"
                                                    >
                                                        <Minus
                                                            size={13}
                                                            strokeWidth={1.5}
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                    <span className="min-w-4 text-center text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateCart(item.id, 1)
                                                        }
                                                        aria-label={`Add one ${item.name}`}
                                                        className="rounded-full border border-stone-200 p-1.5 transition-colors hover:bg-[#F3EFEA]"
                                                    >
                                                        <Plus
                                                            size={13}
                                                            strokeWidth={1.5}
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                <div className="border-t border-stone-200 bg-white/60 px-6 py-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#78716C]">Subtotal</span>
                                        <span className="font-medium">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-[#78716C]">
                                        Tax calculated at the cafe. Pay when you pick up.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setCheckoutStage("checkout")}
                                        className="mt-5 w-full rounded-full bg-[#8C5A3C] px-5 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#73482F] active:scale-[0.98]"
                                    >
                                        Continue to pickup details
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            )}

            <section
                id="home"
                aria-labelledby="hero-heading"
                className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-24"
            >
                <div className="lg:col-span-7">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E2DC] bg-[#E6ECE8] px-4 py-2 text-xs font-medium tracking-wide text-[#3A4D40] sm:text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6D806E]" />
                        Small-batch roasts &amp; ceremonial matcha
                    </span>
                    <h1
                        id="hero-heading"
                        className="mt-7 max-w-3xl font-serif text-5xl leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl"
                    >
                        Where the whisk meets the{" "}
                        <span className="italic text-[#8C5A3C]">slow brew.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-[#78716C] sm:text-lg sm:leading-8">
                        A neighborhood pause for thoughtfully sourced coffee,
                        hand-whisked matcha, and something warm from the oven.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-5">
                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-3 rounded-full bg-[#8C5A3C] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#73482F] active:scale-[0.98]"
                        >
                            Explore the menu
                            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                        </Link>
                        <a
                            href="#visit"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] transition-colors hover:text-[#8C5A3C]"
                        >
                            Find a cafe
                            <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                        </a>
                    </div>
                    <a
                        href="#menu"
                        className="mt-14 hidden items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#A8A29E] transition-colors hover:text-[#8C5A3C] lg:inline-flex"
                    >
                        A little goodness, daily
                        <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
                    </a>
                </div>

                <div className="relative lg:col-span-5">
                    <div className="group relative aspect-[4/4.6] overflow-hidden rounded-2xl bg-[#F3EFEA]">
                        <img
                            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=90"
                            alt="Freshly brewed coffee in the warm morning light"
                            fetchPriority="high"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/50 bg-[#FAF8F5]/85 p-4 shadow-sm backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#78716C]">
                            On the bar today
                        </p>
                        <div className="mt-1.5 flex items-end justify-between gap-4">
                            <div>
                                <p className="font-serif text-xl">Ethiopia Yirgacheffe</p>
                                <p className="mt-1 text-xs text-[#78716C]">
                                    Floral · citrus · honey
                                </p>
                            </div>
                            <span className="rounded-full bg-[#E6ECE8] px-3 py-1.5 text-[10px] font-medium text-[#3A4D40]">
                                Single origin
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="menu"
                aria-labelledby="menu-heading"
                className="border-t border-stone-200/70 bg-white/40"
            >
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C5A3C]">
                                Made with intention
                            </p>
                            <h2
                                id="menu-heading"
                                className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl"
                            >
                                A few favorites.
                            </h2>
                        </div>
                        <div
                            aria-label="Filter menu by category"
                            className="flex flex-wrap gap-2"
                        >
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    aria-pressed={activeCategory === category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`rounded-full border px-4 py-2 text-xs transition-all duration-300 ease-out sm:text-sm ${
                                        activeCategory === category
                                            ? "border-[#1C1917] bg-[#1C1917] text-white"
                                            : "border-stone-200 bg-transparent text-[#78716C] hover:border-[#8C5A3C] hover:text-[#8C5A3C]"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
                        {visibleItems.map((item) => (
                            <article
                                key={item.id}
                                className="group rounded-2xl border border-transparent p-2 transition-all duration-300 ease-out hover:border-stone-200/80 hover:bg-white"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F3EFEA]">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute left-3 top-3 rounded-full bg-[#FAF8F5]/90 px-3 py-1.5 text-[10px] font-medium tracking-wide text-[#3A4D40] backdrop-blur-sm">
                                        {item.tag}
                                    </span>
                                </div>
                                <div className="px-1 pb-1 pt-4">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <h3 className="font-serif text-xl tracking-[-0.02em]">
                                            {item.name}
                                        </h3>
                                        <span className="shrink-0 text-sm font-medium">
                                            {item.price}
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-[#78716C]">
                                        {item.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#A8A29E]">
                                            {item.category}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => updateCart(item.id, 1)}
                                            aria-label={`Add ${item.name} to bag`}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out hover:border-[#8C5A3C] hover:bg-[#8C5A3C] hover:text-white active:scale-[0.98]"
                                        >
                                            <Plus
                                                size={13}
                                                strokeWidth={1.5}
                                                aria-hidden="true"
                                            />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="craft"
                aria-labelledby="craft-heading"
                className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
            >
                <div className="rounded-3xl bg-[#F3EFEA] p-7 sm:p-10 md:p-12 lg:p-16">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C5A3C]">
                                What we believe
                            </p>
                            <h2
                                id="craft-heading"
                                className="mt-4 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl"
                            >
                                Two rituals, one good morning.
                            </h2>
                        </div>
                        <div className="grid gap-9 sm:grid-cols-2 sm:gap-8">
                            {philosophy.map((feature) => (
                                <article
                                    key={feature.number}
                                    className="border-t border-stone-300/80 pt-5"
                                >
                                    <p className="text-xs tracking-[0.15em] text-[#8C5A3C]">
                                        {feature.number} / THE{" "}
                                        {feature.name.toUpperCase()}
                                    </p>
                                    <h3 className="mt-5 font-serif text-3xl">
                                        {feature.name}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-[#57534E]">
                                        {feature.description}
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-[#78716C]">
                                        {feature.detail}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="visit"
                aria-label="Visit whisk brew"
                className="border-y border-stone-200/70 bg-white/40"
            >
                <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3 md:gap-8 lg:px-12">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A8A29E]">
                            Come say hello
                        </p>
                        <a
                            href="https://maps.google.com/?q=whisk+brew+cafe"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-start gap-2 text-sm leading-6 transition-colors hover:text-[#8C5A3C]"
                        >
                            <MapPin
                                size={17}
                                strokeWidth={1.5}
                                className="mt-0.5 shrink-0 text-[#8C5A3C]"
                                aria-hidden="true"
                            />
                            <span>
                                24 Garden Lane
                                <br />
                                Portland, OR 97205
                            </span>
                        </a>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A8A29E]">
                            A little every day
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[#57534E]">
                            Monday – Sunday
                            <br />
                            7:00 AM – 7:00 PM
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="newsletter-email"
                            className="text-xs font-medium uppercase tracking-[0.18em] text-[#A8A29E]"
                        >
                            Notes from the cafe
                        </label>
                        {subscribed ? (
                            <p
                                role="status"
                                className="mt-3 text-sm text-[#3A4D40]"
                            >
                                Thanks for joining us. See you in your inbox.
                            </p>
                        ) : (
                            <form
                                onSubmit={handleSubscribe}
                                className="mt-3 flex max-w-sm border-b border-stone-300 focus-within:border-[#8C5A3C]"
                            >
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Your email address"
                                    className="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-sm placeholder:text-[#A8A29E] focus:outline-none focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe to cafe updates"
                                    className="p-2 text-[#8C5A3C] transition-colors hover:text-[#73482F]"
                                >
                                    <ArrowRight
                                        size={17}
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                    />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-[#78716C] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
                <a
                    href="#home"
                    className="w-fit text-sm font-semibold tracking-[-0.06em] text-[#1C1917]"
                >
                    whisk
                    <span className="font-serif font-normal italic text-[#8C5A3C]">
                        _brew
                    </span>
                </a>
                <p>© {new Date().getFullYear()} whisk_brew. Made with care.</p>
                <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit whisk brew on Instagram"
                    className="inline-flex w-fit items-center gap-2 transition-colors hover:text-[#8C5A3C]"
                >
                    <ArrowUpRight
                        size={15}
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                    Instagram
                </a>
            </footer>
        </main>
    );
}
