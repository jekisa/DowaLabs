"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Download,
  ImagePlus,
  Play,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { BeforeAfterSlider } from "@/components/landing/before-after-slider";
import { showcaseCategories, socialProof } from "@/components/landing/landing-data";
import { WhatsappHelp } from "@/components/landing/whatsapp-help";
import { useLanguage } from "@/lib/language";
import styles from "./conversion-landing.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const gallery = [
  { label: "Marketplace", src: "/images/showcase/tshirt-after1.jpg" },
  { label: "Instagram Feed", src: "/images/showcase/kopi-after2.jpg" },
  { label: "Banner", src: "/images/showcase/watch-after4.jpg" },
  { label: "Poster", src: "/images/showcase/snack-after4.jpg" },
  { label: "Portrait", src: "/images/showcase/Character_1.jpg" },
  { label: "Lifestyle", src: "/images/showcase/tumbler-after1.jpg" },
  { label: "Shopee", src: "/images/showcase/kacang-after3.jpg" },
  { label: "TikTok Shop", src: "/images/showcase/watch-after2.jpg" },
];

const included = [
  "Product Studio",
  "AI Background",
  "AI Portrait",
  "Color Grading",
  "AI Prompt Library",
  "New Features",
  "Browser Based",
];

const copy = {
  id: {
    cta: "Mulai Sekarang - Rp29.900/bulan",
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
      title: "Upload. Pilih. Download.",
      labels: ["Upload Foto", "Pilih Style", "Download"],
    },
    gallery: {
      eyebrow: "Yang bisa dibuat",
      title: "Satu langganan. Semua format jualan.",
    },
    value: {
      eyebrow: "Kenapa bayar Rp29.900?",
      title: "Karena konten manual lebih lambat dan lebih mahal.",
      oldTime: "Jam atau hari",
      newValue: "10 detik. Rp29.900/bulan.",
      newCopy: "Cepat, konsisten, dan praktis untuk kebutuhan konten jualan harian.",
    },
    pricing: {
      title: "Semua Termasuk.",
      period: "/bulan",
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
        ["Ada biaya tersembunyi?", "Tidak. Hanya satu paket: Rp29.900/bulan."],
      ],
    },
    final: {
      pre: "Berhenti menghabiskan waktu berjam-jam untuk edit foto produk.",
      title: "Biarkan AI mengerjakannya.",
      price: "Rp29.900/bulan.",
      cta: "Mulai Sekarang",
    },
  },
  en: {
    cta: "Start Now - Rp29.900/month",
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
      title: "Upload. Choose. Download.",
      labels: ["Upload Photo", "Choose Style", "Download"],
    },
    gallery: {
      eyebrow: "What you can create",
      title: "One subscription. Every selling format.",
    },
    value: {
      eyebrow: "Why pay Rp29.900?",
      title: "Because manual content is slower and more expensive.",
      oldTime: "Hours or days",
      newValue: "10 seconds. Rp29.900/month.",
      newCopy: "Speed, consistency, and unlimited convenience for daily selling content.",
    },
    pricing: {
      title: "Everything Included.",
      period: "/month",
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
        ["Any hidden fees?", "No. One plan only: Rp29.900/month."],
      ],
    },
    final: {
      pre: "Stop spending hours editing product photos.",
      title: "Let AI do it for you.",
      price: "Rp29.900/month.",
      cta: "Start Now",
    },
  },
};

function SectionIntro({ eyebrow, title, copy }) {
  return (
    <motion.div
      className={styles.sectionIntro}
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

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <motion.p className={styles.kicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {text.kicker}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {text.headline}
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {text.subheadline}
          </motion.p>
          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <CtaButton />
            <Link className={styles.secondaryCta} href="/demo">
              <Play size={18} />
              {text.demo}
            </Link>
          </motion.div>
          <motion.div
            className={styles.heroProof}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32 }}
          >
            <span>{socialProof.generatedImages} {text.proof.images}</span>
            <span>{socialProof.activeUsers} {text.proof.sellers}</span>
            <span>{socialProof.rating} {text.proof.rating}</span>
          </motion.div>
        </div>

        <motion.div
          className={styles.demoShell}
          id="demo"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <div className={styles.demoHeader}>
            <span>Before</span>
            <Zap size={16} />
            <span>AI</span>
            <Zap size={16} />
            <span>After</span>
          </div>
          <video className={styles.demoVideo} src="/videos/demo-tumbler.mp4" autoPlay muted loop playsInline poster="/images/showcase/tumbler-after1.jpg" />
        </motion.div>
      </section>

      <section className={styles.proof}>
        <div className={styles.proofText}>{text.proof.trust}</div>
        <div className={styles.logoRow}>
          {socialProof.logos.map((logo) => (
            <span key={logo}>{logo}</span>
          ))}
        </div>
      </section>

      <section className={styles.section} id="examples">
        <SectionIntro eyebrow={text.beforeAfter.eyebrow} title={text.beforeAfter.title} copy={text.beforeAfter.copy} />
        <div className={styles.sliderGrid}>
          <BeforeAfterSlider before={showcaseCategories[0].before} after={showcaseCategories[0].after} alt={showcaseCategories[0].alt} priority />
          <div className={styles.categoryStack}>
            {showcaseCategories.map((item) => (
              <div className={styles.categoryPill} key={item.id}>
                <span>{item.label}</span>
                <Image src={item.after} alt={item.alt} width={86} height={64} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <SectionIntro eyebrow={text.steps.eyebrow} title={text.steps.title} />
        <div className={styles.steps}>
          {[
            [ImagePlus, text.steps.labels[0]],
            [WandSparkles, text.steps.labels[1]],
            [Download, text.steps.labels[2]],
          ].map(([Icon, label], index) => (
            <motion.div className={styles.step} key={label} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <Icon size={30} />
              <strong>{label}</strong>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="gallery">
        <SectionIntro eyebrow={text.gallery.eyebrow} title={text.gallery.title} />
        <div className={styles.gallery}>
          {gallery.map((item, index) => (
            <motion.figure
              key={item.label}
              className={styles.galleryItem}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (index % 4) * 0.04 }}
              whileHover={{ scale: 1.025 }}
            >
              <Image src={item.src} alt={`${item.label} example created with DowaLabs`} fill sizes="(max-width: 768px) 50vw, 25vw" />
              <figcaption>{item.label}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <section className={styles.valueSection}>
        <SectionIntro eyebrow={text.value.eyebrow} title={text.value.title} />
        <div className={styles.valueGrid}>
          {["Studio Photography", "Designer", "Photoshop", "Freelancer"].map((item) => (
            <div className={styles.oldWay} key={item}>
              <span>{item}</span>
              <strong>{text.value.oldTime}</strong>
            </div>
          ))}
          <div className={styles.newWay}>
            <Sparkles size={28} />
            <span>DowaLabs</span>
            <strong>{text.value.newValue}</strong>
            <p>{text.value.newCopy}</p>
          </div>
        </div>
      </section>

      <section className={styles.pricingSection} id="pricing">
        <motion.div className={styles.priceCard} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <BadgeCheck size={32} />
          <h2>{text.pricing.title}</h2>
          <div className={styles.price}>Rp29.900<span>{text.pricing.period}</span></div>
          <div className={styles.included}>
            {included.map((item) => (
              <span key={item}>
                <Check size={16} />
                {item}
              </span>
            ))}
          </div>
          <CtaButton className={styles.wideCta}>{text.pricing.cta}</CtaButton>
        </motion.div>
      </section>

      <section className={styles.section} id="faq">
        <SectionIntro eyebrow={text.faq.eyebrow} title={text.faq.title} />
        <div className={styles.faqList}>
          {text.faq.items.map(([question, answer]) => (
            <details key={question} className={styles.faqItem}>
              <summary>
                {question}
                <ChevronDown size={18} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <p>{text.final.pre}</p>
          <h2>{text.final.title}</h2>
          <strong>{text.final.price}</strong>
          <CtaButton className={styles.finalButton}>{text.final.cta}</CtaButton>
        </motion.div>
      </section>

      <div className={styles.stickyCta}>
        <span>Rp29.900{text.pricing.period}</span>
        <CtaButton>{text.final.cta}</CtaButton>
      </div>
      <WhatsappHelp number="082298062959" />
    </div>
  );
}
