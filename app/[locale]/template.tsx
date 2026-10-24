// template hər naviqasiyada yenidən qurulur, ona görə səhifə keçidində yumşaq animasiya işləyir.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
