import type { Config } from "tailwindcss";

// Rənglər CSS dəyişənlərindən gəlir (app/globals.css) — tema dəyişəndə bütün sayt eyni anda dəyişir.
const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: c("brand"), dark: c("brand-dark"), soft: c("soft"), line: c("line") },
        surface: c("surface"),
        ink: c("ink"),
        body: c("body"),
        muted: c("muted"),
        faint: c("faint"),
        "on-brand": c("on-brand"),
        "warn-bg": c("warn-bg"),
        warn: c("warn"),
        "danger-bg": c("danger-bg"),
        danger: c("danger"),
      },
      keyframes: {
        float: { "0%,100%": { transform: "translate3d(0,0,0) scale(1)" }, "50%": { transform: "translate3d(22px,-26px,0) scale(1.1)" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "none" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        popIn: { from: { opacity: "0", transform: "translateY(-6px) scale(.96)" }, to: { opacity: "1", transform: "none" } },
        gradient: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        pinDrop: {
          "0%": { opacity: "0", transform: "translateY(-18px) scale(.9)" },
          "60%": { opacity: "1", transform: "translateY(3px) scale(1.03)" },
          "100%": { opacity: "1", transform: "none" },
        },
        wiggle: { "0%,100%": { transform: "rotate(0)" }, "25%": { transform: "rotate(-9deg)" }, "75%": { transform: "rotate(9deg)" } },
        draw: { from: { strokeDashoffset: "1" }, to: { strokeDashoffset: "0" } },
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        "float-slow": "float 15s ease-in-out infinite reverse",
        "fade-up": "fadeUp .7s cubic-bezier(.2,.7,.2,1) both",
        "fade-in": "fadeIn .3s ease both",
        "pop-in": "popIn .18s ease-out both",
        gradient: "gradient 9s linear infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "pin-drop": "pinDrop .95s cubic-bezier(.3,1.3,.5,1) both",
        wiggle: "wiggle .6s ease-in-out",
        draw: "draw .6s .2s ease-out both",
        "draw-circle": "draw .7s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
