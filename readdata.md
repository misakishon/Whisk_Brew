New Page  
Act as a Senior Frontend Engineer and UI/UX Designer. We have finished Home.tsx and now need to build Page 2 of our specialty coffee and artisanal matcha shop 'whisk_brew': the Full Interactive Menu &amp; Drink Customizer page (src/pages/Menu.tsx), and wire up navigation between Home and Menu in App.tsx.

Tech Stack: React, TypeScript, Tailwind CSS, lucide-react.

Design Aesthetic: Warm minimalist, Kinfolk editorial aesthetic. Color palette of warm oat (#F7F4EF), soft cream (#EFECE6), deep espresso (#1E1B18), and subtle ceremonial matcha sage (#6B7F69). Clean typography, generous whitespace, subtle borders, and minimal, smooth transitions.

Requirements for src/pages/Menu.tsx:

1. Sticky Top Bar / Header consistent with Home.tsx, including a back/navigation link to Home and a live Cart button showing item count and subtotal.

2. Search &amp; Category Filter Bar:

   - Categories: All, Artisanal Matcha, Espresso &amp; Pour Over, Signature Cold Brews, Pastries &amp; Artisanal Bakes.

   - Dietary quick-filters: Oat Milk Default, Iced Only, Caffeine-Free.

   - Real-time search input by drink name or tasting notes.

3. Editorial Menu Grid:

   - Each card displays an image, category badge, item name, tasting notes description, calories/caffeine tag, price, and a 'Customize' button.

4. Interactive Drink Customizer Modal (opens when clicking a menu item):

   - Temperature toggle: Hot / Iced (+₱15).

   - Milk options: Whole Dairy (₱0), Barista Oat Milk (+₱30), Soy (+₱20), Almond (+₱30).

   - Sweetness level: 0% Unsweetened, 50% Less Sweet, 100% House Standard.

   - Matcha / Espresso upgrade: Ceremonial Uji Grade (+₱45) or Extra Single Origin Shot (+₱40).

   - Live dynamic unit price calculation and 'Add to Order' action.

5. Slide-Over Cart Drawer:

   - Lists customized items with selected modifiers, quantity increment/decrement buttons, remove button, subtotal, estimated prep time (8-12 mins), and a 'Proceed to Checkout' button.

6. Update App.tsx so users can seamlessly switch between Home.tsx and Menu.tsx.  
  
add follow up questions   
