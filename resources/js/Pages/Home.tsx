import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Navbar from "../Components/whisk-brew/Navbar";
import HeroSection from "../Components/whisk-brew/HeroSection";
import MenuSection from "../Components/whisk-brew/MenuSection";
import CraftSection from "../Components/whisk-brew/CraftSection";
import LocationsSection from "../Components/whisk-brew/LocationsSection";
import Footer from "../Components/whisk-brew/Footer";
import CartDrawer from "../Components/whisk-brew/CartDrawer";
import { MotionAccordion } from "../Components/unlumen-ui/motion-faqs-accordion";
import { WHISK_CATALOG, FAQS_DATA } from "../lib/whisk-data";
import { MenuItem } from "../types/whisk";

export default function Home() {
    const [cart, setCart] = useState<Record<number, number>>({});
    const [cartOpen, setCartOpen] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Layered Scroll Animation Controller
    const heroContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroContainerRef,
        offset: ["start start", "end start"],
    });

    const smoothProgress = useSpring(heroProgress, {
        stiffness: 90,
        damping: 25,
        restDelta: 0.001,
    });

    // Background Layer (Hero) transforms
    const heroScale = useTransform(smoothProgress, [0, 0.75], [1, 0.94]);
    const heroOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0.45]);
    const heroY = useTransform(smoothProgress, [0, 1], [0, -50]);

    // Cart calculations
    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    const handleAddToCart = (item: MenuItem) => {
        setCart((prev) => ({
            ...prev,
            [item.id]: (prev[item.id] ?? 0) + 1,
        }));
    };

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCart((prev) => {
            const next = { ...prev };
            const updated = (next[id] ?? 0) + delta;
            if (updated <= 0) {
                delete next[id];
            } else {
                next[id] = updated;
            }
            return next;
        });
    };

    const handleClearCart = () => {
        setCart({});
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#1C1917] selection:bg-[#E3EAE3] selection:text-[#102B24] font-sans antialiased overflow-x-hidden">
            {/* Slim, Minimal Top Navigation Bar */}
            <Navbar
                cartCount={cartCount}
                onOpenCart={() => setCartOpen(true)}
            />

            {/* Interactive Cart Drawer */}
            <CartDrawer
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                items={WHISK_CATALOG}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
            />

            {/* ========================================================
                LAYER 1 (BACKGROUND): Sticky Hero Viewport
                ======================================================== */}
            <div
                ref={heroContainerRef}
                className="relative h-[112vh] sm:h-[116vh] lg:h-[120vh] w-full"
            >
                <motion.div
                    style={
                        prefersReducedMotion
                            ? {}
                            : {
                                  scale: heroScale,
                                  opacity: heroOpacity,
                                  y: heroY,
                              }
                    }
                    className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10"
                >
                    <HeroSection />
                </motion.div>
            </div>

            {/* ========================================================
                LAYER 2 (FOREGROUND): Physical Sliding Sheet Layer
                Slides upward over the hero as visitor scrolls
                ======================================================== */}
            <main className="relative z-20 -mt-[14vh] sm:-mt-[18vh] lg:-mt-[22vh] rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-t-[56px] bg-[#F8F5F0] border-t border-stone-200/90 shadow-[0_-30px_70px_rgba(28,25,23,0.13)]">
                {/* Visual decorative grip line indicator */}
                <div className="pt-3 pb-1 flex justify-center">
                    <span className="h-1 w-10 rounded-full bg-stone-300/80" />
                </div>

                {/* Section 2: Menu Section */}
                <MenuSection
                    items={WHISK_CATALOG}
                    onAddToCart={handleAddToCart}
                />

                {/* Section 3: The Craft Section */}
                <CraftSection />

                {/* Section 4: Locations Section */}
                <LocationsSection />

                {/* Section 5: Inquiries & Rituals (FAQ Accordion) */}
                <section
                    id="faq"
                    aria-labelledby="faq-heading"
                    className="w-full max-w-4xl mx-auto px-5 py-16 sm:px-8 sm:py-20 scroll-mt-20"
                >
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#955B3D]">
                            INQUIRIES &amp; RITUALS
                        </p>
                        <h2
                            id="faq-heading"
                            className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.03em] text-[#1C1917]"
                        >
                            Common{" "}
                            <span className="font-serif italic text-[#955B3D]">
                                questions.
                            </span>
                        </h2>
                        <p className="mt-2 text-sm text-[#78716C] max-w-lg mx-auto font-sans">
                            Details on ceremonial matcha provenance, single-origin espresso extraction, and pickup timing.
                        </p>
                    </div>

                    <MotionAccordion items={FAQS_DATA} gap={12} />
                </section>
            </main>

            {/* Section 6: Minimal Dark Forest Green Footer */}
            <Footer />
        </div>
    );
}
