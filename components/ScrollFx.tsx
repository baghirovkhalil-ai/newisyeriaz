"use client";

import { useEffect, useRef, useState } from "react";

/** Yuxarıda oxuma zolağı, header kölgəsi və "yuxarı qayıt" düyməsi. */
export default function ScrollFx({ label }: { label: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      document.documentElement.toggleAttribute("data-scrolled", y > 8);
      setTop(y > 700);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[3px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-dark" />
      </div>
      <button
        type="button"
        aria-label={label}
        title={label}
        tabIndex={top ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-[calc(5rem_+_env(safe-area-inset-bottom))] right-4 z-20 md:bottom-5 md:right-5 grid h-11 w-11 place-items-center rounded-full bg-brand text-on-brand shadow-lg shadow-brand/30 transition duration-300 hover:-translate-y-0.5 active:scale-90 ${top ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
    </>
  );
}
