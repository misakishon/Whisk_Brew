import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Plus, Check, Sparkles, ArrowRight } from "lucide-react";
import { MenuItem, CategoryFilter } from "../../types/whisk";

interface MenuSectionProps {
    items: MenuItem[];
    onAddToCart: (item: MenuItem) => void;
}

const CATEGORIES: CategoryFilter[] = [
    "All",
    "Coffee",
    "Matcha",
    "Non-Coffee",
    "Pastries",
];

export default function MenuSection({ items, onAddToCart }: MenuSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
    const [addedId, setAddedId] = useState<number | null>(null);

    const filteredItems =
        selectedCategory === "All"
            ? items
            : items.filter((item) => item.category === selectedCategory);

    // Featured Latte for the spotlight showcase on the right
    const featuredLatte = items.find((i) => i.id === 7) || items[2];

    const handleAdd = (item: MenuItem) => {
        onAddToCart(item);
        setAddedId(item.id);
        setTimeout(() => setAddedId(null), 1200);
    };

    return (
        <section
            id="menu"
            aria-labelledby="menu-heading"
            className="w-full max-w-7xl mx-auto px-5 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:px-12 scroll-mt-20"
        >
            {/* Clean, Compact Header Section */}
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-stone-200/70 pb-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#955B3D]" />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#955B3D]">
                            OUR MENU
                        </p>
                    </div>
                    <h2
                        id="menu-heading"
                        className="mt-1.5 font-serif text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] text-[#1C1917] font-normal"
                    >
                        Great coffee,{" "}
                        <span className="font-serif italic font-normal text-[#955B3D]">
                            better moments.
                        </span>
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#78716C] font-sans">
                        From rich espresso to refreshing matcha, each cup is crafted with care,
                        using premium ingredients and time-honored techniques.
                    </p>
                </div>

                {/* Category Filters */}
                <div
                    role="tablist"
                    aria-label="Filter menu items by category"
                    className="flex flex-wrap gap-1.5 sm:gap-2"
                >
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={isSelected}
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                    isSelected
                                        ? "bg-[#1C1917] text-white shadow-xs"
                                        : "bg-white text-[#78716C] border border-stone-200/90 hover:border-[#955B3D] hover:text-[#955B3D]"
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Menu Layout: Product Grid + Featured Latte Spotlight */}
            <div className="mt-7 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-8">
                {/* Product Grid (Left 8 cols on desktop) */}
                <div className="lg:col-span-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {filteredItems.map((item) => {
                        const isJustAdded = addedId === item.id;
                        return (
                            <article
                                key={item.id}
                                className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-stone-300"
                            >
                                <div>
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F0ECE1]">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                        <span className="absolute left-3 top-3 rounded-full bg-[#F8F5F0]/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#102B24] backdrop-blur-sm shadow-xs border border-stone-200/40">
                                            {item.tag}
                                        </span>
                                    </div>

                                    <div className="mt-4 px-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <h3 className="font-serif text-xl font-medium tracking-tight text-[#1C1917]">
                                                {item.name}
                                            </h3>
                                            <span className="shrink-0 text-sm font-semibold text-[#1C1917]">
                                                ${item.usdPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-xs text-[#78716C] leading-relaxed line-clamp-2 min-h-[2.25rem]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3.5 flex items-center justify-between border-t border-stone-100 px-1 pt-2.5">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                                        {item.category}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleAdd(item)}
                                        aria-label={`Add ${item.name} to order bag`}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                            isJustAdded
                                                ? "bg-[#102B24] text-white"
                                                : "bg-[#F8F5F0] text-[#1C1917] border border-stone-200 hover:bg-[#955B3D] hover:border-[#955B3D] hover:text-white"
                                        }`}
                                    >
                                        {isJustAdded ? (
                                            <>
                                                <Check size={13} strokeWidth={2} />
                                                <span>Added</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={13} strokeWidth={2} />
                                                <span>Add</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Large Featured Latte Photograph with Compact Card (Right 4 cols on desktop) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-3 shadow-sm">
                        <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-2xl bg-[#F0ECE1]">
                            <img
                                src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=85"
                                alt="Artisanal latte with intricate leaf latte art in a handcrafted ceramic mug"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

                            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#102B24]/90 px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
                                <Sparkles size={11} />
                                FEATURED SPECIALTY
                            </span>

                            {/* Compact Information Card over lower portion */}
                            <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/60 bg-[#F8F5F0]/95 p-3.5 shadow-md backdrop-blur-md">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#955B3D]">
                                            SIGNATURE CREATION
                                        </p>
                                        <h3 className="mt-0.5 font-serif text-lg font-medium text-[#1C1917]">
                                            {featuredLatte.name}
                                        </h3>
                                    </div>
                                    <span className="text-sm font-semibold text-[#1C1917]">
                                        ${featuredLatte.usdPrice.toFixed(2)}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-[#78716C] leading-snug">
                                    Double espresso, textured milk, raw muscovado caramel.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleAdd(featuredLatte)}
                                    className="mt-2.5 w-full rounded-full bg-[#955B3D] py-2 text-center text-xs font-medium text-white transition-colors hover:bg-[#7D492E] shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    <Plus size={13} strokeWidth={2} />
                                    <span>Add to bag · ${featuredLatte.usdPrice.toFixed(2)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clean, low-profile catalog bar with no excess whitespace */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-stone-200/70 bg-white/80 px-5 py-3 shadow-xs">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#955B3D]" />
                    <p className="text-xs text-[#78716C]">
                        Looking for all single origins, custom milks, and seasonal selections?
                    </p>
                </div>
                <Link
                    href="/menu"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1C1917] px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-colors shadow-xs group"
                >
                    <span>Explore full menu</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    );
}
