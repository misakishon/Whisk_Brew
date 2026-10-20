import React from "react";
import { Link } from "@inertiajs/react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

export default function HeroSection() {
    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.pushState(null, "", `#${targetId}`);
        }
    };

    return (
        <section
            id="home"
            aria-labelledby="hero-heading"
            className="w-full max-w-7xl mx-auto px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 grid items-center gap-12 lg:grid-cols-12 lg:gap-10 min-h-[calc(100vh-80px)]"
        >
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-center">
                {/* Sage Green Pill */}
                <div className="w-fit">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D0DDD0] bg-[#E3EAE3] px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#102B24]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#102B24]" />
                        Small-batch roasts &amp; ceremonial matcha
                    </span>
                </div>

                {/* Main Headline */}
                <h1
                    id="hero-heading"
                    className="mt-6 max-w-3xl font-serif text-5xl leading-[1.08] tracking-[-0.04em] text-[#1C1917] sm:text-6xl lg:text-7xl font-normal"
                >
                    Where the whisk meets the{" "}
                    <span className="font-serif italic font-normal text-[#955B3D]">
                        slow brew.
                    </span>
                </h1>

                {/* Supporting Copy */}
                <p className="mt-6 max-w-lg text-base leading-7 text-[#78716C] sm:text-lg sm:leading-8 font-sans">
                    A neighborhood pause for thoughtfully sourced coffee,
                    hand-whisked matcha, and something warm from the oven.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-3 rounded-full bg-[#955B3D] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#7D492E] active:scale-[0.98] shadow-sm cursor-pointer"
                    >
                        <span>Explore the menu</span>
                        <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                    <a
                        href="#visit"
                        onClick={(e) => handleScrollTo(e, "visit")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] transition-colors hover:text-[#955B3D] group cursor-pointer"
                    >
                        <span>Find a cafe</span>
                        <ArrowUpRight
                            size={16}
                            strokeWidth={1.5}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>

                {/* Understated Scroll Indicator */}
                <div className="mt-14 hidden lg:block">
                    <a
                        href="#menu"
                        onClick={(e) => handleScrollTo(e, "menu")}
                        className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#78716C]/80 transition-colors hover:text-[#955B3D] cursor-pointer"
                    >
                        <span>A little goodness, daily</span>
                        <ArrowDown size={14} strokeWidth={1.5} className="animate-bounce" aria-hidden="true" />
                    </a>
                </div>
            </div>

            {/* Right Column: Natural Barista Photograph with Floating Card */}
            <div className="relative lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-md lg:max-w-none aspect-[4/4.8] overflow-hidden rounded-3xl bg-[#F0ECE1] shadow-xl border border-stone-200/50">
                    <img
                        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85"
                        alt="Barista precisely brewing single-origin pour-over coffee under warm natural café lighting"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Coffee Information Card */}
                    <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 rounded-2xl border border-white/60 bg-[#F8F5F0]/90 p-4 sm:p-5 shadow-lg backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78716C]">
                                ON THE BAR TODAY
                            </p>
                            <span className="rounded-full bg-[#E3EAE3] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#102B24]">
                                Single origin
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between gap-2">
                            <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-medium leading-tight">
                                Ethiopia Yirgacheffe
                            </h2>
                        </div>
                        <p className="mt-1 text-xs text-[#78716C] font-sans">
                            Floral · citrus · honey
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
