"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Moon, X, Award } from "lucide-react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
    // Added state for mobile Work dropdown toggle
    const [mobileWorkOpen, setMobileWorkOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close desktop dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setWorkDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Track scroll direction & scroll position for background/visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsScrolled(currentScrollY > 20);

            if (currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const sectionRatios = useRef<Record<string, number>>({});

    useEffect(() => {
        const idToLabel: Record<string, string> = {
            home: "Home",
            about: "About",
            work: "Work",
            skills: "Skills",
            certificates: "Work",
            contact: "Contact",
        };

        const handleIntersect: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                sectionRatios.current[entry.target.id] = entry.isIntersecting
                    ? entry.intersectionRatio
                    : 0;
            });

            let bestId: string | null = null;
            let bestRatio = 0;
            Object.entries(sectionRatios.current).forEach(([id, ratio]) => {
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    bestId = id;
                }
            });

            if (!bestId) {
                if (window.scrollY < 200) {
                    setActiveSection("Home");
                }
                return;
            }

            setActiveSection(idToLabel[bestId] ?? "Home");
        };

        const observer = new IntersectionObserver(handleIntersect, {
            threshold: [0, 0.25, 0.5, 0.75, 1],
        });

        const ids = [
            "home",
            "about",
            "work",
            "skills",
            "certificates",
            "contact",
        ];
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const navItems = [
        { name: "Home", hasDropdown: false, href: "#home" },
        { name: "About", hasDropdown: false, href: "#about" },
        {
            name: "Work",
            hasDropdown: true,
            href: "#work",
            dropdownLinks: [
                { label: "Projects", href: "#work" },
                { label: "Certificates", href: "#certificates" },
            ],
        },
        { name: "Skills", hasDropdown: false, href: "#skills" },
        { name: "Contact", hasDropdown: false, href: "#contact" },
        { name: "More", hasDropdown: false, href: "#" },
    ];

    return (
        <>
            <header
                style={{ fontFamily: "'Roboto Mono', monospace" }}
                className={`fixed top-0 left-0 w-full px-6 py-5 z-50 transition-all duration-300 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                } ${
                    isScrolled
                        ? "bg-[#f7f4ed]/90 backdrop-blur-md border-b border-neutral-900/10 shadow-sm"
                        : "bg-transparent border-b border-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left: Logo / Initials */}
                    <a
                        href="#home"
                        className="font-black text-3xl tracking-tighter text-neutral-900 z-50"
                    >
                        SEAN
                    </a>

                    {/* Center: Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-2 text-lg font-bold text-neutral-900">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.name;
                            const isWork = item.name === "Work";

                            if (isWork) {
                                return (
                                    <div
                                        key={item.name}
                                        className="relative"
                                        ref={dropdownRef}
                                    >
                                        <button
                                            onClick={() =>
                                                setWorkDropdownOpen(
                                                    !workDropdownOpen,
                                                )
                                            }
                                            className={`flex items-center space-x-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                                isActive
                                                    ? "bg-[#f4f1ea] border-2 border-neutral-950 shadow-[4px_6px_0px_rgba(0,0,0,1)] text-neutral-950"
                                                    : "border-2 border-transparent shadow-[4px_6px_0px_transparent] hover:bg-[#f4f1ea] hover:border-neutral-950 hover:shadow-[4px_6px_0px_rgba(0,0,0,1)] text-neutral-800"
                                            }`}
                                        >
                                            <span>{item.name}</span>
                                            <ChevronDown
                                                className={`w-4.5 h-4.5 stroke-[2.5] transition-transform ${workDropdownOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {workDropdownOpen &&
                                            item.dropdownLinks && (
                                                <div className="absolute top-full left-0 mt-2 w-48 bg-[#f7f4ed] border-2 border-neutral-950 rounded-xl shadow-[4px_6px_0px_rgba(0,0,0,1)] py-2 z-50 flex flex-col">
                                                    {item.dropdownLinks.map(
                                                        (sub, sIdx) => (
                                                            <a
                                                                key={sIdx}
                                                                href={sub.href}
                                                                onClick={() =>
                                                                    setWorkDropdownOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="px-4 py-2.5 text-sm font-bold text-neutral-800 hover:bg-[#eae5dc] transition-colors flex items-center space-x-2"
                                                            >
                                                                {sub.label ===
                                                                    "Certificates" && (
                                                                    <Award className="w-4 h-4" />
                                                                )}
                                                                <span>
                                                                    {sub.label}
                                                                </span>
                                                            </a>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                );
                            }

                            if (isActive) {
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center space-x-2 px-5 py-2 rounded-full text-neutral-950 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#f4f1ea] border-2 border-neutral-950 shadow-[4px_6px_0px_rgba(0,0,0,1)]"
                                    >
                                        <span>{item.name}</span>
                                        {item.hasDropdown && (
                                            <ChevronDown className="w-4.5 h-4.5 stroke-[2.5]" />
                                        )}
                                    </a>
                                );
                            }

                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-2 px-5 py-2 rounded-full border-2 border-transparent shadow-[4px_6px_0px_transparent] hover:bg-[#f4f1ea] hover:border-neutral-950 hover:shadow-[4px_6px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer text-neutral-800"
                                >
                                    <span>{item.name}</span>
                                    {item.hasDropdown && (
                                        <ChevronDown className="w-4 h-4 opacity-80 stroke-[2.5]" />
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Right: Theme Toggle & Call-to-Action / Mobile Toggle */}
                    <div className="flex items-center space-x-5">
                        <button
                            aria-label="Toggle Theme"
                            className="p-2 text-neutral-800 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                            <Moon className="w-6 h-6" />
                        </button>

                        <a
                            href="#contact"
                            className="hidden md:inline-block text-base font-bold tracking-tight bg-[#121417] text-white px-7 py-3.5 rounded-full hover:bg-neutral-800 transition-colors duration-300 shadow-sm"
                        >
                            Let's Talk
                        </a>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden flex items-center space-x-2 text-lg font-bold text-neutral-900 cursor-pointer z-50 focus:outline-none"
                        >
                            <span>{isOpen ? "Close" : "Menu"}</span>
                            {isOpen ? (
                                <X className="w-6 h-6 stroke-[2.5]" />
                            ) : (
                                <div className="flex flex-col space-y-1.5 w-5">
                                    <span className="h-[2.5px] w-full bg-neutral-900"></span>
                                    <span className="h-[2.5px] w-full bg-neutral-900"></span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Animated Dropdown Overlay */}
            <div
                style={{
                    fontFamily: "'Roboto Mono', monospace",
                    transitionDuration: isOpen ? "1200ms" : "2200ms",
                }}
                className={`fixed inset-0 w-full h-full bg-[#f1eee7] px-6 flex flex-col items-center justify-center z-40 md:hidden transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-full pointer-events-none"
                }`}
            >
                <nav className="flex flex-col items-center space-y-3 text-2xl font-bold text-neutral-900 w-full -mt-12">
                    {navItems.map((item, index) => {
                        const reverseIndex = navItems.length - 1 - index;
                        const delay = isOpen
                            ? index * 40 + 100
                            : reverseIndex * 1800;

                        const isWork = item.name === "Work";

                        return (
                            <div
                                key={item.name}
                                className="flex flex-col items-center"
                            >
                                {isWork ? (
                                    <button
                                        onClick={() =>
                                            setMobileWorkOpen(!mobileWorkOpen)
                                        }
                                        style={{
                                            transitionDelay: `${delay}ms`,
                                            transitionDuration: isOpen
                                                ? "1400ms"
                                                : "2600ms",
                                        }}
                                        className={`flex items-center space-x-2.5 px-8 py-2 rounded-full hover:bg-[#eae6db] transition-all ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                                            isOpen
                                                ? "opacity-100 translate-y-0"
                                                : "opacity-0 -translate-y-28"
                                        }`}
                                    >
                                        <span>{item.name}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 stroke-[2.5] transition-transform ${mobileWorkOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                ) : (
                                    <a
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        style={{
                                            transitionDelay: `${delay}ms`,
                                            transitionDuration: isOpen
                                                ? "1400ms"
                                                : "2600ms",
                                        }}
                                        className={`flex items-center space-x-2.5 px-8 py-2 rounded-full hover:bg-[#eae6db] transition-all ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                                            isOpen
                                                ? "opacity-100 translate-y-0"
                                                : "opacity-0 -translate-y-28"
                                        }`}
                                    >
                                        <span>{item.name}</span>
                                        {item.hasDropdown && (
                                            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                                        )}
                                    </a>
                                )}

                                {/* Mobile Work Sub-links accordion */}
                                {isWork &&
                                    mobileWorkOpen &&
                                    item.dropdownLinks && (
                                        <div className="flex flex-col items-center space-y-2 mt-2 py-2">
                                            {item.dropdownLinks.map(
                                                (sub, sIdx) => (
                                                    <a
                                                        key={sIdx}
                                                        href={sub.href}
                                                        onClick={() => {
                                                            setMobileWorkOpen(
                                                                false,
                                                            );
                                                            setIsOpen(false);
                                                        }}
                                                        className="text-base font-semibold text-neutral-700 hover:text-neutral-900 flex items-center space-x-1.5 py-1"
                                                    >
                                                        <span>
                                                            ↳ {sub.label}
                                                        </span>
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
