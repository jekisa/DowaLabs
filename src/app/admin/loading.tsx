export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-24 max-w-2xl animate-pulse rounded-[24px] bg-white/[0.045]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-[24px] bg-white/[0.04]"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[24px] bg-white/[0.04]" />
        <div className="h-80 animate-pulse rounded-[24px] bg-white/[0.04]" />
      </div>
    </div>
  );
}
