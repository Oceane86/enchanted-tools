"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/* ─── Calendrier & créneaux ─── */
const DAYS = ["D", "L", "M", "M", "J", "V", "S"];
const MARS_WEEKS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, 0, 0, 0, 0],
];

type SlotKind = "public" | "b2b" | "private";

const DAY_SLOTS: Record<number, { kind: SlotKind; times: string[] }[]> = {
  9:  [{ kind: "public",  times: ["10h00", "14h00"] }],
  10: [{ kind: "public",  times: ["10h00"] }, { kind: "b2b", times: ["14h00", "16h30"] }],
  11: [{ kind: "b2b",     times: ["10h00", "14h00"] }],
  12: [{ kind: "public",  times: ["14h00", "16h30"] }],
  13: [{ kind: "private", times: ["10h00"] }],
  16: [{ kind: "public",  times: ["10h00", "14h00", "16h30"] }],
  17: [{ kind: "b2b",     times: ["10h00", "14h00"] }],
  18: [{ kind: "public",  times: ["14h00"] }, { kind: "private", times: ["10h00"] }],
  19: [{ kind: "b2b",     times: ["10h00", "14h00", "16h30"] }],
  20: [{ kind: "public",  times: ["10h00", "14h00"] }],
  23: [{ kind: "public",  times: ["10h00"] }, { kind: "b2b", times: ["14h00"] }],
  24: [{ kind: "b2b",     times: ["10h00", "16h30"] }],
  25: [{ kind: "public",  times: ["14h00", "16h30"] }],
  26: [{ kind: "private", times: ["10h00", "14h00"] }],
  27: [{ kind: "public",  times: ["10h00", "14h00"] }],
};

const SLOT_META: Record<SlotKind, { label: string; color: string; bg: string; border: string; dot: string }> = {
  public:  { label: "Grand Public",      color: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-400/50", dot: "bg-emerald-400" },
  b2b:     { label: "Groupe Entreprise",  color: "text-blue-300",    bg: "bg-blue-500/20",    border: "border-blue-400/50",    dot: "bg-blue-400"    },
  private: { label: "Privé (8+ pers.)",   color: "text-violet-300",  bg: "bg-violet-500/20",  border: "border-violet-400/50",  dot: "bg-violet-400"  },
};

const EVENTBRITE_BASE = "https://www.eventbrite.fr/e/lexperience-mirokai-musee-robotique-et-ia-tickets-1837425843159?aff=ebdsoporgprofile";

const FAQS = [
  { category: "INTELLIGENCE ARTIFICIELLE", icon: "/icons/icone_cerveau.svg",
    q: "Comment fonctionne l'IA conversationnelle de Mirokaï ?",
    a: "Mirokaï utilise des modèles de langage naturel (NLP) avancés basés sur des architectures transformer. Notre système intègre plusieurs couches : reconnaissance vocale (ASR), compréhension du contexte (NLU), génération de réponses (NLG), et synthèse vocale (TTS). L'IA est entraînée sur des millions de conversations professionnelles pour garantir pertinence et naturel dans le dialogue." },
  { category: "SÉCURITÉ & RGPD", icon: "/icons/icone_protection.svg",
    q: "Vos données sont-elles sécurisées et conformes RGPD ?",
    a: "Oui. Nos traitements respectent le RGPD. Les données sont chiffrées de bout en bout, hébergées en Europe, avec une durée de conservation paramétrable selon vos besoins." },
  { category: "AUDIO SPATIAL", icon: "/icons/icone_eclair.svg",
    q: "Comment créez-vous l'expérience audio immersive ?",
    a: "Notre système de spatialisation 3D positionne les sons en temps réel selon les interactions. La technologie brevetée d'Enchanted Tools s'adapte à chaque configuration de salle." },
  { category: "PERSONNALISATION", icon: "/icons/icone_cerveau.svg",
    q: "L'IA peut-elle vraiment s'adapter à notre culture d'entreprise ?",
    a: "Oui. Les scénarios sont entièrement personnalisables par secteur, valeurs et objectifs. Notre équipe co-construit les expériences avec vos équipes métiers." },
  { category: "INTÉGRATION TECHNIQUE", icon: "/icons/icone_protection.svg",
    q: "Mirokaï peut-il s'intégrer à nos systèmes existants ?",
    a: "Oui. Des APIs et connecteurs permettent une intégration avec vos outils CRM, agenda et SI. Un accompagnement technique de bout en bout est inclus." },
  { category: "PERFORMANCE & FIABILITÉ", icon: "/icons/icone_eclair.svg",
    q: "Quelle est la disponibilité du système ?",
    a: "Disponibilité garantie à 99,9% avec monitoring en temps réel. Un support technique dédié est disponible 7j/7 pour les partenaires entreprises." },
];

const TESTIMONIALS = [
  { text: "Mirokaï nous a offert une expérience enrichissante qui transforme notre approche des technologies de pointe. Une collaboration fluide et des résultats au-delà de nos attentes.", role: "Marc D.", title: "Responsable Innovation", company: "Renault Group", initials: "RG", color: "#f59e0b", stars: 5 },
  { text: "L'expérience Mirokaï a créé un moment fort pour nos équipes. Un outil de dialogue et d'innovation remarquable qui a marqué tous les participants.", role: "Sophie L.", title: "DRH", company: "BNP Paribas", initials: "BNP", color: "#10b981", stars: 5 },
  { text: "Une immersion unique qui a su convaincre nos partenaires. Mirokaï dépasse le simple démonstrateur pour devenir un vrai vecteur de transformation.", role: "Thomas B.", title: "Direction Stratégie", company: "Capgemini", initials: "CAP", color: "#6366f1", stars: 5 },
  { text: "Nos collaborateurs ont adoré la rencontre avec les robots. Une expérience mémorable qui renforce l'attractivité de notre marque employeur.", role: "Julie R.", title: "Chief Digital Officer", company: "Accor Hotels", initials: "AC", color: "#ec4899", stars: 5 },
  { text: "Une visite qui a ouvert des perspectives concrètes sur l'IA. Mirokaï rend l'intelligence artificielle accessible et humaine.", role: "Antoine M.", title: "Head of Innovation Lab", company: "SNCF", initials: "SNCF", color: "#3b82f6", stars: 5 },
];

type PlanZone = { id: string; label: string; color: string; icon: string; description: string; capacity: string; top: string; left: string; width: string; height: string };

const PLAN_ZONES: PlanZone[] = [
  { id: "mirokai",  label: "Mirokaï Experience",      color: "#c026d3", icon: "🤖", description: "Espace principal d'exposition et d'interaction avec les robots Mirokaï. Vivez une expérience immersive avec Miroka et Miroki.", capacity: "Jusqu'à 40 personnes",         top: "3%",  left: "1%",  width: "42%", height: "62%" },
  { id: "spoon",    label: "Zone Partenaire Spoon",    color: "#0d9488", icon: "🤝", description: "Espace dédié aux échanges professionnels B2B, présentations et networking autour des technologies robotiques.", capacity: "Espace networking 20 pers.",      top: "8%",  left: "43%", width: "24%", height: "60%" },
  { id: "regie",    label: "Régie",                    color: "#2563eb", icon: "🎛️", description: "Centre de contrôle technique des robots et des équipements audiovisuels. Supervision en temps réel de l'expérience.", capacity: "Accès techniciens uniquement",  top: "62%", left: "13%", width: "9%",  height: "16%" },
  { id: "cyclage",  label: "Salle de Cyclage",         color: "#c026d3", icon: "⚙️", description: "Salle de préparation et de mise en cycle des robots entre chaque session. Zone technique de maintenance rapide.", capacity: "Zone technique",                 top: "62%", left: "22%", width: "20%", height: "28%" },
];

export default function Home() {
  const [slotType, setSlotType] = useState<SlotKind>("public");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedKind, setSelectedKind] = useState<SlotKind | null>(null);
  const [bookingStep, setBookingStep] = useState<"calendar" | "form" | "confirm">("calendar");
  const [form, setForm] = useState({ name: "", email: "", company: "", groupSize: "" });
  const [privateRequest, setPrivateRequest] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const canSubmit = form.name.trim().length > 1 && isValidEmail(form.email) &&
    (selectedKind !== "b2b" && selectedKind !== "private" || form.company.trim().length > 0);
    
  const [heroMode, setHeroMode] = useState<"customer" | "entreprise">("customer");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tIdx, setTIdx] = useState(0);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<PlanZone | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}>

      {/* ══════════════════════════════════════
          HERO WRAPPER — couleur conditionnelle
      ══════════════════════════════════════ */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          background: heroMode === "entreprise"
            ? "#1A233A" // Couleur de fond maquette B2B
            : "linear-gradient(160deg, #2a0a5e 0%, #4e18b8 45%, #3d1580 100%)",
        }}
      >
        {/* ══ NAVBAR MOBILE ══ */}
        <header className="relative z-50 flex items-center justify-between px-4 pt-5 pb-0 md:hidden">
          <Image src="/logo_nom.svg" alt="Enchanted Tools" width={130} height={20} className="h-5 w-auto object-contain" priority />
          <div className="flex items-center rounded-full p-1" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <button type="button" onClick={() => setHeroMode("customer")}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all"
              style={{ background: heroMode === "customer" ? "#f5c518" : "transparent", color: heroMode === "customer" ? "#1a1a1a" : "rgba(255,255,255,0.6)" }}>
              customer
            </button>
            <button type="button" onClick={() => setHeroMode("entreprise")}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all"
              style={{ background: heroMode === "entreprise" ? "#1D7EFF" : "transparent", color: heroMode === "entreprise" ? "#fff" : "rgba(255,255,255,0.6)" }}>
              entreprise
            </button>
          </div>
        </header>

        {/* ══ NAVBAR DESKTOP ══ */}
        <header className="relative z-50 hidden md:flex items-center justify-between px-10 pt-5 pb-0">
          <nav className="flex items-center gap-8">
            {["Votre visite", "Conférences", "Shop"].map((lbl) => (
              <a key={lbl} href="#" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:text-white">{lbl}</a>
            ))}
          </nav>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Image src="/logo_nom.svg" alt="Enchanted Tools" width={140} height={21} className="h-5 w-auto object-contain" priority />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full p-1" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <button type="button" onClick={() => setHeroMode("customer")}
                className="rounded-full px-4 py-1.5 text-[11px] font-bold transition-all"
                style={{ background: heroMode === "customer" ? "#f5c518" : "transparent", color: heroMode === "customer" ? "#1a1a1a" : "rgba(255,255,255,0.6)" }}>
                customer
              </button>
              <button type="button" onClick={() => setHeroMode("entreprise")}
                className="rounded-full px-4 py-1.5 text-[11px] font-bold transition-all"
                style={{ background: heroMode === "entreprise" ? "#1D7EFF" : "transparent", color: heroMode === "entreprise" ? "#fff" : "rgba(255,255,255,0.6)" }}>
                entreprise
              </button>
            </div>
            <button type="button" className="flex items-center gap-1.5">
              <span className="flex h-4 w-6 overflow-hidden rounded-[2px]"><span className="flex-1 bg-[#002395]"/><span className="flex-1 bg-white"/><span className="flex-1 bg-[#ED2939]"/></span>
              <span className="text-[12px] font-semibold text-white">FR</span>
              <svg className="h-3 w-3 text-white/60" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <a href="#reservation" className="rounded-full px-5 py-2 text-[12px] font-semibold text-white transition hover:opacity-90" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}>
              Billetterie
            </a>
          </div>
        </header>

        {/* ══════════ HERO CUSTOMER ══════════ */}
        {heroMode === "customer" && (
          <section id="hero" className="relative z-10 flex flex-col px-4 pt-4 pb-0 md:px-12 md:pt-8">
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/75"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.22)" }}>
                <Image src="/icons/icone-etoile.svg" alt="" width={11} height={11} className="shrink-0 opacity-80" />
                Découvrir le monde de la robotique et de l'IA
              </span>
            </div>
            <h1 className="w-full font-black uppercase leading-[0.9] relative z-20"
              style={{ fontSize: "clamp(2.8rem, 14vw, 6rem)", letterSpacing: "-0.04em" }}>
              <span className="block text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>RENCONTREZ</span>
              <span className="block" style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "3px white", paddingLeft: "clamp(2rem, 8vw, 5rem)" }}>
                LES MIROKAÏ
              </span>
            </h1>
            <div className="mt-4 w-[58%] md:w-[50%]">
              <p className="text-[12px] leading-relaxed text-white/70">
                Un parcours immersif où technologie et enchantement se rencontrent. Accompagné de votre application, partez en mission pour comprendre l'intelligence artificielle de manière interactive et accessible.
              </p>
              <a href="#reservation" className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.22)" }}>
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Vous êtes prêts ?
              </a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mirokai-face.svg" alt="Visage Mirokaï" aria-hidden="true"
              className="absolute right-0 pointer-events-none"
              style={{ top: "24%", height: "clamp(200px, 55vw, 92%)", width: "auto", maxWidth: "73vw", objectFit: "contain", objectPosition: "right top" }} />
            <div className="relative mt-6 self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image_mirokai.svg" alt="Miroka et Miroki" className="w-[260px] md:w-[380px]" />
            </div>
          </section>
        )}

        {/* ══════════ HERO ENTREPRISE (B2B) ══════════ */}
        {heroMode === "entreprise" && (
          <section className="relative z-10 flex flex-col items-center text-center px-5 pt-8 pb-12">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70 border border-white/20">
                Découvrir le monde de la robotique et de l'IA
              </span>
            </div>
            
            <h1 className="font-black uppercase leading-none"
              style={{ fontSize: "clamp(3rem, 15vw, 6rem)", letterSpacing: "-0.02em", WebkitTextFillColor: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.6)" }}>
              MIROKAÏ
            </h1>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img_robot.svg" alt="Robot Mirokaï" className="w-[280px] md:w-[400px] mt-2 mb-6 object-contain" />

            <h2 className="text-[#FBBF24] font-black uppercase tracking-wide text-lg md:text-2xl leading-tight max-w-sm">
              LE ROBOT CONÇU POUR ASSISTER VOTRE ENTREPRISE
            </h2>

            <p className="mt-4 text-[12px] text-white/70 max-w-sm leading-relaxed">
              Découvrez comment Mirokaï améliore l'interaction humaine, assiste les équipes et transforme les espaces publics.
            </p>

            <a href="#b2b-contact" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-bold text-white transition hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)" }}>
              Vous êtes prêts ?
            </a>
          </section>
        )}
      </div>

      {/* ══════════════════════════════════════
          SECTIONS B2B UNIQUEMENT
      ══════════════════════════════════════ */}
      {heroMode === "entreprise" && (
        <div className="bg-[#1A233A]">
          
          {/* ── CAPACITÉS ── */}
          <section className="px-5 py-12 flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img_robot.svg" alt="Robot Mirokaï" className="w-[180px] mb-8" />
            
            <h2 className="font-black uppercase text-2xl md:text-3xl text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
              LES CAPACITÉS DE <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "1px white" }}>NOS MIROKAÏ</span>
            </h2>
            <p className="text-[12px] text-white/60 mb-8 max-w-sm">
              Une technologie avancée au service de l'interaction humaine
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img_robot.svg" alt="Mirokaï full" className="w-[220px] mb-8" />

            <div className="grid grid-cols-3 gap-3 w-full max-w-3xl">
              {[
                { title: "Interaction\nsociale naturelle", icon: "💬" },
                { title: "Manipulation\net assistance", icon: "🤝" },
                { title: "Mobilité dans les\nenvironnements humains", icon: "🚶" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center border border-[#3b82f6]/40 rounded-xl p-3 bg-[#2563eb]/10">
                  <span className="text-xl mb-2">{item.icon}</span>
                  <p className="text-[9px] font-bold uppercase text-center text-white/90 whitespace-pre-line">{item.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── L'AVENIR (STATS) ── */}
          <section className="px-5 py-6">
            <div className="bg-[#1e3a8a] rounded-2xl p-6 text-center shadow-2xl border border-blue-400/20 max-w-3xl mx-auto">
              <h3 className="text-white font-bold text-lg mb-3">L'avenir de l'interaction humain-robot</h3>
              <p className="text-[12px] text-white/80 leading-relaxed mb-6">
                Mirokaï n'est pas qu'un robot - c'est une nouvelle façon de penser l'accueil, l'assistance et l'expérience client dans un monde de plus en plus digital.
              </p>
              <div className="flex justify-between items-center px-2">
                <div>
                  <p className="text-2xl font-black text-white">99%</p>
                  <p className="text-[9px] text-white/60 uppercase">Satisfaction</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">50+</p>
                  <p className="text-[9px] text-white/60 uppercase">Entreprises</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">24/7</p>
                  <p className="text-[9px] text-white/60 uppercase">Disponible</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── ROBOT PENSÉ POUR INTERAGIR ── */}
          <section className="px-5 py-10 bg-[#141C30]">
            <h2 className="font-black uppercase text-2xl md:text-3xl leading-tight mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
              UN ROBOT PENSÉ POUR <br/>
              <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "1px white" }}>INTERAGIR AVEC LES HUMAINS</span>
            </h2>

            <div className="rounded-2xl overflow-hidden mb-6 border border-white/10 max-w-3xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img_robot.svg" alt="Interaction Humain Robot" className="w-full h-[200px] object-contain bg-slate-800" />
            </div>

            <p className="text-[12px] text-white/80 text-center mb-6 max-w-md mx-auto">
              Mirokaï ne se contente pas d'exécuter des tâches : il crée du lien, suscite des émotions positives et enrichit l'expérience humaine.
            </p>

            <div className="space-y-3 max-w-md mx-auto">
              {[
                { icon: "🤍", text: "Stimule les interactions sociales et brise l'isolement" },
                { icon: "✨", text: "Suscite curiosité et engagement auprès de tous les publics" },
                { icon: "🌟", text: "Crée des moments positifs et mémorables" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-[11px] text-white/80">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── APPLICATIONS SANTÉ ── */}
          <section className="px-5 py-12 bg-[#1A233A]">
            <h2 className="font-black uppercase text-2xl md:text-3xl leading-tight mb-2 text-center" style={{ letterSpacing: "-0.02em" }}>
              <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "1px white" }}>APPLICATIONS DANS LE</span><br/>
              SECTEUR DE LA SANTÉ
            </h2>
            <p className="text-[11px] text-white/60 text-center mb-8 max-w-md mx-auto">
              Mirokaï apporte un soutien précieux dans les établissements de santé, en complément de l'action humaine des professionnels.
            </p>

            <div className="rounded-2xl overflow-hidden mb-6 border border-white/10 max-w-xs mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img_robot.svg" alt="Robot en santé" className="w-full h-[280px] object-contain bg-slate-800" />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              {[
                { title: "Stimulation cognitive en gériatrie", sub: "Activités ludiques, exercices de mémoire, jeux interactifs" },
                { title: "Accompagnement en EHPAD", sub: "Présence réconfortante, animation d'ateliers, soutien aux résidents" },
                { title: "Soutien aux équipes médico-sociales", sub: "Assistance dans les tâches simples, libération de temps soignant" },
              ].map((item, i) => (
                <div key={i} className="border border-white/20 rounded-xl p-3 text-center bg-white/5">
                  <p className="text-[12px] font-bold text-white mb-1">{item.title}</p>
                  <p className="text-[9px] text-white/50">{item.sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── TÉMOIGNAGES B2B ── */}
          <section className="px-5 py-12 bg-[#1C2A4A] relative overflow-hidden">
            <div className="text-center mb-6 relative z-10">
              <span className="inline-block bg-white/10 border border-white/20 rounded-sm px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                💬 TÉMOIGNAGES B2B
              </span>
              <h2 className="font-black uppercase text-3xl leading-none text-white">
                ILS NOUS FONT <br/>
                <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "1px white" }}>CONFIANCE !</span>
              </h2>
            </div>

            <div className="bg-[#4C6BA6] rounded-3xl p-6 text-center max-w-md mx-auto relative z-10 shadow-xl border border-white/20">
              <div className="text-4xl mb-2 text-[#FBBF24]">”</div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[#FBBF24] text-lg">★</span>)}
              </div>
              <p className="text-[13px] text-white/90 italic leading-relaxed">
                "Une expérience originale et captivante, qui rend la robotique vraiment accessible. On s'est laissés guider du début à la fin et on a appris sans même s'en rendre compte."
              </p>
              
              <div className="mt-6 flex items-center justify-between px-4">
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10">‹</button>
                <div className="flex gap-1.5">
                  <span className="w-4 h-1.5 bg-[#FBBF24] rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
                </div>
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10">›</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6 max-w-md mx-auto relative z-10">
              <div className="bg-[#4C6BA6]/50 border border-white/10 rounded-xl py-3 text-center">
                <p className="text-lg font-black text-white">250+</p>
                <p className="text-[8px] uppercase text-white/60 font-bold mt-1">CLIENTS<br/>SATISFAITS</p>
              </div>
              <div className="bg-[#4C6BA6]/50 border border-white/10 rounded-xl py-3 text-center">
                <p className="text-lg font-black text-white">4.9 ★</p>
                <p className="text-[8px] uppercase text-white/60 font-bold mt-1">NOTE<br/>MOYENNE</p>
              </div>
              <div className="bg-[#4C6BA6]/50 border border-white/10 rounded-xl py-3 text-center">
                <p className="text-lg font-black text-white">98%</p>
                <p className="text-[8px] uppercase text-white/60 font-bold mt-1">TAUX DE<br/>RECOMMANDATION</p>
              </div>
            </div>
          </section>

          {/* ── FORMULAIRE CONTACT B2B ── */}
          <section id="b2b-contact" className="px-5 py-12 bg-[#121B2D]">
            <h2 className="font-black uppercase text-2xl md:text-3xl leading-tight mb-2 text-center" style={{ letterSpacing: "-0.02em" }}>
              <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "1px white" }}>DÉCOUVREZ MIROKAÏ</span><br/>
              DANS VOTRE ORGANISATION
            </h2>
            <p className="text-[11px] text-white/60 text-center mb-8 max-w-md mx-auto">
              Organisez une démonstration sur site ou échangez avec notre équipe pour explorer les possibilités d'intégration.
            </p>

            <form className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-[10px] text-white/70 mb-1 ml-1">Nom *</label>
                <input type="text" placeholder="Votre nom" className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-[10px] text-white/70 mb-1 ml-1">Organisation *</label>
                <input type="text" placeholder="Nom de votre organisation" className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-[10px] text-white/70 mb-1 ml-1">Secteur d'activité *</label>
                <select className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white/50 outline-none focus:border-blue-400 appearance-none">
                  <option>Sélectionnez votre secteur</option>
                  <option>Santé / Médico-social</option>
                  <option>Retail / Luxe</option>
                  <option>Hôtellerie / Événementiel</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-white/70 mb-1 ml-1">Objectif du projet *</label>
                <textarea placeholder="Décrivez brièvement votre projet et vos objectifs..." rows={3} className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white outline-none focus:border-blue-400 resize-none"></textarea>
              </div>
              <div>
                <label className="block text-[10px] text-white/70 mb-1 ml-1">Email *</label>
                <input type="email" placeholder="votre@email.com" className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-[10px] text-white/70 mb-1 ml-1">Téléphone</label>
                <input type="tel" placeholder="+33 6 12 34 56 78" className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white outline-none focus:border-blue-400" />
              </div>

              <button type="button" className="w-full bg-white text-[#111827] font-bold text-[13px] py-3.5 rounded-lg mt-2 hover:bg-gray-100 transition">
                Envoyer la demande
              </button>
            </form>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════
          SECTIONS CUSTOMER UNIQUEMENT
      ══════════════════════════════════════ */}
      {heroMode === "customer" && (
        <>
          {/* ── UNIVERS UNIQUE ── */}
          <section id="univers" className="relative px-4 py-6"
            style={{ background: "linear-gradient(180deg, #1a0d40 0%, #23115a 100%)" }}>
            <div className="flex items-stretch gap-3">
              <div className="relative shrink-0 overflow-hidden rounded-2xl" style={{ width: "40%", minHeight: "220px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image_univers.svg" alt="Un univers unique"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(10,6,24,0.75) 0%, transparent 50%)" }} />
                <div className="absolute top-6 left-3">
                  <h2 className="font-black uppercase leading-none text-white"
                    style={{ fontSize: "clamp(0.75rem, 3.5vw, 1.1rem)", letterSpacing: "-0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                    UN UNIVERS
                  </h2>
                  <h2 className="font-black uppercase leading-none"
                    style={{ fontSize: "clamp(0.75rem, 3.5vw, 1.1rem)", letterSpacing: "-0.02em",
                      WebkitTextFillColor: "transparent", WebkitTextStroke: "1px white" }}>
                    UNIQUE
                  </h2>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-3">
                {[
                  { icon: "/icons/icone_clin-d_oeil.svg", title: "Les Mirokaï",        desc: "Des créatures curieuses, mi-animaux mi-robots, à la personnalité unique." },
                  { icon: "/icons/icone_sourillant.svg",   title: "Un univers narratif", desc: "Construisez un imaginaire profond à travers des dialogues vivants." },
                  { icon: "/icons/icone_reflechit.svg",    title: "Technologies",        desc: "IA conversationnelle, audio spatial 3D et robotique de pointe." },
                ].map((card) => (
                  <div key={card.title} className="flex items-center gap-2 rounded-xl py-2.5 px-2.5"
                    style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.16)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.icon} alt="" aria-hidden="true" className="shrink-0 w-[38px] h-[38px] object-contain" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white leading-tight">{card.title}</p>
                      <p className="mt-0.5 text-[9px] font-light leading-snug text-white/60">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── APPRENDRE EN FAISANT ── */}
          <section id="apprendre" className="px-5 py-10 text-center"
            style={{ background: "linear-gradient(180deg, #2a1466 0%, #1e0f50 100%)" }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "rgba(99,102,241,0.2)", border: "1.5px solid rgba(99,102,241,0.45)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/icone_reflechit.svg" alt="" aria-hidden="true" className="w-8" />
            </div>
            <h2 className="font-black text-white" style={{ fontSize: "clamp(1.5rem, 7vw, 2.5rem)", letterSpacing: "-0.02em" }}>
              Apprendre en faisant
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-[13px] font-light leading-relaxed text-white/60">
              L'apprentissage technique sublime et l'accompagnement pour une compétence réelle et durable.
            </p>
            <div className="mt-8 space-y-0">
              {[
                { label: "COMPRENDRE L'IA",      desc: "Comprenez les rouages de l'intelligence artificielle de manière simple et vivante.",       color: "#6366f1" },
                { label: "COMMUNICATION",         desc: "Cultivez les bonnes compétences & reprenez les rênes.",                                     color: "#a78bfa" },
                { label: "ROBOTIQUE ACCESSIBLE",  desc: "Les innovations au service de l'humain permettent des effets sans précédent.",             color: "#c084fc" },
                { label: "ÉTHIQUE & ENJEUX",      desc: "Les questions essentielles que pose la technologie dans notre société.",                   color: "#e879f9" },
                { label: "APPRENTISSAGE",         desc: "Dépassez vos expériences immersives et techniques pour un apprentissage complet.",         color: "#f472b6" },
                { label: "TECHNOLOGIE",           desc: "Au cœur de la technologie et de la pratique de Demain.",                                  color: "#fb923c" },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between border-b py-4 text-left"
                  style={{ borderColor: "rgba(255,255,255,0.10)" }}>
                  <div className="flex-1 pr-4">
                    <p className="font-black uppercase"
                      style={{ fontSize: "clamp(0.85rem, 3.5vw, 1.1rem)", color: i % 2 === 0 ? "white" : "rgba(255,255,255,0.85)" }}>
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] font-light leading-snug text-white/50">{item.desc}</p>
                  </div>
                  <div className="h-14 w-14 shrink-0 rounded-full"
                    style={{ background: `${item.color}33`, border: `2px solid ${item.color}66` }} />
                </div>
              ))}
            </div>
          </section>

          {/* ── PROFIL ── */}
          <section id="profil" className="relative overflow-hidden px-5 py-10"
            style={{ background: "linear-gradient(180deg, #2a1a6e 0%, #5b1f7a 100%)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/illu_lapin_droite.svg" alt="" aria-hidden="true"
              className="pointer-events-none absolute right-2 top-10 w-[58px] md:w-[72px]" />
            <div className="text-center">
              <h2 className="whitespace-nowrap font-black uppercase leading-none text-white"
                style={{ fontSize: "clamp(1.2rem, 5.5vw, 2.8rem)", letterSpacing: "-0.01em" }}>
                COMMENT SOUHAITEZ‑VOUS
              </h2>
              <h2 className="font-black uppercase leading-none"
                style={{ fontSize: "clamp(1.2rem, 5.5vw, 2.8rem)", letterSpacing: "-0.01em",
                  WebkitTextFillColor: "transparent", WebkitTextStroke: "1.5px white" }}>
                DÉCOUVRIR MIROKAÏ ?
              </h2>
              <div className="mt-8">
                <span className="inline-block whitespace-nowrap rounded-full px-5 py-2 text-[10px] font-medium text-white"
                  style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)" }}>
                  Sélectionnez votre profil pour une expérience personnalisée
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="relative flex flex-col items-center rounded-3xl px-3 pb-4 pt-6 text-center"
                style={{ background: "linear-gradient(160deg, rgba(60,80,200,0.55) 0%, rgba(40,50,160,0.45) 100%)",
                  border: "1.5px solid rgba(120,160,255,0.55)", boxShadow: "0 0 0 1px rgba(120,160,255,0.15), 0 0 32px rgba(80,120,255,0.25)" }}>
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)", boxShadow: "0 0 12px rgba(99,102,241,0.6)" }}>
                  Populaire
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/icone_equipe.svg" alt="Équipe" className="w-[86px]" />
                <p className="mt-2 text-[13px] font-extrabold leading-tight text-white">Je viens en équipe</p>
                <p className="mt-0.5 text-[10px] font-semibold text-blue-300">Team Experience</p>
                <p className="mt-2 text-[10px] font-light leading-snug text-white/65">Réservez une session de groupe pour votre équipe (5‑20 personnes)</p>
                <button type="button" className="mt-auto w-full rounded-xl py-2 text-[11px] font-bold text-white transition hover:bg-white/10"
                  style={{ marginTop: "12px", background: "rgba(99,102,241,0.30)", border: "1px solid rgba(120,160,255,0.45)" }}>
                  Sélectionner →
                </button>
              </div>
              <div className="flex flex-col items-center rounded-3xl px-3 pb-4 pt-6 text-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/icone_solo.svg" alt="Solo" className="w-[86px]" />
                <p className="mt-2 text-[13px] font-extrabold leading-tight text-white">Je viens seul</p>
                <p className="mt-2 text-[10px] font-light leading-snug text-white/65">Rejoignez une session publique et découvrez Mirokaï en solo</p>
                <button type="button" className="mt-auto w-full rounded-xl py-2 text-[11px] font-bold text-white/80 transition hover:bg-white/10"
                  style={{ marginTop: "12px", border: "1px solid rgba(255,255,255,0.22)" }}>
                  Sélectionner →
                </button>
              </div>
            </div>
            <div className="relative mt-6" style={{ paddingBottom: "52px" }}>
              <div className="rounded-2xl px-4 py-4 text-center text-[12px] leading-relaxed text-white/80"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <p className="mb-1 text-[13px] font-bold text-white">💡 Besoin d'aide pour choisir ?</p>
                <p>Contactez notre équipe pour une recommandation personnalisée.<br />
                  Nous adaptons chaque expérience à vos objectifs professionnels et à la taille de votre organisation.</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/illu_lapin_lunette.svg" alt="" aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-2 w-[68px]" />
            </div>
          </section>

          {/* ── RÉSERVATION ── */}
          <section id="reservation" className="relative px-5 py-10"
            style={{
              backgroundImage: "url('/fond_calendriier.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#2a1466",
            }}>
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Réservation en 1 minute
            </span>
            <h2 className="mt-3 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,6vw,2.25rem)", letterSpacing: "-0.01em" }}>
              RÉSERVEZ VOTRE{" "}
              <span className="bg-gradient-to-r from-blue-300 to-fuchsia-400 bg-clip-text text-transparent">SESSION MIROKAÏ</span>
            </h2>
            <p className="mt-2 text-[13px] font-light text-white/55">Disponibilité en temps réel – Confirmation instantanée</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(SLOT_META) as SlotKind[]).map((k) => (
                <button key={k} type="button" onClick={() => setSlotType(k)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                    slotType === k ? `${SLOT_META[k].bg} ${SLOT_META[k].border} ${SLOT_META[k].color}` : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                  }`}>
                  <span className={`h-2 w-2 rounded-full ${SLOT_META[k].dot}`} />
                  {SLOT_META[k].label}
                </button>
              ))}
            </div>

            {bookingStep === "calendar" && (
              <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Mars 2026</span>
                  <span className="text-[11px] text-white/50">Cliquez sur un jour disponible</span>
                </div>
                <table className="w-full text-center text-xs">
                  <thead><tr>{DAYS.map((d, i) => <th key={i} className="pb-2 font-medium text-white/40">{d}</th>)}</tr></thead>
                  <tbody>
                    {MARS_WEEKS.map((week, i) => (
                      <tr key={i}>
                        {week.map((d, j) => {
                          const slots = d !== 0 ? DAY_SLOTS[d] : undefined;
                          const kinds = slots ? slots.map(s => s.kind) : [];
                          const isSelected = selectedDay === d;
                          return (
                            <td key={j} className="py-0.5">
                              {d !== 0 && (
                                <button type="button"
                                  onClick={() => { if (slots) { setSelectedDay(d); setSelectedTime(null); setSelectedKind(null); } }}
                                  className={`mx-auto flex flex-col items-center justify-center rounded-xl w-8 py-1 transition ${
                                    isSelected ? "bg-white/20 ring-2 ring-white/40" : slots ? "hover:bg-white/10 cursor-pointer" : "opacity-30 cursor-default"
                                  }`}>
                                  <span className={`text-xs font-semibold ${slots ? "text-white" : "text-white/40"}`}>{d}</span>
                                  {kinds.length > 0 && (
                                    <span className="mt-0.5 flex gap-0.5">
                                      {kinds.map((k, ki) => <span key={ki} className={`h-1 w-1 rounded-full ${SLOT_META[k].dot}`} />)}
                                    </span>
                                  )}
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedDay && DAY_SLOTS[selectedDay] && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="mb-3 text-[12px] font-semibold text-white/70">Créneaux disponibles — {selectedDay} mars 2026</p>
                    <div className="flex flex-col gap-2">
                      {DAY_SLOTS[selectedDay].map((slot, si) => (
                        <div key={si}>
                          <p className={`mb-1.5 text-[10px] font-bold uppercase tracking-wider ${SLOT_META[slot.kind].color}`}>
                            <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${SLOT_META[slot.kind].dot}`} />
                            {SLOT_META[slot.kind].label}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {slot.times.map((t) => {
                              const isSelT = selectedTime === t && selectedKind === slot.kind;
                              return (
                                <button key={t} type="button" onClick={() => { setSelectedTime(t); setSelectedKind(slot.kind); }}
                                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                                    isSelT ? `${SLOT_META[slot.kind].bg} ${SLOT_META[slot.kind].border} ${SLOT_META[slot.kind].color}` : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                                  }`}>
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedTime && selectedKind && (
                      <button type="button"
                        onClick={() => { setBookingStep("form"); setPrivateRequest(selectedKind === "private"); }}
                        className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90">
                        Réserver ce créneau →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {bookingStep === "form" && selectedDay && selectedTime && selectedKind && (
              <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                <button type="button" onClick={() => setBookingStep("calendar")}
                  className="mb-4 flex items-center gap-1 text-[12px] text-white/50 hover:text-white">
                  ← Retour au calendrier
                </button>
                <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${SLOT_META[selectedKind].bg} ${SLOT_META[selectedKind].border} ${SLOT_META[selectedKind].color}`}>
                  <span className={`h-2 w-2 rounded-full ${SLOT_META[selectedKind].dot}`} />
                  {SLOT_META[selectedKind].label} — {selectedDay} mars {selectedTime}
                </div>
                <div className="flex flex-col gap-3">
                  <input type="text" placeholder="Nom complet *" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
                    style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div>
                    <input type="email" placeholder="Email *" value={form.email}
                      onChange={e => { const v = e.target.value; setForm(f => ({ ...f, email: v })); setEmailError(v && !isValidEmail(v) ? "Adresse email invalide (ex: nom@domaine.fr)" : ""); }}
                      onBlur={e => setEmailError(e.target.value && !isValidEmail(e.target.value) ? "Adresse email invalide (ex: nom@domaine.fr)" : "")}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition ${emailError ? "border-red-400/70 bg-red-500/10" : "border-white/20 focus:border-white/40"}`}
                      style={{ background: emailError ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.07)" }} />
                    {emailError && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-red-400">
                        <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {emailError}
                      </p>
                    )}
                  </div>
                  {(selectedKind === "b2b" || selectedKind === "private") && (
                    <input type="text" placeholder="Entreprise / Organisation *" value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
                      style={{ background: "rgba(255,255,255,0.07)" }} />
                  )}
                  {(selectedKind === "b2b" || selectedKind === "private") && (
                    <input type="number" placeholder="Nombre de personnes (min. 8 pour privé)" value={form.groupSize}
                      onChange={e => setForm(f => ({ ...f, groupSize: e.target.value }))}
                      className="w-full rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
                      style={{ background: "rgba(255,255,255,0.07)" }} />
                  )}
                  {selectedKind === "private" && form.groupSize && parseInt(form.groupSize) < 8 && (
                    <p className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
                      ⚠️ Les sessions privées sont réservées aux groupes de 8 personnes minimum.
                    </p>
                  )}
                </div>
                <button type="button" disabled={!canSubmit}
                  onClick={() => {
                    if (!canSubmit) return;
                    const url = new URL(EVENTBRITE_BASE);
                    url.searchParams.set("prefill_Name", form.name.trim());
                    url.searchParams.set("prefill_Email", form.email.trim());
                    if (form.company.trim()) url.searchParams.set("prefill_Company", form.company.trim());
                    window.open(url.toString(), "_blank");
                    setBookingStep("confirm");
                  }}
                  className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40">
                  Confirmer et aller sur Eventbrite →
                </button>
                {(!form.name.trim() || !form.email.trim()) && (
                  <p className="mt-1.5 text-center text-[11px] text-white/40">Remplis les champs obligatoires (*) pour continuer</p>
                )}
              </div>
            )}

            {bookingStep === "confirm" && selectedKind && (
              <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
                  <svg className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-base font-bold text-white">Réservation en cours !</p>
                <p className="mt-1 text-[13px] text-white/60">Vous avez été redirigé vers Eventbrite pour finaliser votre inscription.</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                  {selectedKind === "b2b" ? (
                    <>
                      <p className="text-[12px] font-semibold text-blue-300 mb-2">📋 Session Groupe Entreprise</p>
                      <p className="text-[12px] text-white/70 leading-relaxed">Un conseiller vous contactera sous 24h pour personnaliser votre expérience.</p>
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[12px] text-white/80">📧 <a href="mailto:b2b@enchanted-tools.com" className="text-blue-300 underline">b2b@enchanted-tools.com</a></p>
                        <p className="text-[12px] text-white/80">📞 <span className="text-blue-300">+33 1 84 80 00 10</span></p>
                      </div>
                    </>
                  ) : selectedKind === "private" ? (
                    <>
                      <p className="text-[12px] font-semibold text-violet-300 mb-2">🔒 Session Privée</p>
                      <p className="text-[12px] text-white/70 leading-relaxed">Notre équipe événementielle vous recontacte pour organiser votre session sur-mesure.</p>
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[12px] text-white/80">📧 <a href="mailto:events@enchanted-tools.com" className="text-violet-300 underline">events@enchanted-tools.com</a></p>
                        <p className="text-[12px] text-white/80">📞 <span className="text-violet-300">+33 1 84 80 00 20</span></p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[12px] font-semibold text-emerald-300 mb-2">🎟️ Session Grand Public</p>
                      <p className="text-[12px] text-white/70 leading-relaxed">Votre place est réservée ! Un e-mail de confirmation vous sera envoyé.</p>
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[12px] text-white/80">📧 <a href="mailto:bonjour@enchanted-tools.com" className="text-emerald-300 underline">bonjour@enchanted-tools.com</a></p>
                        <p className="text-[12px] text-white/80">📞 <span className="text-emerald-300">+33 1 84 80 00 00</span></p>
                      </div>
                    </>
                  )}
                </div>
                <button type="button"
                  onClick={() => { setBookingStep("calendar"); setSelectedDay(null); setSelectedTime(null); setSelectedKind(null); setForm({ name: "", email: "", company: "", groupSize: "" }); }}
                  className="mt-4 w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Faire une autre réservation
                </button>
              </div>
            )}
          </section>

          {/* ── TÉMOIGNAGES (Customer) ── */}
          <section id="confiance" className="bg-gradient-to-b from-[#1a0d40] via-[#2a1466] to-[#3b1a7a] pb-12">
            <div className="relative overflow-hidden" style={{ minHeight: "210px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/illu_mirokai.svg" alt="" aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-full w-auto" />
              <div className="absolute inset-y-0 right-0 flex flex-col justify-between py-5 pr-5" style={{ left: "44%" }}>
                <span className="inline-flex self-start items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                  style={{ background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.45)" }}>
                  💬 TÉMOIGNAGES B2B
                </span>
                <h2 className="font-black uppercase leading-[0.88]"
                  style={{ fontSize: "clamp(1.75rem, 9vw, 3.2rem)", letterSpacing: "-0.025em" }}>
                  <span className="block text-white">ILS NOUS FONT</span>
                  <span className="block" style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "2px white" }}>CONFIANCE !</span>
                </h2>
              </div>
            </div>
            <div className="px-5">
              <div className="relative mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/illu_lapin_content.svg" alt="" aria-hidden="true"
                  className="pointer-events-none absolute top-2 right-1 z-10 w-[105px]" />
                <div className="rounded-3xl px-5 pb-5 pt-6"
                  style={{ background: "rgba(55,35,145,0.75)", border: "1.5px solid rgba(255,255,255,0.22)" }}>
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/icone_quote.svg" alt="" aria-hidden="true" className="w-[110px]" />
                  </div>
                  <div className="-mt-3 flex justify-center gap-1">
                    {[...Array(TESTIMONIALS[tIdx].stars)].map((_, si) => (
                      <span key={si} className="text-[20px] text-amber-400">★</span>
                    ))}
                  </div>
                  <blockquote className="mt-4 text-center text-[13px] italic leading-relaxed text-white/90">
                    “{TESTIMONIALS[tIdx].text}”
                  </blockquote>
                  <div className="mt-5 flex items-center justify-between">
                    <button type="button" onClick={() => setTIdx((tIdx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/70 transition hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.28)" }}>‹</button>
                    <div className="flex items-center gap-2">
                      {TESTIMONIALS.map((_, i) => (
                        <button key={i} type="button" onClick={() => setTIdx(i)}
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ width: i === tIdx ? "24px" : "8px", background: i === tIdx ? "#f5c518" : "rgba(255,255,255,0.30)" }} />
                      ))}
                    </div>
                    <button type="button" onClick={() => setTIdx((tIdx + 1) % TESTIMONIALS.length)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/70 transition hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.28)" }}>›</button>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { val: "250+", lbl: "CLIENTS\nSATISFAIT" },
                  { val: "4.9 ★", lbl: "NOTE\nMOYENNE" },
                  { val: "98%",  lbl: "TAUX DE\nRECOM." },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/10 px-2 py-4">
                    <p className="text-lg font-black text-amber-400">{val}</p>
                    <p className="mt-1 whitespace-pre-line text-center text-[8px] font-bold uppercase tracking-wide text-white/60">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="bg-gradient-to-b from-[#2a1466] to-[#1e1050] px-5 py-10">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.28)" }}>
                ❓ FAQ
              </span>
            </div>
            <h2 className="mt-4 text-center text-[17px] font-bold leading-snug text-white">
              Toutes vos questions sur l'IA, la robotique et la sécurité
            </h2>
            <p className="mt-2 text-center text-[12px] font-light leading-relaxed text-white/55">
              Nos experts en IA et robotique répondent aux questions les plus fréquentes des décideurs techniques et métiers.
            </p>
            <div className="mt-6 space-y-2">
              {FAQS.map((item, i) => (
                <div key={i} className="overflow-hidden rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.35)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.icon} alt="" aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">{item.category}</p>
                      <p className="mt-0.5 text-[13px] font-bold leading-snug text-white">{item.q}</p>
                    </div>
                    <svg className={`h-5 w-5 shrink-0 text-white/50 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 pt-3 text-[12px] leading-relaxed text-white/70"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl px-5 py-5 text-center"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <p className="text-[14px] font-bold text-white">D'autres questions techniques ?</p>
              <p className="mt-1.5 text-[11px] font-light leading-relaxed text-white/60">
                Nos ingénieurs IA et robotique sont disponibles pour répondre à toutes vos questions spécifiques.
              </p>
              <button type="button"
                className="mt-4 rounded-full bg-white px-7 py-2.5 text-[12px] font-bold text-[#2a1466] transition hover:bg-white/90">
                Parler à un expert
              </button>
            </div>
          </section>

          {/* ── PLAN ── */}
          <section id="plan" className="bg-gradient-to-b from-[#b01e4e] to-[#7c1435] px-6 py-12">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Nous trouver
            </span>
            <h2 className="mt-3 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,6vw,2.25rem)", letterSpacing: "-0.01em" }}>
              OÙ NOUS{" "}
              <span className="bg-gradient-to-r from-pink-200 to-orange-300 bg-clip-text text-transparent">TROUVER ?</span>
            </h2>
            <p className="mt-2 text-[13px] text-white/60">18 Rue de la Fontaine au Roi, 75011 Paris — Métro Goncourt (L11)</p>
            <div className="relative mt-6 w-full overflow-hidden rounded-3xl border border-white/15 shadow-xl">
              <iframe src="https://maps.google.com/maps?q=18+Rue+de+la+Fontaine+au+Roi+75011+Paris+France&z=16&output=embed"
                width="100%" height="280" loading="lazy" className="block w-full" title="Google Maps – Mirokaï Experience" />
              <a href="https://www.google.com/maps/dir/?api=1&destination=18+Rue+de+la+Fontaine+au+Roi+75011+Paris"
                target="_blank" rel="noopener noreferrer"
                className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-900 shadow-lg transition hover:bg-white/90">
                📍 Itinéraire
              </a>
            </div>
            <button type="button" onClick={() => setShowMapModal(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 py-3 text-[13px] font-semibold text-white transition hover:bg-white/15"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Voir le plan du lieu
            </button>
            <div className="mt-5 grid grid-cols-2 gap-3 text-[12px]">
              {[
                { icon: "🚇", label: "Goncourt",   sub: "Ligne 11" },
                { icon: "🚌", label: "Bus 46, 75", sub: "Arrêt Fontaine au Roi" },
                { icon: "🚲", label: "Vélib'",     sub: "Station à 50m" },
                { icon: "🚗", label: "Parking",    sub: "Rue Oberkampf" },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="text-xl leading-none">{icon}</span>
                  <div><p className="font-semibold text-white">{label}</p><p className="text-white/50">{sub}</p></div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════
          MODAL DU PLAN (Uniquement ouverte par Customer)
      ══════════════════════════════════════ */}
      {showMapModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => { setShowMapModal(false); setSelectedZone(null); }}>
          <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between bg-[#7c1435] px-5 py-3">
              <div>
                <p className="text-sm font-bold text-white">Plan du lieu</p>
                <p className="text-[11px] text-white/60">18 Rue de la Fontaine au Roi, 75011 Paris</p>
              </div>
              <button type="button" onClick={() => { setShowMapModal(false); setSelectedZone(null); }}
                className="rounded-full border border-white/25 bg-white/10 p-1.5 text-white hover:bg-white/20">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative overflow-auto bg-gray-900">
              <Image src="/plan-mirokai.png" alt="Plan détaillé – Mirokaï Experience" width={1200} height={720} className="w-full object-contain" />
              {PLAN_ZONES.map((zone) => (
                <button key={zone.id} type="button"
                  onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
                  className="absolute rounded-lg transition-all duration-200"
                  style={{ top: zone.top, left: zone.left, width: zone.width, height: zone.height,
                    background: selectedZone?.id === zone.id ? zone.color + "30" : "rgba(255,255,255,0)",
                    border: selectedZone?.id === zone.id ? `2px solid ${zone.color}` : "2px solid transparent" }}>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow"
                    style={{ background: zone.color, opacity: selectedZone?.id === zone.id ? 1 : 0 }}>
                    {zone.icon} {zone.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="shrink-0 bg-[#7c1435] px-4 pt-3 pb-2 flex flex-wrap gap-2">
              {PLAN_ZONES.map((zone) => (
                <button key={zone.id} type="button"
                  onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
                  className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition"
                  style={{ borderColor: selectedZone?.id === zone.id ? zone.color : "rgba(255,255,255,0.2)",
                    background: selectedZone?.id === zone.id ? zone.color + "30" : "rgba(255,255,255,0.08)", color: "white" }}>
                  {zone.icon} {zone.label}
                </button>
              ))}
            </div>
            {selectedZone && (
              <div className="shrink-0 px-4 py-3 text-[12px]"
                style={{ background: selectedZone.color + "20", borderTop: `1px solid ${selectedZone.color}40` }}>
                <p className="font-bold text-white">{selectedZone.icon} {selectedZone.label} <span className="font-normal text-white/50">— {selectedZone.capacity}</span></p>
                <p className="mt-1 text-white/70 leading-relaxed">{selectedZone.description}</p>
              </div>
            )}
            <div className="shrink-0 bg-[#5c0f25] px-5 py-3 text-center">
              <a href="https://www.google.com/maps/dir/?api=1&destination=18+Rue+de+la+Fontaine+au+Roi+75011+Paris"
                target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-xl bg-white px-6 py-2 text-[12px] font-bold text-slate-900 shadow hover:bg-white/90"
                onClick={(e) => e.stopPropagation()}>
                📍 Calculer mon itinéraire
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#0a0618] px-6 pt-12 pb-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-[15px] font-black uppercase tracking-tight text-white">Mirokaï Experience</p>
              <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                Rencontrez les robots Mirokaï au cœur de Paris. Une expérience unique à la croisée de la robotique et de l'intelligence artificielle.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">Informations légales</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Politique de confidentialité", href: "#confidentialite" },
                  { label: "Mentions légales",             href: "#mentions" },
                  { label: "CGV",                          href: "#cgv" },
                  { label: "Gestion des cookies",          href: "#cookies" },
                  { label: "RGPD",                         href: "#rgpd" },
                ].map(({ label, href }) => (
                  <li key={label}><a href={href} className="text-[13px] text-white/55 transition hover:text-white">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">Contact</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-white/55">
                <li>📍 18 Rue de la Fontaine au Roi<br /><span className="ml-5">75011 Paris</span></li>
                <li>📧 <a href="mailto:bonjour@enchanted-tools.com" className="hover:text-white transition">bonjour@enchanted-tools.com</a></li>
                <li>📞 <a href="tel:+33184800000" className="hover:text-white transition">+33 1 84 80 00 00</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <p className="text-[11px] text-white/30">© {new Date().getFullYear()} Enchanted Tools Paris. Tous droits réservés.</p>
            <div className="flex gap-4 text-[11px] text-white/30">
              <a href="#confidentialite" className="hover:text-white/60 transition">Confidentialité</a>
              <a href="#mentions" className="hover:text-white/60 transition">Mentions légales</a>
              <a href="#cookies" className="hover:text-white/60 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}