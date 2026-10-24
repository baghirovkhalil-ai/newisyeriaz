export const THEME_KEY = "isyeri-theme";
export const themeOptions = ["auto", "light", "dark", "blue"] as const;
export type ThemePref = (typeof themeOptions)[number];
export type ThemeName = Exclude<ThemePref, "auto">;

// brauzer panelinin rəngi (meta theme-color)
export const THEME_COLORS: Record<ThemeName, string> = { light: "#ffffff", dark: "#0b0f19", blue: "#092442" };

/** Səhifə çəkilməmişdən əvvəl işləyir: temanın "yanıb-sönməsinin" qarşısını alır. */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');var t='light',p='auto';try{p=localStorage.getItem('${THEME_KEY}')||'auto';t=p==='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;if(['light','dark','blue'].indexOf(t)<0)t='light';}catch(e){}d.dataset.theme=t;d.dataset.pref=p;setTimeout(function(){d.classList.add('reveal-all')},2500);})();`;
