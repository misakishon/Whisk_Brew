import React from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#102B24] text-[#F8F5F0] pt-16 pb-12 border-t border-[#1C3E34]">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-16">
                    {/* Brand Info (5 cols) */}
                    <div className="md:col-span-5">
                        <a
                            href="#home"
                            className="inline-block text-2xl font-bold tracking-tight text-white"
                        >
                            <span>whisk</span>
                            <span className="font-serif font-normal italic text-[#D4A373]">
                                _brew
                            </span>
                        </a>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#D0DDD0]/80">
                            A neighborhood slow-bar sanctuary dedicated to single-origin
                            espresso extractions, ceremonial Uji matcha rituals, and morning
                            bakes rolled before sunrise.
                        </p>

                        {/* Social Media Links with Clean SVG Icons */}
                        <div className="mt-6 flex items-center gap-4 text-[#D0DDD0]/80">
                            {/* Instagram */}
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Follow Whisk Brew on Instagram"
                                className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <svg
                                    className="w-4 h-4 fill-none stroke-current"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    viewBox="0 0 24 24"
                                >
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </a>

                            {/* X / Twitter */}
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Follow Whisk Brew on X"
                                className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <svg
                                    className="w-4 h-4 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Follow Whisk Brew on Facebook"
                                className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <svg
                                    className="w-4 h-4 fill-none stroke-current"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Quick Links (3 cols) */}
                    <div className="md:col-span-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#D4A373]">
                            NAVIGATION
                        </p>
                        <ul className="mt-4 space-y-2.5 text-sm text-[#D0DDD0]/80">
                            <li>
                                <a href="#home" className="hover:text-white transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#menu" className="hover:text-white transition-colors">
                                    Featured Menu
                                </a>
                            </li>
                            <li>
                                <Link href="/menu" className="hover:text-white transition-colors flex items-center gap-1">
                                    <span>Full Catalog &amp; Customizer</span>
                                    <ArrowUpRight size={13} />
                                </Link>
                            </li>
                            <li>
                                <a href="#craft" className="hover:text-white transition-colors">
                                    The Craft &amp; Sourcing
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-white transition-colors">
                                    Rituals &amp; FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#visit" className="hover:text-white transition-colors">
                                    Locations &amp; Hours
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours & Direct URL Staff Portal (4 cols) */}
                    <div className="md:col-span-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#D4A373]">
                            HOURS &amp; ACCESS
                        </p>
                        <div className="mt-4 text-sm text-[#D0DDD0]/80 leading-relaxed">
                            <p className="font-medium text-white">Daily Bar Service</p>
                            <p>Monday – Sunday: 7:00 AM – 7:00 PM</p>
                            <p className="mt-2 text-xs text-[#D0DDD0]/60">
                                Fresh bakes served from opening until sold out.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <p className="text-xs text-[#D0DDD0]/60">
                                Staff members can access administrative controls directly via URL:
                            </p>
                            <Link
                                href="/admin"
                                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#D4A373] hover:underline"
                            >
                                <span>Staff Portal (/admin)</span>
                                <ArrowUpRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D0DDD0]/60">
                    <p>© {new Date().getFullYear()} Whisk Brew. All rights reserved.</p>
                    <p className="flex items-center gap-4">
                        <span>Crafted with patience &amp; intention.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
