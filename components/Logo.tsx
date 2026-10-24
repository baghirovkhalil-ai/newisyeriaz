// Rənglər temadan gəlir (fill-brand, fill-surface...), ona görə loqo hər rejimdə uyğunlaşır.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="group inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="130 70 120 155" aria-hidden="true" className="overflow-visible">
        <g className="logo-part animate-pin-drop">
          <path d="M190 218 C150 178 138 158 138 131 A52 52 0 1 1 242 131 C242 158 230 178 190 218 Z" className="fill-brand" />
          <g className="logo-part transition-transform duration-300 group-hover:animate-wiggle">
            <rect x="164" y="121" width="52" height="36" rx="6" className="fill-surface" />
            <path d="M180 121 V115 a4 4 0 0 1 4-4 h12 a4 4 0 0 1 4 4 V121" fill="none" className="stroke-surface" strokeWidth="4" strokeLinecap="round" />
            <line x1="164" y1="136" x2="216" y2="136" className="stroke-brand" strokeWidth="3" />
          </g>
        </g>
      </svg>
      <span className="text-xl font-medium text-brand-dark">
        İş<span className="text-brand">Yeri</span>
        <span className="text-sm text-brand/60">.az</span>
      </span>
    </span>
  );
}
