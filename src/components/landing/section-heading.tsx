import { FadeIn } from "@/components/motion/motion-primitives";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <FadeIn className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-gold-400">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground">{description}</p>
      )}
    </FadeIn>
  );
}
