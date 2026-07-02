function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/[0.055] ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#050713] text-white lg:pl-[280px]">
      <aside className="fixed inset-y-0 left-0 hidden w-[280px] border-r border-white/[0.06] bg-[#070914]/80 p-5 lg:block">
        <Skeleton className="h-12 w-36" />
        <Skeleton className="mt-12 h-12 w-full" />
        <Skeleton className="mt-2 h-12 w-full" />
      </aside>
      <div className="h-[72px] border-b border-white/[0.06] bg-[#060914]/70 px-6 py-3.5"><Skeleton className="h-11 max-w-lg" /></div>
      <main className="mx-auto max-w-[1560px] space-y-6 px-4 py-8 sm:px-6 xl:px-10">
        <Skeleton className="h-72 w-full rounded-[28px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-44" />)}</div>
        <div className="grid gap-6 xl:grid-cols-3"><Skeleton className="h-96" /><Skeleton className="h-96 xl:col-span-2" /></div>
      </main>
    </div>
  );
}
