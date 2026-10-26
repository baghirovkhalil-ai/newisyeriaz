export const THEME_KEY = "isyeri-theme";
/** Yalnız iki rejim: Ağ və Qara. İlk girişdə cihazın rejimi götürülür, sonra istifadəçinin seçimi yadda qalır. */
export const themeOptions = ["light", "dark"] as const;
export type ThemeName = (typeof themeOptions)[number];

// brauzer panelinin rəngi (meta theme-color)
export const THEME_COLORS: Record<ThemeName, string> = { light: "#ffffff", dark: "#0a0a0a" };

/** Səhifə çəkilməmişdən əvvəl işləyir: temanın "yanıb-sönməsinin" qarşısını alır. Köhnə "blue" seçimi qaraya keçir. */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');var t='light';try{var p=localStorage.getItem('${THEME_KEY}');if(p==='blue'){p='dark';localStorage.setItem('${THEME_KEY}','dark');}t=(p==='light'||p==='dark')?p:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}catch(e){}d.dataset.theme=t;setTimeout(function(){d.classList.add('reveal-all')},2500);})();`;
