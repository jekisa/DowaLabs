"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronDown,
  Download,
  Eraser,
  ImagePlus,
  Palette,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { PRO_PRICE_LABEL, PRO_PRICE_STRIKE } from "@/components/landing/landing-data";
import { WhatsappHelp } from "@/components/landing/whatsapp-help";
import { HeroMinimalism } from "@/components/ui/hero-minimalism";
import { FeedbackChatStack } from "@/components/ui/feedback-chat-stack";
import { BentoGrid } from "@/components/ui/bento-grid";
import { SinglePricingCard } from "@/components/ui/single-pricing-card";
import { SocialProofCards } from "@/components/ui/social-proof-cards";
import { useLanguage } from "@/lib/language";
import styles from "./conversion-landing.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const marketplaceLogos = [
  ["Shopee", "/images/marketplace/Shopee-wide.svg"],
  // square 960x960 original on purpose: the -wide file was a composed lockup, not brand art
  ["Tokopedia", "/images/marketplace/Tokopedia.svg"],
  ["TikTok Shop", "/images/marketplace/Tiktok-wide.svg"],
  ["Blibli", "/images/marketplace/Blibli-wide.svg"],
  ["Lazada", "/images/marketplace/Lazada-wide.svg"],
];

const bentoFeatures = (language) => [
  {
    title: "Product Studio",
    description: language === "id" ? "Ubah foto produk biasa menjadi visual studio premium untuk marketplace dan sosial media." : "Turn ordinary product photos into premium studio visuals for marketplaces and social media.",
    icon: Camera,
    image: "/images/showcase/powcan_tumbler.jpg",
    // square packshot on white in a wide band: cover would show a horizontal
    // slice of the bottle, contain keeps the whole product and reads as a float.
    imagePosition: "object-contain object-center",
    href: "/demo",
    className: "md:col-span-4 md:min-h-[220px]",
  },
  {
    title: "Background Remover",
    description: language === "id" ? "Hapus background dengan cepat dan siapkan produk untuk katalog, banner, atau desain baru." : "Remove backgrounds quickly and prepare products for catalogs, banners, or new designs.",
    icon: Eraser,
    image: "/images/showcase/watch-after3.jpg",
    className: "md:col-span-2",
  },
  {
    title: "Color Grading",
    description: language === "id" ? "Perbaiki tone, warna, dan nuansa visual agar konten terlihat lebih profesional dan konsisten." : "Refine tone, color, and visual mood for more professional and consistent content.",
    icon: Palette,
    image: "/images/showcase/kopi-after4.jpg",
    className: "md:col-span-2",
  },
  {
    title: "Portrait Style",
    description: language === "id" ? "Buat portrait dengan gaya visual berbeda untuk campaign, personal branding, dan konten kreatif." : "Create portraits in different visual styles for campaigns, personal branding, and creative content.",
    icon: UserRound,
    image: "/images/showcase/Character_5.jpg",
    className: "md:col-span-2 md:min-h-[220px]",
  },
  {
    title: "5.000+ Prompt AI",
    description: language === "id" ? "Gunakan koleksi prompt siap pakai untuk mempercepat ide dan produksi visual dengan AI." : "Use a ready-to-use prompt library to accelerate ideas and AI visual production.",
    icon: BookOpen,
    image: "/images/showcase/Character_1.jpg",
    // tight headshot: 14% skips the empty band above the hair without reaching the
    // chin. object-bottom used to sit here, which only worked while the image
    // filled the whole card; against the real photo box it framed the chest.
    imagePosition: "object-[50%_14%]",
    href: "/signup",
    className: "md:col-span-2 md:min-h-[220px]",
  },
];

const copy = {
  id: {
    cta: "Mulai Sekarang - Rp99.000 untuk 30 hari",
    kicker: "AI Product Studio untuk seller online",
    headline: "Ubah foto produk biasa menjadi gambar studio premium dalam 10 detik.",
    subheadline:
      "Upload sekali dan buat visual marketplace premium untuk Shopee, Tokopedia, TikTok Shop, dan Instagram.",
    demo: "Tonton Demo 30 Detik",
    proof: {
      images: "gambar AI dibuat",
      sellers: "seller",
      rating: "rating",
      trust: "Dipakai seller untuk membuat visual produk yang lebih tajam setiap minggu.",
    },
    beforeAfter: {
      eyebrow: "Before vs After",
      title: "Lihat nilainya sebelum membaca lebih jauh.",
      copy: "Geser slider. Kalau foto produkmu bisa terlihat lebih menjual, langganan jadi keputusan mudah.",
    },
    steps: {
      eyebrow: "Cara kerja",
      title: "Cara Kerja DowaLabs",
      labels: ["Upload Foto", "Pilih Style", "Generate", "Download"],
      descriptions: [
        "Foto seadanya dari HP sudah cukup. Tanpa kamera, tripod, atau lampu studio.",
        "Klik satu style yang cocok. Tidak ada layer, mask, atau setting yang perlu diatur.",
        "AI bekerja sekitar 10 detik. Kamu tidak menunggu antrean revisi siapa pun.",
        "Hasilnya langsung terunduh dalam ukuran yang siap dipakai di marketplace.",
      ],
    },
    gallery: {
      eyebrow: "Yang bisa dibuat",
      title: "Satu langganan. Semua format jualan.",
    },
    feedback: {
      eyebrow: "Contoh percakapan support",
      title: "Ada yang bingung? Kami balas.",
    },
    value: {
      eyebrow: "Kenapa bayar Rp99.000?",
      title: "Karena konten manual lebih lambat dan lebih mahal.",
      oldTime: "Jam atau hari",
      newValue: "10 detik. Rp99.000 untuk 30 hari.",
      newCopy: "Cepat, konsisten, dan praktis untuk kebutuhan konten jualan harian.",
      bullets: [
        "Studio foto, designer, atau Photoshop butuh jam sampai hari untuk satu set konten.",
        `DowaLabs butuh 10 detik per visual, ${PRO_PRICE_LABEL} untuk 30 hari.`,
        `Harga normal ${PRO_PRICE_STRIKE}. Satu langganan membuka semua tool, tanpa biaya per proyek.`,
        "Hasil konsisten untuk marketplace, sosial media, katalog, dan iklan.",
      ],
      cardTrust: [
        "Tidak ada auto-debit. Kalau kamu diam saja, akses berhenti sendiri di hari ke-31.",
        `Tidak ada tagihan per foto, per proyek, atau per tool — ${PRO_PRICE_LABEL} sudah angka final.`,
        "Setiap tool terbuka penuh selama membership aktif, termasuk fitur yang baru rilis.",
      ],
      trustEyebrow: "Sebelum kamu bayar",
      trust: [
        "Tidak ada auto-debit. Kalau kamu diam saja, akses berhenti sendiri di hari ke-31.",
        `Yang keluar dari dompet cuma ${PRO_PRICE_LABEL}. Tidak ada tagihan per foto, per proyek, atau per tool.`,
        "Selama membership aktif, setiap tool terbuka penuh — termasuk fitur yang baru rilis, tanpa upgrade.",
      ],
    },
    pricing: {
      title: "Semua Termasuk.",
      period: " untuk 30 hari",
      cta: "Subscribe Sekarang",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Keraguan terakhir sebelum mulai.",
      items: [
        ["Bisa dibatalkan kapan saja?", "Ya. Langganan berjalan bulanan, jadi kamu tetap punya kontrol."],
        ["Perlu Photoshop?", "Tidak. Upload foto, pilih style, lalu download hasilnya dari browser."],
        ["Perlu skill desain?", "Tidak. DowaLabs dibuat untuk seller yang butuh visual premium tanpa belajar tool desain."],
        ["Bisa dipakai komersial?", "Bisa. Hasil dibuat untuk listing toko, iklan, katalog, dan konten sosial media."],
        ["Ada biaya tersembunyi?", "Tidak. Hanya satu paket: Rp99.000 untuk 30 hari."],
      ],
      // rendered list: 4 questions, Photoshop + skill desain merged into one
      shortlist: [
        ["Bisa dibatalkan kapan saja?", "Ya. Langganan berjalan bulanan, jadi kamu tetap punya kontrol."],
        ["Perlu Photoshop atau skill desain?", "Tidak keduanya. Upload foto, pilih style, lalu download hasilnya langsung dari browser. DowaLabs dibuat untuk seller yang butuh visual premium tanpa belajar tool desain."],
        ["Bisa dipakai komersial?", "Bisa. Hasil dibuat untuk listing toko, iklan, katalog, dan konten sosial media."],
        ["Ada biaya tersembunyi?", `Tidak. Hanya satu paket: ${PRO_PRICE_LABEL} untuk 30 hari.`],
      ],
    },
    final: {
      pre: "Berhenti menghabiskan waktu berjam-jam untuk edit foto produk.",
      title: "Biarkan AI mengerjakannya.",
      price: "Rp99.000 untuk 30 hari",
      cta: "Mulai Sekarang",
    },
  },
  en: {
    cta: "Start Now - Rp99.000 for 30 days",
    kicker: "AI Product Studio for online sellers",
    headline: "Transform ordinary product photos into studio quality images in 10 seconds.",
    subheadline:
      "Upload once and create premium marketplace visuals for Shopee, Tokopedia, TikTok Shop, and Instagram.",
    demo: "Watch 30s Demo",
    proof: {
      images: "AI images generated",
      sellers: "sellers",
      rating: "rating",
      trust: "Trusted by sellers creating sharper product visuals every week.",
    },
    beforeAfter: {
      eyebrow: "Before vs After",
      title: "See the value before you read another word.",
      copy: "Drag the slider. If your photo can sell harder, the subscription becomes obvious.",
    },
    steps: {
      eyebrow: "How it works",
      title: "How DowaLabs Works",
      labels: ["Upload Photo", "Choose Style", "Generate", "Download"],
      descriptions: [
        "A plain phone photo is enough. No camera, tripod, or studio lighting.",
        "Click one style that fits. No layers, masks, or settings to configure.",
        "The AI works in about 10 seconds. You wait on nobody's revision queue.",
        "The file downloads straight away, already sized for your marketplace.",
      ],
    },
    gallery: {
      eyebrow: "What you can create",
      title: "One subscription. Every selling format.",
    },
    feedback: {
      eyebrow: "Sample support chat",
      title: "Stuck on something? We answer.",
    },
    value: {
      eyebrow: "Why pay Rp99.000?",
      title: "Because manual content is slower and more expensive.",
      oldTime: "Hours or days",
      newValue: "10 seconds. Rp99.000 for 30 days.",
      newCopy: "Speed, consistency, and unlimited convenience for daily selling content.",
      bullets: [
        "A photo studio, a designer, or Photoshop takes hours or days for one content set.",
        `DowaLabs takes 10 seconds per visual, ${PRO_PRICE_LABEL} for 30 days.`,
        `Normally ${PRO_PRICE_STRIKE}. One subscription unlocks every tool, with no per-project fee.`,
        "Consistent output for marketplaces, social media, catalogs, and ads.",
      ],
      cardTrust: [
        "No auto-debit. Do nothing and your access simply stops on day 31.",
        `No per-photo, per-project, or per-tool billing — ${PRO_PRICE_LABEL} is the final number.`,
        "Every tool stays fully open while your membership runs, newly shipped features included.",
      ],
      trustEyebrow: "Before you pay",
      trust: [
        "No auto-debit. Do nothing and your access simply stops on day 31.",
        `Only ${PRO_PRICE_LABEL} ever leaves your wallet. No per-photo, per-project, or per-tool billing.`,
        "While your membership runs, every tool is fully open — newly shipped features included, no upgrade.",
      ],
    },
    pricing: {
      title: "Everything Included.",
      period: " for 30 days",
      cta: "Subscribe Now",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Last doubts before you start.",
      items: [
        ["Can I cancel anytime?", "Yes. Your subscription is monthly, so you stay in control."],
        ["Do I need Photoshop?", "No. Upload a photo, choose a style, and download the result from your browser."],
        ["Do I need design skills?", "No. DowaLabs is built for sellers who need premium visuals without learning design tools."],
        ["Can I use commercially?", "Yes. Generated visuals are made for store listings, ads, catalogs, and social content."],
        ["Any hidden fees?", "No. One plan only: Rp99.000 for 30 days."],
      ],
      // rendered list: 4 questions, Photoshop + design skills merged into one
      shortlist: [
        ["Can I cancel anytime?", "Yes. Your subscription is monthly, so you stay in control."],
        ["Do I need Photoshop or design skills?", "Neither. Upload a photo, choose a style, and download the result straight from your browser. DowaLabs is built for sellers who need premium visuals without learning design tools."],
        ["Can I use commercially?", "Yes. Generated visuals are made for store listings, ads, catalogs, and social content."],
        ["Any hidden fees?", `No. One plan only: ${PRO_PRICE_LABEL} for 30 days.`],
      ],
    },
    final: {
      pre: "Stop spending hours editing product photos.",
      title: "Let AI do it for you.",
      price: "Rp99.000 for 30 days",
      cta: "Start Now",
    },
  },
};

function SectionIntro({ eyebrow, title, copy, className = "" }) {
  return (
    <motion.div
      className={`${styles.sectionIntro} ${className}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
    >
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </motion.div>
  );
}

function CtaButton({ children, className = "" }) {
  const { language } = useLanguage();
  const label = children || copy[language].cta;

  return (
    <Link className={`${styles.primaryCta} ${className}`} href="/signup">
      {label}
      <ArrowRight size={18} />
    </Link>
  );
}

export function ConversionLanding() {
  const { language } = useLanguage();
  const text = copy[language];
  // the hero already carries a full-size CTA; showing the sticky one on top of it
  // just gives the first screen two competing buttons.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* 1. HERO */}
      <HeroMinimalism />

      {/* 1b. Marketplace trust strip */}
      <section className={styles.proof}>
        <div className={styles.proofText}>{text.proof.trust}</div>
        <div className={styles.marqueeViewport} aria-label="Marketplace yang didukung">
          <div className={styles.logoRow}>
            {[...marketplaceLogos, ...marketplaceLogos].map(([label, src], index) => (
              <span key={`${label}-${index}`}><Image src={src} alt={`${label} logo`} width={140} height={46} className={`${styles.marketplaceLogo} ${src.includes("-wide") ? "" : styles.marketplaceLogoSquare}`} /></span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. TOOLS + UNTUK SIAPA + TESTIMONI */}
      <section className={`${styles.sectionBlock} ${styles.sectionBlockAlt}`} id="features">
        <div className={`${styles.shell} ${styles.featuresGrid}`}>
          <div className={styles.featuresMain}>
            <SectionIntro
              className={styles.sectionIntroLeft}
              eyebrow="DowaLabs"
              title={language === "id" ? "Semua Tool Kreatif dalam Satu Workspace." : "All Your Creative Tools in One Workspace."}
              copy={language === "id" ? "Dari foto produk hingga portrait dan prompt AI, semua dirancang untuk mempercepat produksi konten." : "From product photos to portraits and AI prompts, everything is designed to accelerate content production."}
            />
            <BentoGrid items={bentoFeatures(language)} ctaLabel={language === "id" ? "Jelajahi Fitur" : "Explore Feature"} />

            <div className={styles.whoBlock}>
              <SectionIntro
                className={styles.sectionIntroLeft}
                eyebrow={language === "id" ? "UNTUK SIAPA DOWALABS?" : "WHO IS DOWALABS FOR?"}
                title={language === "id" ? "Dibuat untuk Konten yang Harus Bergerak Cepat." : "Built for Content That Needs to Move Fast."}
                copy={language === "id" ? "Satu creative suite untuk seller, creator, dan tim marketing yang membutuhkan visual berkualitas tanpa workflow yang rumit." : "One creative suite for sellers, creators, and marketing teams that need quality visuals without a complicated workflow."}
              />
              <SocialProofCards language={language} />
            </div>
          </div>

          <aside className={styles.featuresAside}>
            <SectionIntro className={styles.sectionIntroLeft} eyebrow={text.feedback.eyebrow} title={text.feedback.title} />
            <FeedbackChatStack />
          </aside>
        </div>
      </section>

      {/* 3. CARA KERJA */}
      <section className={`${styles.sectionBlock} ${styles.sectionBlockAlt}`}>
        <div className={styles.shell}>
          <SectionIntro className={styles.sectionIntroLeft} eyebrow={text.steps.eyebrow} title={text.steps.title} />
          <div className={`${styles.steps} ${styles.stepsCompact}`}>
            {[ImagePlus, Palette, WandSparkles, Download].map((Icon, index) => (
              <motion.div className={styles.step} key={text.steps.labels[index]} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                <Icon size={30} />
                <strong>{text.steps.labels[index]}</strong>
                <p>{text.steps.descriptions[index]}</p>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PAKET DOWALABS + FAQ */}
      <section className={styles.sectionBlock} id="pricing">
        <div className={`${styles.shell} ${styles.pricingGrid}`}>
          <SinglePricingCard language={language} trustPoints={text.value.cardTrust} />
          {/* the anchor moved off the deleted section onto this wrapper so the
              navbar's /#faq link still lands on the questions. */}
          <div className={styles.faqAside} id="faq">
            <SectionIntro className={styles.sectionIntroLeft} eyebrow={text.faq.eyebrow} title={text.faq.title} />
            <div className={styles.faqList}>
              {text.faq.shortlist.map(([question, answer], index) => (
                <details key={question} open={index === 0} className={styles.faqItem}>
                  <summary>{question}<ChevronDown size={18} /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {pastHero ? (
        <div className={styles.stickyCta}>
          <span>{PRO_PRICE_LABEL}/30 {language === "id" ? "hari" : "days"}</span>
          <CtaButton>{text.final.cta}</CtaButton>
        </div>
      ) : null}
      <WhatsappHelp number="082298062959" />
    </div>
  );
}
