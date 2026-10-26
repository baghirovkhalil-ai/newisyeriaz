import type { Metadata } from "next";
import BoostCheckout from "@/components/BoostCheckout";
import { isBoost, isTarget } from "@/lib/boosts";
import { getExtra } from "@/lib/dict-extra";
import type { Locale } from "@/lib/i18n";
import { IS_DEMO } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return { title: getExtra(params.locale).checkout.metaTitle, robots: { index: false, follow: false } };
}

export default function BoostPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { type?: string; plan?: string; item?: string } }) {
  const x = getExtra(params.locale);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium">{x.checkout.h1}</h1>
        <p className="mt-1 max-w-2xl text-body">{x.checkout.sub}</p>
      </div>
      <BoostCheckout
        x={x}
        initialTarget={isTarget(searchParams.type) ? searchParams.type : "vacancy"}
        initialPlan={isBoost(searchParams.plan) ? searchParams.plan : "premium"}
        initialItem={(searchParams.item ?? "").slice(0, 160)}
        demo={IS_DEMO}
      />
    </div>
  );
}
