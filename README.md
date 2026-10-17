# Whisk & Brew 🍵☕

> *Made slowly, served warmly.*  
> An artisanal digital storefront and cafe ordering experience for ceremonial matcha, slow-brewed single-origin coffees, and freshly baked pastries.

---

## 🌿 Highlights

- **Boutique Aesthetics & Editorial Design**: Warm earthy aesthetic inspired by traditional tea houses and third-wave espresso bars.
- **Interactive Drink Customizer**: Dynamic configuration for temperature, alternative milks (Barista Oat Milk, Soy, Almond), sweetness levels, and ceremonial upgrades.
- **Cart & Fast Checkout Drawer**: Real-time sliding cart with quantity adjustments, custom modifier tags, subtotal computation, and frictionless checkout modal.
- **Interactive Menu & Live Search**: Instant filtering across categories (*Artisanal Matcha*, *Espresso & Pour Over*, *Signature Cold Brews*, *Pastries & Artisanal Bakes*) with quick toggles for *Oat milk default*, *Iced only*, and *Caffeine-free*.
- **Full SPA Experience via Inertia.js**: Seamless client-side routing between the home showcase and menu without full page reloads.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Adapter**: [@inertiajs/react](https://inertiajs.com/) (v2)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Motion**: [Framer Motion](https://www.framer.com/motion/)
- **Build Tool**: [Vite](https://vitejs.dev/)

### Backend
- **Framework**: [Laravel 11](https://laravel.com/)
- **Language**: PHP 8.2+
- **Architecture**: Inertia Monolith with Session Driver & SQLite persistence
- **Routing**: Tighten Ziggy + Laravel Route definitions

---

## 📂 Project Structure

```text
Whisk_Brew/
├── app/                      # Laravel application core & middleware
│   └── Http/Middleware/      # HandleInertiaRequests middleware
├── database/                 # Migrations, seeders, and factories
│   └── migrations/           # Cache, jobs, and sessions schema
├── resources/
│   ├── css/                  # Tailwind base stylesheets
│   └── js/
│       ├── Pages/
│       │   ├── Home.tsx      # Landing page & brand story
│       │   └── Menu.tsx      # Menu, drink customizer, & cart system
│       ├── Components/       # Reusable UI widgets & header
│       ├── assets/           # Sequential animation frames & media
│       └── app.tsx           # Inertia application bootstrap
├── routes/
│   └── web.php               # Web route declarations ('/', '/menu')
└── public/                   # Public assets and compiled build outputs
```

---

## 🚀 Getting Started

### Prerequisites
- **PHP** >= 8.2 with PDO SQLite extension enabled
- **Composer** >= 2.0
- **Node.js** >= 18.x & **npm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/misakishon/Whisk_Brew.git
   cd Whisk_Brew
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```

4. **Environment Configuration:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Run Database Migrations:**
   ```bash
   php artisan migrate
   ```

---

## 💻 Development & Building

Run the backend and frontend development servers concurrently:

**Terminal 1 — Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 — Vite Dev Server:**
```bash
npm run dev
```

The application will be live at `http://127.0.0.1:8000`.

### Production Build
To create an optimized production bundle:
```bash
npm run build
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
