import React, { useState } from "react";
import { Sparkles, Flame, Users, ArrowRight, X } from "lucide-react";

export default function CraftSection() {
    const [craftModalOpen, setCraftModalOpen] = useState(false);

    const pillars = [
        {
            icon: Sparkles,
            title: "Premium Ingredients",
            quote: "Only the best, always.",
            description:
                "Sourced directly from family tea farms in Uji and ethically certified single-origin coffee cooperatives.",
        },
        {
            icon: Flame,
            title: "Small-Batch Roasts",
            quote: "Freshness in every cup.",
            description:
                "Roasted weekly in small quantities to preserve the volatile origin aromatics, delicate florals, and natural sugars.",
        },
        {
            icon: Users,
            title: "A Cozy Space",
            quote: "Good food. Great company.",
            description:
                "Designed with natural wood, warm ambient light, and welcoming bar seating for unhurried neighborhood pauses.",
        },
    ];

    return (
        <section
            id="craft"
            aria-labelledby="craft-heading"
            className="w-full max-w-7xl mx-auto px-5 pt-4 sm:pt-6 pb-14 sm:pb-18 lg:pb-20 lg:px-12 scroll-mt-20"
        >
            <div className="rounded-3xl border border-stone-200/80 bg-white p-7 sm:p-10 md:p-14 lg:p-16 shadow-sm">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
                    {/* Left: Cozy Coffee Shop Interior Photograph */}
                    <div className="lg:col-span-6 order-2 lg:order-1">
                        <div className="relative aspect-[4/3.8] w-full overflow-hidden rounded-2xl bg-[#F0ECE1] shadow-md border border-stone-200/60">
                            <img
                                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85"
                                alt="Cozy specialty cafe interior with warm natural wooden furniture and ambient lighting"
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Right: Craft Philosophy & 3 Feature Items */}
                    <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#955B3D]">
                            OUR PHILOSOPHY
                        </p>
                        <h2
                            id="craft-heading"
                            className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.03em] text-[#1C1917]"
                        >
                            Thoughtfully crafted,{" "}
                            <span className="font-serif italic text-[#955B3D]">always.</span>
                        </h2>

                        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#78716C] font-sans">
                            We believe that taking a quiet pause makes everything better.
                            From sourcing stone-ground ceremonial matcha to pairing single-origin
                            pour overs with laminated pastries baked fresh before sunrise,
                            every ritual is executed with intention.
                        </p>

                        {/* Three Concise Feature Items */}
                        <div className="mt-8 space-y-6">
                            {pillars.map((pillar) => {
                                const IconComponent = pillar.icon;
                                return (
                                    <div
                                        key={pillar.title}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3EAE3] text-[#102B24] border border-[#D0DDD0]/60">
                                            <IconComponent size={19} strokeWidth={1.8} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-sm font-semibold text-[#1C1917]">
                                                    {pillar.title}
                                                </h3>
                                                <span className="text-xs font-serif italic text-[#955B3D]">
                                                    {pillar.quote}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs sm:text-sm text-[#78716C] leading-normal">
                                                {pillar.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Functional Learn More Action */}
                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={() => setCraftModalOpen(true)}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] transition-colors hover:text-[#955B3D] group cursor-pointer"
                            >
                                <span>Learn more about our standards</span>
                                <ArrowRight
                                    size={15}
                                    strokeWidth={1.7}
                                    className="transition-transform group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learn More Philosophy Modal */}
            {craftModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="craft-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onClick={() => setCraftModalOpen(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-[#F8F5F0] p-6 sm:p-8 shadow-2xl border border-stone-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#955B3D]">
                                    THE WHISK &amp; BREW STANDARD
                                </p>
                                <h3 id="craft-modal-title" className="font-serif text-2xl text-[#1C1917] mt-1">
                                    Our Craft Commitments
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCraftModalOpen(false)}
                                className="rounded-full p-1.5 hover:bg-stone-200/60 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4 text-sm text-[#78716C] leading-relaxed">
                            <p>
                                <strong className="text-[#1C1917]">Ceremonial Sourcing:</strong> Every tin of matcha is imported vacuum-sealed from Uji, Kyoto. Cultivated from first-harvest tencha leaves shaded under traditional straw mats (honzu), it guarantees sweet natural chlorophyll without artificial bitterness.
                            </p>
                            <p>
                                <strong className="text-[#1C1917]">Transparent Micro-lots:</strong> We partner with independent coffee producers who practice agroforestry and water-preserving processing methods.
                            </p>
                            <p>
                                <strong className="text-[#1C1917]">Handcrafted Daily:</strong> Our bakes feature butter sourced locally, organic flours, and zero commercial shelf-life extenders.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setCraftModalOpen(false)}
                                className="rounded-full bg-[#1C1917] px-5 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors"
                            >
                                Close &amp; return
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
