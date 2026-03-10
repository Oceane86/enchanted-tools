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

// Chaque jour peut avoir 1..n types de créneaux disponibles
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
  public:  { label: "Grand Public",       color: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-400/50", dot: "bg-emerald-400" },
  b2b:     { label: "Groupe Entreprise",  color: "text-blue-300",    bg: "bg-blue-500/20",    border: "border-blue-400/50",    dot: "bg-blue-400"    },
  private: { label: "Privé (8+ pers.)",   color: "text-violet-300",  bg: "bg-violet-500/20",  border: "border-violet-400/50",  dot: "bg-violet-400"  },
};

const EVENTBRITE_BASE = "https://www.eventbrite.fr/e/lexperience-mirokai-musee-robotique-et-ia-tickets-1837425843159?aff=ebdsoporgprofile";

const FAQS = [
  { q: "Comment fonctionne la conversation de Mirokaï?", a: "Le moteur de conversation IA repose sur des scénarios personnalisables et une interaction en temps réel. Les échanges sont adaptés au contexte de la visite avec une politique stricte de sécurité des données." },
  { q: "Est-ce que Mirokaï est conforme au RGPD?", a: "Oui. Nos traitements respectent le RGPD. Les données peuvent être configurées pour ne pas être conservées ou pour une durée limitée selon vos besoins." },
  { q: "Comment gérer les mises à jour?", a: "Les mises à jour logicielles et scénarios sont déployées selon un calendrier défini avec vous. Une équipe dédiée assure le suivi." },
  { q: "Quels sont les supports et canaux de communication?", a: "Support technique par e-mail, hotline dédiée et documentation en ligne. Des formations sont proposées pour vos équipes." },
  { q: "Mirokaï peut-il s'intégrer à nos systèmes existants?", a: "Oui. Des APIs et connecteurs permettent une intégration avec vos outils CRM, agenda et SI." },
  { q: "Quels sont les prérequis système?", a: "Une connexion internet stable, un navigateur récent et, pour les démos physiques, une salle équipée selon notre cahier des charges technique." },
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
  { id: "mirokai",  label: "Mirokaï Experience",      color: "#c026d3", icon: "🤖", description: "Espace principal d'exposition et d'interaction avec les robots Mirokaï. Vivez une expérience immersive avec Miroka et Miroki.", capacity: "Jusqu'à 40 personnes",          top: "3%",  left: "1%",  width: "42%", height: "62%" },
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tIdx, setTIdx] = useState(0);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<PlanZone | null>(null);

  /* Auto-play carrousel toutes les 5 secondes */
  useEffect(() => {
    const t = setInterval(() => setTIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}>

      {/* ══════════════════════════════════════
          HERO plein écran – identique mobile Enchanted Tools
      ══════════════════════════════════════ */}
      <div
        className="relative flex min-h-svh flex-col"
        style={{ backgroundColor: "#192c94" }}
      >
        {/* ── NAVBAR ── */}
        <header className="relative z-50 flex items-center justify-between px-4 pt-5 pb-0 md:px-10">

          {/* ── Mobile : logo à gauche ── Desktop : liens nav à gauche ── */}
          {/* Logo mobile (caché desktop) */}
          <Image
            src="/logo-enchanted-tools.svg"
            alt="Enchanted Tools Paris"
            width={160}
            height={64}
            className="h-12 w-auto object-contain md:hidden"
            priority
          />

          {/* ── Nav desktop gauche (caché mobile) ── */}
          <nav className="hidden md:flex items-center gap-8">
            {["Votre visite", "Conférences", "Shop"].map((lbl) => (
              <a
                key={lbl}
                href="#"
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:text-white"
              >
                {lbl}
              </a>
            ))}
          </nav>

          {/* ── Logo desktop centré (position absolue) ── */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <Image
              src="/logo-enchanted-tools.svg"
              alt="Enchanted Tools Paris"
              width={160}
              height={64}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>

          {/* ── Droite desktop : Louer le lieu + FR + Billetterie ── */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="#reservation"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:text-white"
            >
              Louer le lieu
            </a>

            {/* Langue */}
            <button
              type="button"
              className="flex items-center gap-1.5"
            >
              <span className="flex h-4 w-6 overflow-hidden rounded-[2px] shadow-sm">
                <span className="flex-1 bg-[#002395]" />
                <span className="flex-1 bg-white" />
                <span className="flex-1 bg-[#ED2939]" />
              </span>
              <span className="text-[12px] font-semibold text-white">FR</span>
              <svg className="h-3 w-3 text-white/60" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* CTA Billetterie */}
            <a
              href="#reservation"
              className="rounded-full px-5 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
              style={{ background: "#0f1f6e", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              Billetterie
            </a>
          </div>

          {/* ── Mobile : sélecteur langue seul ── */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 md:hidden"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <span className="flex h-4 w-6 overflow-hidden rounded-[2px] shadow-sm">
              <span className="flex-1 bg-[#002395]" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-[#ED2939]" />
            </span>
            <span className="text-[13px] font-semibold text-white">FR</span>
            <svg className="h-3.5 w-3.5 text-white/70" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </header>

        {/* ── CONTENU HERO ── */}
        <section id="hero" className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10">

          {/* Wrapper centré */}
          <div className="w-full text-center mt-10 md:mt-0 mx-auto max-w-[90vw] md:max-w-4xl">

            {/* Grand titre */}
            <h1
              className="font-black uppercase text-white"
              style={{
                fontSize: "clamp(3.2rem, 14vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              <span className="block md:whitespace-nowrap">L&apos;EXPÉRIENCE MIROKAÏ</span>
              <span className="block mt-2">FAIT SON GRAND RETOUR À PARIS&nbsp;!</span>
            </h1>

            {/* Sous-titre */}
            <p
              className="mt-4 text-white/85 font-normal leading-snug max-w-xs mx-auto md:max-w-md"
              style={{ fontSize: "clamp(0.85rem, 3.5vw, 1rem)" }}
            >
              Rencontrez les robots Mirokaï au cœur de Paris&nbsp;!
              Découvrez le monde de la robotique et de l&apos;intelligence artificielle.
            </p>
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════
          PROFIL – style maquette
      ══════════════════════════════════════ */}
      <section
        id="profil"
        className="px-5 py-10"
        style={{ background: "linear-gradient(180deg, #2a1a6e 0%, #5b1f7a 100%)" }}
      >
        {/* Titre */}
        <h2 className="font-black uppercase leading-none text-white"
            style={{ fontSize: "clamp(1.8rem, 8vw, 2.8rem)", letterSpacing: "-0.01em" }}>
          COMMENT SOUHAITEZ‑VOUS
        </h2>
        <h2 className="font-black uppercase leading-none"
            style={{
              fontSize: "clamp(1.8rem, 8vw, 2.8rem)",
              letterSpacing: "-0.01em",
              background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
          DÉCOUVRIR MIROKAÏ&nbsp;?
        </h2>

        <p className="mt-5 text-[14px] font-semibold text-white">
          Sélectionnez votre profil pour une expérience personnalisée
        </p>

        {/* Cards côte à côte */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          {/* Carte Équipe */}
          <div
            className="relative flex flex-col items-center gap-3 rounded-2xl p-4 text-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 0 20px rgba(99,102,241,0.25)",
            }}
          >
            {/* Badge Populaire */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
              Populaire
            </span>

            {/* Icône */}
            <div
              className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.4)" }}
            >
              <svg className="h-7 w-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Je viens en équipe</p>
              <p className="text-[10px] font-medium text-blue-300 mt-0.5">Team Experience</p>
              <p className="mt-2 text-[11px] font-light text-white/65 leading-snug">
                Réservez une session de groupe pour votre équipe (5‑20 personnes)
              </p>
            </div>

            <button
              type="button"
              className="mt-auto w-full rounded-xl py-2 text-[11px] font-semibold text-white/90 transition hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Sélectionner →
            </button>
          </div>

          {/* Carte Solo */}
          <div
            className="flex flex-col items-center gap-3 rounded-2xl p-4 text-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {/* Icône */}
            <div
              className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <svg className="h-7 w-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Je viens seul</p>
              <p className="text-[10px] font-medium text-white/50 mt-0.5">Individual Session</p>
              <p className="mt-2 text-[11px] font-light text-white/65 leading-snug">
                Rejoignez une session publique et découvrez Mirokaï en solo
              </p>
            </div>

            <button
              type="button"
              className="mt-auto w-full rounded-xl py-2 text-[11px] font-semibold text-white/90 transition hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.20)" }}
            >
              Sélectionner →
            </button>
          </div>
        </div>

        {/* Encart aide */}
        <div
          className="mt-5 rounded-2xl px-4 py-4 text-[12px] leading-relaxed text-white/75 text-center"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span className="font-bold text-white">💡 Besoin d&apos;aide pour choisir&nbsp;?</span>{" "}
          Contactez notre équipe pour une recommandation personnalisée. Nous adaptons chaque expérience à vos objectifs professionnels et à la taille de votre organisation.
        </div>
      </section>

      {/* ══════════════════════════════════════
          RÉSERVATION interactive
      ══════════════════════════════════════ */}
      <section id="reservation" className="bg-gradient-to-b from-[#2a1466] to-[#3b1a7a] px-5 py-10">

        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Réservation en 1 minute
        </span>
        <h2 className="mt-3 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,6vw,2.25rem)", letterSpacing: "-0.01em" }}>
          RÉSERVEZ VOTRE{" "}
          <span className="bg-gradient-to-r from-blue-300 to-fuchsia-400 bg-clip-text text-transparent">SESSION MIROKAÏ</span>
        </h2>
        <p className="mt-2 text-[13px] font-light text-white/55">Disponibilité en temps réel – Confirmation instantanée</p>

        {/* Légende couleurs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(SLOT_META) as SlotKind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSlotType(k)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                slotType === k
                  ? `${SLOT_META[k].bg} ${SLOT_META[k].border} ${SLOT_META[k].color}`
                  : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${SLOT_META[k].dot}`} />
              {SLOT_META[k].label}
            </button>
          ))}
        </div>

        {/* ── ÉTAPE 1 : Calendrier ── */}
        {bookingStep === "calendar" && (
          <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Mars 2026</span>
              <span className="text-[11px] text-white/50">Cliquez sur un jour disponible</span>
            </div>

            <table className="w-full text-center text-xs">
              <thead>
                <tr>{DAYS.map((d, i) => <th key={i} className="pb-2 font-medium text-white/40">{d}</th>)}</tr>
              </thead>
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
                            <button
                              type="button"
                              onClick={() => { if (slots) { setSelectedDay(d); setSelectedTime(null); setSelectedKind(null); } }}
                              className={`mx-auto flex flex-col items-center justify-center rounded-xl w-8 py-1 transition ${
                                isSelected ? "bg-white/20 ring-2 ring-white/40" :
                                slots ? "hover:bg-white/10 cursor-pointer" : "opacity-30 cursor-default"
                              }`}
                            >
                              <span className={`text-xs font-semibold ${slots ? "text-white" : "text-white/40"}`}>{d}</span>
                              {/* points couleur */}
                              {kinds.length > 0 && (
                                <span className="mt-0.5 flex gap-0.5">
                                  {kinds.map((k, ki) => (
                                    <span key={ki} className={`h-1 w-1 rounded-full ${SLOT_META[k].dot}`} />
                                  ))}
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

            {/* Créneaux du jour sélectionné */}
            {selectedDay && DAY_SLOTS[selectedDay] && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="mb-3 text-[12px] font-semibold text-white/70">
                  Créneaux disponibles — {selectedDay} mars 2026
                </p>
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
                            <button
                              key={t}
                              type="button"
                              onClick={() => { setSelectedTime(t); setSelectedKind(slot.kind); }}
                              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                                isSelT
                                  ? `${SLOT_META[slot.kind].bg} ${SLOT_META[slot.kind].border} ${SLOT_META[slot.kind].color}`
                                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTime && selectedKind && (
                  <button
                    type="button"
                    onClick={() => { setBookingStep("form"); setPrivateRequest(selectedKind === "private"); }}
                    className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90"
                  >
                    Réserver ce créneau →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ÉTAPE 2 : Formulaire ── */}
        {bookingStep === "form" && selectedDay && selectedTime && selectedKind && (
          <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <button type="button" onClick={() => setBookingStep("calendar")} className="mb-4 flex items-center gap-1 text-[12px] text-white/50 hover:text-white">
              ← Retour au calendrier
            </button>

            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${SLOT_META[selectedKind].bg} ${SLOT_META[selectedKind].border} ${SLOT_META[selectedKind].color}`}>
              <span className={`h-2 w-2 rounded-full ${SLOT_META[selectedKind].dot}`} />
              {SLOT_META[selectedKind].label} — {selectedDay} mars {selectedTime}
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text" placeholder="Nom complet *"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-white/20 bg-white/8 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
                style={{ background: "rgba(255,255,255,0.07)" }}
              />
              <div>
                <input
                  type="email" placeholder="Email *"
                  value={form.email}
                  onChange={e => {
                    const v = e.target.value;
                    setForm(f => ({ ...f, email: v }));
                    setEmailError(v && !isValidEmail(v) ? "Adresse email invalide (ex: nom@domaine.fr)" : "");
                  }}
                  onBlur={e => setEmailError(e.target.value && !isValidEmail(e.target.value) ? "Adresse email invalide (ex: nom@domaine.fr)" : "")}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition ${
                    emailError ? "border-red-400/70 bg-red-500/10" : "border-white/20 focus:border-white/40"
                  }`}
                  style={{ background: emailError ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.07)" }}
                />
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
                <input
                  type="text" placeholder="Entreprise / Organisation *"
                  value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  className="w-full rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
              )}
              {(selectedKind === "b2b" || selectedKind === "private") && (
                <input
                  type="number" placeholder="Nombre de personnes (min. 8 pour privé)"
                  value={form.groupSize} onChange={e => setForm(f => ({ ...f, groupSize: e.target.value }))}
                  className="w-full rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
              )}

              {/* Avertissement privé si < 8 */}
              {selectedKind === "private" && form.groupSize && parseInt(form.groupSize) < 8 && (
                <p className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
                  ⚠️ Les sessions privées sont réservées aux groupes de 8 personnes minimum.
                </p>
              )}
            </div>

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => {
                    if (!canSubmit) return;
                    const url = new URL(EVENTBRITE_BASE);
                    url.searchParams.set("prefill_Name", form.name.trim());
                    url.searchParams.set("prefill_Email", form.email.trim());
                    if (form.company.trim()) url.searchParams.set("prefill_Company", form.company.trim());
                    window.open(url.toString(), "_blank");
                    setBookingStep("confirm");
                  }}
                  className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Confirmer et aller sur Eventbrite →
                </button>
                {(!form.name.trim() || !form.email.trim()) && (
                  <p className="mt-1.5 text-center text-[11px] text-white/40">Remplis les champs obligatoires (*) pour continuer</p>
                )}
          </div>
        )}

        {/* ── ÉTAPE 3 : Confirmation ── */}
        {bookingStep === "confirm" && selectedKind && (
          <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <svg className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <p className="text-base font-bold text-white">Réservation en cours !</p>
            <p className="mt-1 text-[13px] text-white/60">
              Vous avez été redirigé vers Eventbrite pour finaliser votre inscription.
            </p>

            {/* Message personnalisé selon le type */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
              {selectedKind === "b2b" ? (
                <>
                  <p className="text-[12px] font-semibold text-blue-300 mb-2">📋 Session Groupe Entreprise</p>
                  <p className="text-[12px] text-white/70 leading-relaxed">
                    Un conseiller vous contactera sous 24h pour personnaliser votre expérience.
                  </p>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[12px] text-white/80">📧 <a href="mailto:b2b@enchanted-tools.com" className="text-blue-300 underline">b2b@enchanted-tools.com</a></p>
                    <p className="text-[12px] text-white/80">📞 <span className="text-blue-300">+33 1 84 80 00 10</span></p>
                  </div>
                </>
              ) : selectedKind === "private" ? (
                <>
                  <p className="text-[12px] font-semibold text-violet-300 mb-2">🔒 Session Privée</p>
                  <p className="text-[12px] text-white/70 leading-relaxed">
                    Notre équipe événementielle vous recontacte pour organiser votre session sur-mesure.
                  </p>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[12px] text-white/80">📧 <a href="mailto:events@enchanted-tools.com" className="text-violet-300 underline">events@enchanted-tools.com</a></p>
                    <p className="text-[12px] text-white/80">📞 <span className="text-violet-300">+33 1 84 80 00 20</span></p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[12px] font-semibold text-emerald-300 mb-2">🎟️ Session Grand Public</p>
                  <p className="text-[12px] text-white/70 leading-relaxed">
                    Votre place est réservée ! Un e-mail de confirmation vous sera envoyé.
                  </p>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[12px] text-white/80">📧 <a href="mailto:bonjour@enchanted-tools.com" className="text-emerald-300 underline">bonjour@enchanted-tools.com</a></p>
                    <p className="text-[12px] text-white/80">📞 <span className="text-emerald-300">+33 1 84 80 00 00</span></p>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => { setBookingStep("calendar"); setSelectedDay(null); setSelectedTime(null); setSelectedKind(null); setForm({ name: "", email: "", company: "", groupSize: "" }); }}
              className="mt-4 w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Faire une autre réservation
            </button>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          ILS NOUS FONT CONFIANCE – carrousel
      ══════════════════════════════════════ */}
      <section id="confiance" className="bg-gradient-to-b from-[#3b1a7a] via-[#6b1a6b] to-[#8b1a5a] px-6 py-12 overflow-hidden">
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Ils nous font confiance
        </span>
        <h2 className="mt-3 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,6vw,2.25rem)", letterSpacing: "-0.01em" }}>
          ILS NOUS FONT{" "}
          <span className="bg-gradient-to-r from-fuchsia-200 to-pink-300 bg-clip-text text-transparent">CONFIANCE</span>
        </h2>
        <p className="mt-2 text-[13px] font-light text-white/55">
          Découvrez comment les entreprises leaders transforment leur organisation.
        </p>

        {/* ── Grille de petites cards carrées ── */}
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTIdx(i)}
              className="relative shrink-0 snap-start flex flex-col justify-between rounded-2xl p-4 transition-all duration-300"
              style={{
                width: "160px",
                height: "160px",
                background: i === tIdx
                  ? `linear-gradient(135deg, ${t.color}35 0%, ${t.color}15 100%)`
                  : "rgba(255,255,255,0.06)",
                border: i === tIdx ? `1.5px solid ${t.color}60` : "1px solid rgba(255,255,255,0.12)",
                boxShadow: i === tIdx ? `0 0 16px ${t.color}30` : "none",
              }}
            >
              {/* Étoiles */}
              <div className="flex gap-0.5">
                {[...Array(t.stars)].map((_, si) => (
                  <span key={si} className="text-amber-400 text-[10px]">★</span>
                ))}
              </div>

              {/* Citation courte */}
              <p className="text-[11px] leading-snug text-white/80 text-left line-clamp-3">
                « {t.text.slice(0, 72)}… »
              </p>

              {/* Badge entreprise */}
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-black"
                  style={{ background: t.color + "22", color: t.color }}
                >
                  {t.initials}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-white leading-tight truncate w-20">{t.role}</p>
                  <p className="text-[9px] text-white/45 truncate w-20">{t.company}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Citation complète de la card sélectionnée */}
        <div
          className="mt-4 rounded-2xl border p-4 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${TESTIMONIALS[tIdx].color}12 0%, rgba(255,255,255,0.04) 100%)`,
            borderColor: `${TESTIMONIALS[tIdx].color}30`,
          }}
        >
          <blockquote className="text-[13px] leading-relaxed text-white/85 italic">
            « {TESTIMONIALS[tIdx].text} »
          </blockquote>
          <p className="mt-2 text-right text-[11px] text-white/50">
            — {TESTIMONIALS[tIdx].role}, {TESTIMONIALS[tIdx].title}
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { val: "260+", lbl: "Clients satisfaits" },
            { val: "4.8 ★", lbl: "Note moyenne" },
            { val: "98%",  lbl: "Taux de rétention" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/10 py-4 backdrop-blur-sm">
              <p className="text-lg font-black text-amber-400">{val}</p>
              <p className="mt-0.5 text-center text-[10px] text-white/60">{lbl}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ – fond rose/magenta chaud + titre ambre
      ══════════════════════════════════════ */}
      <section
        id="faq"
        className="bg-gradient-to-b from-[#8b1a5a] to-[#b01e4e] px-6 py-10"
      >
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          FAQ
        </span>
        <h2 className="mt-3 font-black uppercase leading-none text-amber-400"
            style={{ fontSize: "clamp(2.5rem,10vw,3.75rem)", letterSpacing: "-0.02em", lineHeight: "0.95" }}>
          RÉPONSES
          <br />
          <span style={{ color: "#f59e0b" }}>TECHNIQUES</span>
        </h2>
        <p className="mt-3 text-[13px] font-medium text-white/70">
          Toutes vos questions sur l&apos;IA, la robotique et la sécurité
        </p>
        <p className="mt-0.5 text-[12px] font-light text-white/50">
          Nos experts vous répondent simplement et clairement.
        </p>

        {/* Accordéon */}
        <div className="mt-6 space-y-2">
          {FAQS.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-white/5"
              >
                <span>{item.q}</span>
                <svg className={`ml-3 h-4 w-4 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-white/75">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA expert */}
        <div className="mt-6 rounded-3xl border border-amber-400/30 bg-amber-500/10 p-6">
          <p className="text-base font-bold tracking-tight text-white">D&apos;autres questions techniques&nbsp;?</p>
          <p className="mt-1 text-[12px] font-light text-white/70">
            N&apos;hésitez pas à contacter nos experts pour des réponses personnalisées.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="rounded-xl bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-lg shadow-amber-500/40 hover:bg-amber-300">
              PARLER À UN EXPERT
            </button>
            <button type="button" className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15">
              TÉLÉCHARGER LA FICHE PRODUIT
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PLAN — carte interactive cliquable
      ══════════════════════════════════════ */}
      <section id="plan" className="bg-gradient-to-b from-[#b01e4e] to-[#7c1435] px-6 py-12">
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Nous trouver
        </span>
        <h2 className="mt-3 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,6vw,2.25rem)", letterSpacing: "-0.01em" }}>
          OÙ NOUS{" "}
          <span className="bg-gradient-to-r from-pink-200 to-orange-300 bg-clip-text text-transparent">TROUVER&nbsp;?</span>
        </h2>
        <p className="mt-2 text-[13px] text-white/60">
          18 Rue de la Fontaine au Roi, 75011 Paris — Métro Goncourt (L11)
        </p>

        {/* Plan interactif avec zones cliquables */}
        <div className="relative mt-6 w-full overflow-hidden rounded-3xl border border-white/15 shadow-xl">
          <Image
            src="/plan-mirokai.png"
            alt="Plan du lieu – Mirokaï Experience"
            width={900}
            height={540}
            className="w-full object-cover"
          />

          {/* Zones cliquables superposées */}
          {PLAN_ZONES.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
              className="absolute rounded-lg transition-all duration-200"
              style={{
                top: zone.top, left: zone.left, width: zone.width, height: zone.height,
                background: selectedZone?.id === zone.id ? zone.color + "35" : "transparent",
                border: selectedZone?.id === zone.id ? `2px solid ${zone.color}` : "2px solid transparent",
                cursor: "pointer",
              }}
              aria-label={`Zone : ${zone.label}`}
            >
              {/* Label flottant visible au hover / sélection */}
              <span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold text-white opacity-0 transition group-hover:opacity-100"
                style={{ background: zone.color, opacity: selectedZone?.id === zone.id ? 1 : undefined }}
              >
                {zone.label}
              </span>
            </button>
          ))}

          {/* Bouton plein écran */}
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-sm transition hover:bg-black/80"
          >
            ⛶ Plein écran
          </button>
        </div>

        {/* Légende des zones */}
        <div className="mt-3 flex flex-wrap gap-2">
          {PLAN_ZONES.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition"
              style={{
                borderColor: selectedZone?.id === zone.id ? zone.color : "rgba(255,255,255,0.15)",
                background: selectedZone?.id === zone.id ? zone.color + "22" : "rgba(255,255,255,0.05)",
                color: selectedZone?.id === zone.id ? "white" : "rgba(255,255,255,0.55)",
              }}
            >
              <span>{zone.icon}</span>
              {zone.label}
            </button>
          ))}
        </div>

        {/* Panneau info zone sélectionnée */}
        {selectedZone && (
          <div
            className="mt-4 rounded-2xl border p-4 transition-all duration-300"
            style={{ background: selectedZone.color + "18", borderColor: selectedZone.color + "40" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedZone.icon}</span>
                <div>
                  <p className="text-[13px] font-bold text-white">{selectedZone.label}</p>
                  <p className="text-[11px]" style={{ color: selectedZone.color }}>{selectedZone.capacity}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedZone(null)}
                className="shrink-0 text-white/40 hover:text-white text-lg leading-none"
              >×</button>
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-white/70">
              {selectedZone.description}
            </p>
          </div>
        )}

        {/* Infos pratiques */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-[12px]">
          {[
            { icon: "🚇", label: "Goncourt", sub: "Ligne 11" },
            { icon: "🚌", label: "Bus 46, 75", sub: "Arrêt Fontaine au Roi" },
            { icon: "🚲", label: "Vélib'", sub: "Station à 50m" },
            { icon: "🚗", label: "Parking", sub: "Rue Oberkampf" },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3">
              <span className="text-xl leading-none">{icon}</span>
              <div>
                <p className="font-semibold text-white">{label}</p>
                <p className="text-white/50">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modal plan agrandi ── */}
      {showMapModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête modal */}
            <div className="flex items-center justify-between bg-[#7c1435] px-5 py-3">
              <div>
                <p className="text-sm font-bold text-white">L&apos;Expérience Mirokaï</p>
                <p className="text-[11px] text-white/60">18 Rue de la Fontaine au Roi, 75011 Paris</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.openstreetmap.org/?mlat=48.8660&mlon=2.3630&zoom=17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ouvrir dans Maps ↗
                </a>
                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="rounded-full border border-white/25 bg-white/10 p-1.5 text-white hover:bg-white/20"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Plan haute résolution */}
            <div className="bg-white/5">
              <Image
                src="/plan-mirokai.png"
                alt="Plan détaillé – Mirokaï Experience"
                width={1200}
                height={720}
                className="w-full object-contain"
              />
            </div>
            {/* Bouton itinéraire */}
            <div className="bg-[#7c1435] px-5 py-3 text-center">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=18+Rue+de+la+Fontaine+au+Roi+75011+Paris"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-white px-6 py-2.5 text-[12px] font-bold text-slate-900 shadow hover:bg-white/90"
                onClick={(e) => e.stopPropagation()}
              >
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
          {/* Grille 3 colonnes desktop */}
          <div className="grid gap-10 md:grid-cols-3">

            {/* Colonne 1 – Marque */}
            <div>
              <p className="text-[15px] font-black uppercase tracking-tight text-white">Mirokaï Experience</p>
              <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                Rencontrez les robots Mirokaï au cœur de Paris. Une expérience unique à la croisée de la robotique et de l&apos;intelligence artificielle.
              </p>
              <div className="mt-4 flex gap-3">
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                   className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Colonne 2 – Navigation légale */}
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
                  <li key={label}>
                    <a href={href} className="text-[13px] text-white/55 transition hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 – Contact */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">Contact</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-white/55">
                <li>📍 18 Rue de la Fontaine au Roi<br /><span className="ml-5">75011 Paris</span></li>
                <li>
                  📧{" "}
                  <a href="mailto:bonjour@enchanted-tools.com" className="hover:text-white transition">
                    bonjour@enchanted-tools.com
                  </a>
                </li>
                <li>
                  📞{" "}
                  <a href="tel:+33184800000" className="hover:text-white transition">
                    +33 1 84 80 00 00
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Séparateur */}
          <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <p className="text-[11px] text-white/30">
              © {new Date().getFullYear()} Enchanted Tools Paris. Tous droits réservés.
            </p>
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
