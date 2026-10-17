import "../css/app.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import Background from "./Pages/home/background";

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <div className="relative min-h-screen overflow-hidden isolate">
                <Background />
                <div className="relative z-10">
                    <App {...props} />
                </div>
            </div>,
        );
    },
});
