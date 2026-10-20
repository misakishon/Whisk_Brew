import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"DM Sans"', 'Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['"Cormorant Garamond"', '"DM Serif Display"', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                ivory: '#F8F5F0',
                nearblack: '#1C1917',
                warmgray: '#78716C',
                coffeebrown: '#955B3D',
                sage: '#E3EAE3',
                forestgreen: '#102B24',
            },
        },
    },

    plugins: [forms],
};
