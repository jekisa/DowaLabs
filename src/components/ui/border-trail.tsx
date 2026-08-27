"use client";

import { motion } from "framer-motion";

export function BorderTrail() {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-px rounded-[inherit] bg-[linear-gradient(90deg,transparent,rgba(251,191,36,.8),transparent)] opacity-70 blur-[1px]"
      animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      style={{ backgroundSize: "200% 100%", maskImage: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude", padding: 1 }}
    />
  );
}
