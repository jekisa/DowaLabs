import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InlineCTA() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#090b13] py-8 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(55%_180%_at_50%_100%,rgba(245,185,66,0.12),transparent_72%)]" />
      <div className="container relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
            <BadgeCheck className="h-4 w-4" />
            Mulai dari satu produk hari ini
          </div>
          <h2 className="mt-2 max-w-2xl text-xl font-semibold leading-snug text-white sm:text-2xl">
            Ubah foto katalog biasa menjadi materi affiliate yang lebih meyakinkan.
          </h2>
        </div>
        <Button asChild size="lg" className="w-full shrink-0 md:w-auto">
          <Link href="/signup?plan=pro">
            Coba DowaLabs Pro
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
