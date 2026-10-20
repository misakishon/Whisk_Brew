import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import AnimateCount from "../unlumen-ui/animate-count";

interface NavbarProps {
    cartCount: number;
    onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const id = href.slice(1);
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.pushState(null, "", href);
            }
        }
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#F8F5F0]/90 backdrop-blur-md transition-all duration-300">
            <nav
                aria-label="Main navigation"
                className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
            >
                {/* Brand Wordmark */}
                <Link
                    href="/"
                    aria-label="whisk brew home"
                    className="text-2xl font-bold tracking-[-0.05em] text-[#1C1917] transition-opacity hover:opacity-85"
                >
                    <span>whisk</span>
                    <span className="font-serif font-normal italic text-[#955B3D]">
                        _brew
                    </span>
                </Link>

                {/* Clean, Minimal Desktop Navigation Links */}
                <div className="hidden items-center gap-9 text-sm font-medium text-[#78716C] md:flex">
                    <Link
                        href="/menu"
                        className="transition-colors duration-200 hover:text-[#1C1917]"
                    >
                        Menu
                    </Link>
                    <a
                        href="#craft"
                        onClick={(e) => handleAnchorClick(e, "#craft")}
                        className="transition-colors duration-200 hover:text-[#1C1917] cursor-pointer"
                    >
                        The Craft
                    </a>
                    <a
                        href="#faq"
                        onClick={(e) => handleAnchorClick(e, "#faq")}
                        className="transition-colors duration-200 hover:text-[#1C1917] cursor-pointer"
                    >
                        FAQ
                    </a>
                    <a
                        href="#visit"
                        onClick={(e) => handleAnchorClick(e, "#visit")}
                        className="transition-colors duration-200 hover:text-[#1C1917] cursor-pointer"
                    >
                        Locations
                    </a>
                </div>

                {/* Right Side Actions: Cart & Order Ahead */}
                <div className="flex items-center gap-3 sm:gap-5">
                    <button
                        type="button"
                        onClick={onOpenCart}
                        aria-label={`Shopping bag with ${cartCount} items`}
                        className="relative rounded-full p-2.5 transition-colors hover:bg-stone-200/50 text-[#1C1917] cursor-pointer"
                    >
                        <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#955B3D] px-1 text-[10px] font-medium text-white shadow-sm">
                            <AnimateCount className="text-[10px] leading-none text-white">
                                {cartCount}
                            </AnimateCount>
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={onOpenCart}
                        className="hidden rounded-full bg-[#955B3D] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#7D492E] active:scale-[0.98] shadow-sm sm:inline-flex items-center gap-2 cursor-pointer"
                    >
                        <span>Order ahead</span>
                    </button>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                        className="rounded-full p-2 transition-colors hover:bg-stone-200/50 md:hidden text-[#1C1917] cursor-pointer"
                    >
                        {mobileOpen ? (
                            <X size={22} strokeWidth={1.5} aria-hidden="true" />
                        ) : (
                            <MenuIcon size={22} strokeWidth={1.5} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
                <div className="border-b border-stone-200/80 bg-[#F8F5F0] px-6 py-6 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-4 text-base font-medium text-[#1C1917]">
                        <Link
                            href="/menu"
                            onClick={() => setMobileOpen(false)}
                            className="py-1 text-[#78716C] transition-colors hover:text-[#1C1917]"
                        >
                            Menu
                        </Link>
                        <a
                            href="#craft"
                            onClick={(e) => handleAnchorClick(e, "#craft")}
                            className="py-1 text-[#78716C] transition-colors hover:text-[#1C1917]"
                        >
                            The Craft
                        </a>
                        <a
                            href="#faq"
                            onClick={(e) => handleAnchorClick(e, "#faq")}
                            className="py-1 text-[#78716C] transition-colors hover:text-[#1C1917]"
                        >
                            FAQ
                        </a>
                        <a
                            href="#visit"
                            onClick={(e) => handleAnchorClick(e, "#visit")}
                            className="py-1 text-[#78716C] transition-colors hover:text-[#1C1917]"
                        >
                            Locations
                        </a>
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    onOpenCart();
                                }}
                                className="w-full rounded-full bg-[#955B3D] py-3 text-center text-sm font-medium text-white shadow-sm cursor-pointer"
                            >
                                Order ahead ({cartCount})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
