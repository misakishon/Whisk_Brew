import React from "react";
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink } from "lucide-react";

export default function LocationsSection() {
    return (
        <section
            id="visit"
            aria-labelledby="visit-heading"
            className="w-full max-w-7xl mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 scroll-mt-20"
        >
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#955B3D]">
                        LOCATIONS
                    </p>
                    <h2
                        id="visit-heading"
                        className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.03em] text-[#1C1917]"
                    >
                        Visit{" "}
                        <span className="font-serif italic text-[#955B3D]">Us.</span>
                    </h2>
                </div>
                <span className="text-xs text-[#78716C] bg-[#E3EAE3] px-3.5 py-1.5 rounded-full border border-[#D0DDD0]/60 text-[#102B24] font-medium">
                    Demonstration Café Location
                </span>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                {/* Storefront Photography Card (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                    <div className="relative aspect-[4/3.5] sm:aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#F0ECE1] shadow-sm border border-stone-200/80">
                        <img
                            src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=85"
                            alt="Whisk Brew charming cafe storefront with welcoming entrance, warm lighting, and foliage"
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E3EAE3]">
                                FLAGSHIP STOREFRONT
                            </span>
                            <p className="font-serif text-xl sm:text-2xl mt-0.5">
                                Garden Lane Sanctuary
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white p-4 border border-stone-200/80 text-xs text-[#78716C] leading-relaxed">
                        <strong className="text-[#1C1917]">Note:</strong> This café location is presented for demonstration. Real orders placed online are recorded for local testing.
                    </div>
                </div>

                {/* Cafe Details Card (4 cols) */}
                <div className="lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F5F0] px-3 py-1 text-xs font-semibold text-[#955B3D]">
                            <MapPin size={14} />
                            <span>Portland, OR</span>
                        </div>

                        <h3 className="mt-4 font-serif text-2xl text-[#1C1917] font-medium">
                            Whisk Brew Flagship
                        </h3>
                        <p className="mt-2 text-sm text-[#78716C] leading-relaxed">
                            24 Garden Lane, Pearl District
                            <br />
                            Portland, OR 97205
                        </p>

                        <div className="mt-6 space-y-4 border-t border-stone-100 pt-6">
                            <div className="flex items-start gap-3">
                                <Clock size={16} className="mt-0.5 shrink-0 text-[#955B3D]" />
                                <div className="text-xs sm:text-sm">
                                    <p className="font-semibold text-[#1C1917]">Hours</p>
                                    <p className="text-[#78716C] mt-0.5">
                                        Monday – Sunday
                                        <br />
                                        7:00 AM – 7:00 PM
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone size={16} className="mt-0.5 shrink-0 text-[#955B3D]" />
                                <div className="text-xs sm:text-sm">
                                    <p className="font-semibold text-[#1C1917]">Phone</p>
                                    <a
                                        href="tel:+15035550198"
                                        className="text-[#78716C] hover:text-[#955B3D] transition-colors"
                                    >
                                        +1 (503) 555-0198
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail size={16} className="mt-0.5 shrink-0 text-[#955B3D]" />
                                <div className="text-xs sm:text-sm">
                                    <p className="font-semibold text-[#1C1917]">Inquiries</p>
                                    <a
                                        href="mailto:hello@whiskandbrew.com"
                                        className="text-[#78716C] hover:text-[#955B3D] transition-colors"
                                    >
                                        hello@whiskandbrew.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-stone-100">
                        <a
                            href="https://maps.google.com/?q=24+Garden+Lane+Portland+OR"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1917] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-neutral-800 shadow-sm"
                        >
                            <Navigation size={16} />
                            <span>Get directions</span>
                        </a>
                    </div>
                </div>

                {/* Map Preview Card (3 cols) */}
                <div className="lg:col-span-3 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                                MAP PREVIEW
                            </span>
                            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                        </div>

                        {/* Interactive Styled Map View */}
                        <div className="mt-4 relative aspect-square w-full rounded-2xl bg-[#EFECE6] border border-stone-200 overflow-hidden flex items-center justify-center group">
                            {/* Stylized Map Grid Graphics */}
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#78716C_1px,transparent_1px)] [background-size:16px_16px]" />
                            <div className="absolute top-1/2 left-0 right-0 h-4 bg-[#DFD9CE] -translate-y-1/2" />
                            <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-[#DFD9CE]" />
                            <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-[#DFD9CE]" />

                            {/* Pin Marker */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#955B3D] text-white shadow-lg ring-4 ring-[#E3EAE3]">
                                    <MapPin size={18} />
                                </div>
                                <span className="mt-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold text-[#1C1917] shadow-sm border border-stone-200">
                                    whisk_brew
                                </span>
                            </div>

                            <a
                                href="https://maps.google.com/?q=whisk+brew+cafe"
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-[#1C1917]/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-white text-xs font-medium gap-1.5"
                            >
                                <span>Open Full Map</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-[#78716C]">
                            Free 2-hour customer parking behind building.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
