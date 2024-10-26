/** @type {import('tailwindcss').Config} */
// const { default: daisyui } = require('daisyui');
const { t } = require('i18next');
const plugin = require('tailwindcss/plugin');
const rotateX = plugin(function ({ addUtilities }) {
    addUtilities({
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        },
    });
});
module.exports = {
    content: ['./App.tsx', './app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}',
        // flowbite.content()
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            screens: {
                'xs': '475px',
                'xxs': '375px',
            },
            // fontSize: {
            //     h1: '2.5rem',
            //     h2: '2rem',
            //     h3: '1.75rem',
            //     h4: '1.5rem',
            //     h5: '1.25rem',
            //     h6: '0.875rem',
            // },
            
            colors: {
                primary: {
                    DEFAULT: '#03e1ff',
                    light: '#eaf1ff',
                    'dark-light': 'rgba(67,97,238,.15)',
                },
                secondary: {
                    DEFAULT: '#805dca',
                    light: '#ebe4f7',
                    'dark-light': 'rgb(128 93 202 / 15%)',
                },
                success: {
                    DEFAULT: '#00ab55',
                    light: '#ddf5f0',
                    'dark-light': 'rgba(0,171,85,.15)',
                },
                danger: {
                    DEFAULT: '#e7515a',
                    light: '#fff5f5',
                    'dark-light': 'rgba(231,81,90,.15)',
                },
                warning: {
                    DEFAULT: '#e2a03f',
                    light: '#fff9ed',
                    'dark-light': 'rgba(226,160,63,.15)',
                },
                info: {
                    DEFAULT: '#2196f3',
                    // DEFAULT: '#92F7CB',
                    light: '#e7f7ff',
                    'dark-light': 'rgba(33,150,243,.15)',
                },
                dark: {
                    DEFAULT: '#121319',
                    // DEFAULT: '#3b3f5c',
                    // DEFAULT: '#0D0D0F',
                    // light: '#eaeaec',
                    // 'dark-light': 'rgba(59,63,92,.15)',
                    // 900: '#0D0D0F',
                    // 1000: '#000000',
                },
                black: {
                    DEFAULT: '#000000',
                    100: '#141416',
                    200: '#11121d',
                    400: '#454545',
                    // // DEFAULT: '#0e1726',
                    // light: '#e3e4eb',
                    // 'dark-light': 'rgba(14,23,38,.15)',
                },
                white: {
                    DEFAULT: '#ffffff',
                    light: '#e0e6ed',
                    dark: '#888ea8',
                },
                // https://tailwindcss.com/docs/customizing-colors#extending-the-defaults
                emerald: {
                    100: '#66AC8E',
                    200: '#92F7CB',
                    300: '#92F7CB1A',
                    500: 'rgba(146, 247, 203, 0.3)',
                    700: '#3E6355',
                    900: '#1A2322',
                },
                teal: {
                    400: '#00FFA3',
                },
                purple: {
                    // 500: '#BB3FF0',
                    400: '#ec84ff',
                    500: '#B455FF',
                    600: '#B556FF',
                    700: '#8900C4',
                },
                neutral: {
                    700: '#3A3A3A',
                    750: '#3B3B3B',
                    800: '#1A2422',
                    900: '#141416',
                    950: '#0D0D0F'
                },
                green: {
                    400: '#0fffa3',
                    950: '#002417',
                },
                lightcoral: {
                    200: '#F03F3F',
                    700: '#662511',
                    900: '#231213',
                },
                rose: {
                    400: '#FF6489',
                },
                lemon: {
                    400: '#FAFF00',
                },
                zinc: {
                    300: '#D9D9D9',
                },
                cyan: {
                    400: '#00EFFF',
                    500: '#00F0FF',
                },
                sky: {
                    500: '#0084FF',
                },
                orange: {
                    400: '#FFB700',
                    450: '#FFB800',
                },
                blue: {
                    200: '#03e1ff',
                    400: '#06c8f6'
                },
                bluegray: {
                    400: '#00ffa3'
                }
                
            },
            fontFamily: {
                nunito: ['var(--font-nunito)'],
                geoparody: ['var(--font-geoparody)'],
                silkscreen: ['var(--font-silkscreen)'],
                figtree: ['var(--font-figtree)'],
            },
            spacing: {
                4.5: '18px',
            },
            letterSpacing: {
                tight: '0.01em'
            },
            boxShadow: {
                '3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
            },
            // typography: ({ theme }) => ({
            //     DEFAULT: {
            //         css: {
            //             '--tw-prose-invert-headings': theme('colors.white.dark'),
            //             '--tw-prose-invert-links': theme('colors.white.dark'),
            //             h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
            //             h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
            //             h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
            //             h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
            //             h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
            //             h6: { fontSize: '0.875rem',
            //                  marginBottom: '0.5rem', marginTop: 0 },
            //             p: { marginBottom: '0.5rem' },
            //             li: { margin: 0 },
            //             img: { margin: 0 },
            //         },
            //     },
            // }),

            
            // daisy: {
            //     base: {
            //         height: '2.5rem',
            //         padding: '0 1rem',
            //     },
            // },
        },
    },
    // daisyui: {
    //     // q: customize color of daisy ui, how?
    //     // https://daisyui.com/docs/colors
    //     // a: you can use the colors object in the theme configuration
    //     // https://daisyui.com/docs/colors
    //     themes: [
    //         {
    //             mytheme: {
    //                 primary: '#00FFA3',
    //                 // 'primary-focus': '#FF0000',
    //                 // 'primary-content': '#FFFFFF',
    //                 secondary: '#92F7CB',
    //                 // 'secondary-focus': '#FF0000',
    //                 // 'secondary-content': '#FFFFFF',
    //                 accent: '#FF0000',
    //                 // 'accent-focus': '#FF0000',
    //                 // 'accent-content': '#FFFFFF',
    //                 // neutral: '#FF0000',
    //                 // 'neutral-focus': '#FF0000',
    //                 // 'neutral-content': '#FFFFFF',
    //                 // 'base-100': '#FF0000',
    //                 // 'base-200': '#FF0000',
    //                 // 'base-300': '#FF0000',
    //                 // 'base-content': '#FFFFFF',
    //                 // info: '#FF0000',
    //                 // success: '#FF0000',
    //                 // warning: '#FF0000',
    //                 // error: '#FF0000',
    //             },
    //         },
    //     ],
    // },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        rotateX,
    ],
};
