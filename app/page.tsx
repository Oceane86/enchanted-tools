"use client";

import Image from "next/image";
import { useState } from "react";


const DAYS = ["D", "L", "M", "M", "J", "V", "S"];
const MARS_WEEKS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, 0, 0, 0, 0],
];
const DISPO = new Set([20, 21, 22, 23, 24]);

const FAQS = [
  { q: "Comment fonctionne la conversation de Mirokaï?", a: "Le moteur de conversation IA repose sur des scénarios personnalisables et une interaction en temps réel. Les échanges sont adaptés au contexte de la visite avec une politique stricte de sécurité des données." },
  { q: "Est-ce que Mirokaï est conforme au RGPD?", a: "Oui. Nos traitements respectent le RGPD. Les données peuvent être configurées pour ne pas être conservées ou pour une durée limitée selon vos besoins." },
  { q: "Comment gérer les mises à jour?", a: "Les mises à jour logicielles et scénarios sont déployées selon un calendrier défini avec vous. Une équipe dédiée assure le suivi." },
  { q: "Quels sont les supports et canaux de communication?", a: "Support technique par e-mail, hotline dédiée et documentation en ligne. Des formations sont proposées pour vos équipes." },
  { q: "Mirokaï peut-il s'intégrer à nos systèmes existants?", a: "Oui. Des APIs et connecteurs permettent une intégration avec vos outils CRM, agenda et SI." },
  { q: "Quels sont les prérequis système?", a: "Une connexion internet stable, un navigateur récent et, pour les démos physiques, une salle équipée selon notre cahier des charges technique." },
];

const TESTIMONIALS = [
  { text: "Mirokaï nous a offert une expérience enrichissante qui transforme notre approche des technologies de pointe. Une collaboration fluide et des résultats au-delà de nos attentes.", role: "Marc D., Responsable Innovation", stars: 5 },
  { text: "L'expérience Mirokaï a créé un moment fort pour nos équipes. Un outil de dialogue et d'innovation remarquable.", role: "Sophie L., DRH", stars: 5 },
  { text: "Une immersion unique qui a su convaincre nos partenaires. Mirokaï dépasse le simple démonstrateur.", role: "Thomas B., Direction Stratégie", stars: 5 },
];

export default function Home() {
  const [slotType, setSlotType] = useState<"public" | "b2b" | "private">("b2b");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tIdx, setTIdx] = useState(0);

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
        <header className="relative z-50 flex items-center justify-between px-4 pt-5 pb-0">
          {/* Logo gauche */}
          <Image
            src="/logo-enchanted-tools.svg"
            alt="Enchanted Tools Paris"
            width={160}
            height={64}
            className="h-12 w-auto object-contain"
            priority
          />

          {/* Sélecteur langue droite */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            {/* Drapeau français */}
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
        <section id="hero" className="relative z-10 flex flex-1 flex-col justify-between px-4 pt-5 pb-4">

          {/* Grand titre – remplit toute la largeur */}
          <h1
            className="mt-10 text-center font-black uppercase text-white"
            style={{
              fontSize: "clamp(3.2rem, 14vw, 5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            L&apos;EXPÉRIENCE MIROKAÏ FAIT SON GRAND RETOUR À PARIS&nbsp;!
          </h1>

          {/* Sous-titre */}
          <p
            className="mt-6 text-center text-white/85 font-normal leading-snug"
            style={{ fontSize: "clamp(0.9rem, 4vw, 1.05rem)" }}
          >
            Rencontrez les robots Mirokaï au cœur de Paris&nbsp;!
            Découvrez le monde de la robotique et de l&apos;intelligence artificielle.
          </p>
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
          RÉSERVATION – fond violet plus saturé
      ══════════════════════════════════════ */}
      <section
        id="reservation"
        className="bg-gradient-to-b from-[#2a1466] to-[#3b1a7a] px-6 py-10"
      >
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Réservation en 1 minute
        </span>
        <h2 className="mt-3 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,6vw,2.25rem)", letterSpacing: "-0.01em" }}>
          RÉSERVEZ VOTRE{" "}
          <span className="bg-gradient-to-r from-blue-300 to-fuchsia-400 bg-clip-text text-transparent">
            SESSION MIROKAÏ
          </span>
        </h2>
        <p className="mt-2 text-[13px] font-light text-white/55">
          Disponibilité en temps réel – Confirmation instantanée
        </p>

        <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
          {/* Nav mois */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-lg border border-white/20 p-1.5 hover:bg-white/10">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="text-sm font-semibold">Mars 2026</span>
              <button type="button" className="rounded-lg border border-white/20 p-1.5 hover:bg-white/10">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <p className="text-[11px] text-white/50">Sélectionnez votre créneau</p>
          </div>

          {/* Calendrier */}
          <table className="w-full text-center text-xs">
            <thead>
              <tr>
                {DAYS.map((d, i) => (
                  <th key={i} className="pb-2 font-medium text-white/50">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MARS_WEEKS.map((week, i) => (
                <tr key={i}>
                  {week.map((d, j) => (
                    <td key={j} className="py-1">
                      {d !== 0 && (
                        <button
                          type="button"
                          className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                            DISPO.has(d)
                              ? "bg-amber-400 font-bold text-slate-900 hover:bg-amber-300"
                              : "hover:bg-white/10"
                          }`}
                        >
                          {d}
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Filtres types */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSlotType("public")}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                slotType === "public" ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Grand Public
            </button>
            <button
              type="button"
              onClick={() => setSlotType("b2b")}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                slotType === "b2b" ? "border-blue-400/60 bg-blue-500/20 text-blue-200" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Groupe Entreprise
            </button>
            <button
              type="button"
              onClick={() => setSlotType("private")}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                slotType === "private" ? "border-violet-400/60 bg-violet-500/20 text-violet-200" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Privé (8+)
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ILS NOUS FONT CONFIANCE – rose/magenta
      ══════════════════════════════════════ */}
      <section
        id="confiance"
        className="bg-gradient-to-b from-[#3b1a7a] via-[#6b1a6b] to-[#8b1a5a] px-6 py-10"
      >
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Ils nous font confiance
        </span>
        <h2 className="mt-3 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,6vw,2.25rem)", letterSpacing: "-0.01em" }}>
          ILS NOUS FONT{" "}
          <span className="bg-gradient-to-r from-fuchsia-200 to-pink-300 bg-clip-text text-transparent">
            CONFIANCE
          </span>
        </h2>
        <p className="mt-2 text-[13px] font-light text-white/55">
          Découvrez comment les entreprises leaders transforment leur organisation.
        </p>

        {/* Témoignage */}
        <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            {[...Array(TESTIMONIALS[tIdx].stars)].map((_, i) => (
              <span key={i} className="text-amber-400 text-base">★</span>
            ))}
          </div>
          <blockquote className="mt-3 text-sm leading-relaxed text-white/90">
            « {TESTIMONIALS[tIdx].text} »
          </blockquote>
          <p className="mt-3 text-right text-xs font-medium text-white/60">
            — {TESTIMONIALS[tIdx].role}
          </p>

          {/* Nav témoignages */}
          <div className="mt-4 flex items-center justify-between">
            <button type="button" onClick={() => setTIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="rounded-full border border-white/20 p-1.5 hover:bg-white/10">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} type="button" onClick={() => setTIdx(i)} className={`h-2 rounded-full transition-all ${i === tIdx ? "w-5 bg-white" : "w-2 bg-white/30"}`} />
              ))}
            </div>
            <button type="button" onClick={() => setTIdx((i) => (i + 1) % TESTIMONIALS.length)} className="rounded-full border border-white/20 p-1.5 hover:bg-white/10">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { val: "260+", lbl: "Clients satisfaits" },
            { val: "4.8 ★", lbl: "Note moyenne" },
            { val: "98%", lbl: "Taux de rétention" },
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

      <footer className="bg-[#b01e4e] py-6 text-center text-[11px] font-light tracking-wider text-white/35">
        © {new Date().getFullYear()} Mirokaï Experience. Tous droits réservés.
      </footer>
    </div>
  );
}
