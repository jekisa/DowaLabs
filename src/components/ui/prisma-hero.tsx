"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language";

const words = ["DowaLabs", "*"];

export function PrismaHero() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const description = language === "id"
    ? "Creative AI studio untuk mengubah foto produk menjadi visual premium yang siap digunakan untuk marketplace, sosial media, dan kebutuhan marketing."
    : "An AI creative studio for turning product photos into premium visuals ready for marketplaces, social media, and marketing.";

  return (
    <section className="relative px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative isolate h-[calc(100svh-64px)] min-h-[560px] overflow-hidden rounded-2xl bg-[#11100d] md:h-[calc(100svh-72px)] md:min-h-[620px] md:rounded-[2rem]">
        <Image src="/images/showcase/kopi-after3.jpg" alt="" fill priority className="absolute inset-0 z-0 object-cover" />
        <video
          className="absolute inset-0 z-10 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/showcase/kopi-after3.jpg"
          aria-hidden="true"
        >
          <source src="/videos/demo-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(0,0,0,.2),transparent_42%,rgba(0,0,0,.76))]" />
        <div className="absolute inset-0 z-20 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,.8)_0.7px,transparent_0.7px)] [background-size:5px_5px]" />

        <div className="absolute inset-x-5 bottom-6 z-30 grid items-end gap-8 sm:inset-x-8 sm:bottom-8 lg:inset-x-10 lg:bottom-10 lg:grid-cols-12 lg:gap-4">
          <motion.h1
            className="col-span-8 whitespace-nowrap text-[clamp(4.2rem,14vw,13rem)] font-medium leading-[.84] tracking-[-0.085em] text-[#f3f0e6]"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {words.map((word, index) => (
              <motion.span
                key={word}
                className={word === "*" ? "ml-1 align-top text-[.34em] tracking-normal" : undefined}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: reduceMotion ? 0 : index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <div className="col-span-4 max-w-sm justify-self-end text-[#f3f0e6] lg:mb-1">
            <motion.p
              className="text-sm leading-6 text-white/75 sm:text-base"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
            >{description}</motion.p>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/signup" className="group mt-5 inline-flex items-center gap-3 rounded-full bg-[#f4c76b] py-2 pl-5 pr-2 text-sm font-semibold text-[#171108] transition-[gap] duration-300 hover:gap-4">
                {language === "id" ? "Mulai Sekarang" : "Get Started"}
                <span className="grid size-9 place-items-center rounded-full bg-[#171108] text-[#f4c76b] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
                  <ArrowRight size={17} />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
