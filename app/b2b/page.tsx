"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const SLOTS_TOTAL = 24;

export default function B2BPage() {
  const [visitorProfile, setVisitorProfile] = useState<"solo" | "team" | "company">(
    "company",
  );
  const [companySize, setCompanySize] = useState("");
  const [sector, setSector] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureSubmitted, setCaptureSubmitted] = useState(false);

  const remainingSlots = useMemo(() => SLOTS_TOTAL - 7, []);

  const heroSubtitle = useMemo(() => {
    if (visitorProfile === "company") {
      return "Une expérience clé en main pour ouvrir le dialogue sur l’IA, l’innovation et la transformation avec vos équipes et parties prenantes.";
    }
    if (visitorProfile === "team") {
      return "Un moment fort pour vos équipes projet, séminaires ou ateliers d’onboarding, qui fait vivre concrètement vos messages RH et innovation.";
    }
    return "Une visite idéale pour un décideur, un RH ou un manager qui souhaite tester l’expérience avant d’y amener ses équipes.";
  }, [visitorProfile]);

  const slots = useMemo(
    () => [
      { id: "mar-am", label: "Mar. 10:00", type: "public" as const },
      { id: "mar-pm", label: "Mar. 15:00", type: "b2b" as const },
      { id: "jeu-am", label: "Jeu. 10:00", type: "b2b" as const },
      { id: "jeu-pm", label: "Jeu. 18:30", type: "public" as const },
      { id: "sam-am", label: "Sam. 11:00", type: "public" as const },
      { id: "sam-pm", label: "Sam. 16:00", type: "b2b" as const },
    ],
    [],
  );

  const isPrivateEligible =
    Number(peopleCount || "0") >= 8 || visitorProfile === "company" || visitorProfile === "team";

  function handleSubmit() {
    const audience =
      visitorProfile === "company"
        ? "B2B (entreprise)"
        : visitorProfile === "team"
          ? "groupe"
          : "visiteur individuel";

    const labelSlot = selectedSlot
      ? slots.find((s) => s.id === selectedSlot)?.label ?? "créneau à définir ensemble"
      : "créneau à définir ensemble";

    const privateText = isPrivateEligible
      ? "Votre demande sera traitée comme une demande de créneau privé pour votre groupe."
      : "Vous serez positionné(e) sur un créneau partagé adapté à votre profil.";

    setConfirmationMessage(
      `Votre demande (${audience}) a été simulée pour le créneau "${labelSlot}" avec ${peopleCount || "un nombre de personnes à préciser"} participant(s). ${privateText} Vous serez redirigé(e) vers Eventbrite dans un vrai flux pour finaliser la réservation.`,
    );
    setFormSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-slate-950">
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* HERO B2B */}
        <section
          id="hero-b2b"
          className="flex flex-col gap-10 rounded-3xl bg-white px-6 py-10 shadow-sm dark:bg-slate-900 md:flex-row md:items-start md:py-14"
        >
          <div className="flex-1 space-y-5 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Espace B2B
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Venez découvrir comment Mirokaï peut transformer votre entreprise
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              {heroSubtitle}
            </p>

            {/* Sélecteur de profil visiteur */}
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-left text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
              <p className="font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                Pour qui est cette visite ?
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setVisitorProfile("company")}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    visitorProfile === "company"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  Je représente une entreprise
                </button>
                <button
                  type="button"
                  onClick={() => setVisitorProfile("team")}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    visitorProfile === "team"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  Je viens en équipe
                </button>
                <button
                  type="button"
                  onClick={() => setVisitorProfile("solo")}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    visitorProfile === "solo"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  Je viens seul(e)
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {visitorProfile === "company" &&
                  "Nous adaptons la visite aux enjeux de votre entreprise : transformation, marque employeur, innovation RH."}
                {visitorProfile === "team" &&
                  "Idéal pour des équipes projet, des séminaires ou des ateliers d’onboarding collectifs."}
                {visitorProfile === "solo" &&
                  "Parfait pour un dirigeant, un RH ou un décideur qui souhaite tester l’expérience avant d’y amener ses équipes."}
              </p>
            </div>

            {/* Compteur de créneaux */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:ring-amber-800/60">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>
                {remainingSlots} créneaux encore disponibles ce mois-ci pour les visites{" "}
                {visitorProfile === "solo" ? "individuelles" : "B2B / groupes entreprise"}.
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-center rounded-2xl bg-slate-50 px-4 py-6 dark:bg-slate-800/80">
              <Image
                src="/icons/mirokai-logo.png"
                alt="Mirokai Experience"
                width={320}
                height={120}
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* CAS D'USAGE B2B */}
        <section className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Cas d&apos;usage pour vos équipes
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Mirokaï s&apos;intègre dans des scénarios métiers réels pour faire vivre
            l&apos;innovation de manière tangible à vos collaborateurs.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                Accueil & parcours visiteur
              </h3>
              <p>
                Mirokaï accueille vos équipes, présente le programme et oriente les
                visiteurs dans un langage chaleureux et accessible.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                RH & onboarding
              </h3>
              <p>
                Mettez en scène vos valeurs, vos métiers et vos parcours d&apos;intégration
                grâce à une expérience mémorable pour les nouveaux arrivants.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                Innovation & marque employeur
              </h3>
              <p>
                Faites de Mirokaï le symbole de votre stratégie d&apos;innovation et
                renforcez l&apos;attractivité de votre entreprise auprès des talents.
              </p>
            </div>
          </div>
        </section>

        {/* GESTION DES CRÉNEAUX & FORMULAIRE B2B */}
        <section
          id="features"
          className="mt-16 space-y-6 rounded-3xl bg-slate-900 px-6 py-8 text-slate-50 dark:bg-slate-900"
        >
          <h2 className="text-2xl font-semibold tracking-tight">Pré-qualifier votre visite B2B</h2>
          <p className="text-sm text-slate-200">
            Partagez quelques informations pour que nous puissions préparer une expérience
            alignée avec vos enjeux.
          </p>

          {/* Gestion des créneaux */}
          <div className="mt-4 space-y-3 rounded-2xl bg-slate-950/30 p-4 text-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
              Gestion des créneaux et réservation
            </p>
            <div className="grid gap-2 text-xs md:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left ${
                    selectedSlot === slot.id
                      ? "bg-slate-50 text-slate-900"
                      : "bg-slate-900/40 text-slate-50 hover:bg-slate-800"
                  }`}
                >
                  <span>{slot.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      slot.type === "b2b"
                        ? "bg-emerald-400 text-slate-900"
                        : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    {slot.type === "b2b" ? "Groupe entreprise" : "Grand public"}
                  </span>
                </button>
              ))}
            </div>
            {isPrivateEligible && (
              <p className="mt-2 text-xs text-emerald-200">
                Votre configuration permet de demander un créneau privé pour les groupes de
                8 personnes et plus. Cette option sera privilégiée lors de la réservation.
              </p>
            )}
            <p className="mt-2 text-[11px] text-slate-300">
              Dans la version connectée, la sélection ci-dessus serait synchronisée avec un
              calendrier (Eventbrite, Calendly, etc.) et les créneaux B2B / grand public
              seraient mis à jour en temps réel.
            </p>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-1 md:col-span-1">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
                Taille de votre entreprise
              </label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full rounded-md border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
              >
                <option value="">Sélectionner</option>
                <option value="small">Moins de 50 personnes</option>
                <option value="medium">50 à 500 personnes</option>
                <option value="large">Plus de 500 personnes</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
                Secteur d&apos;activité
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Ex : Banque, Industrie, Santé..."
                className="w-full rounded-md border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
                Nombre de personnes prévues
              </label>
              <input
                type="number"
                min={1}
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full rounded-md border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
                Message (optionnel)
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
                placeholder="Partagez vos attentes, vos dates cibles ou un contexte spécifique."
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 text-xs text-slate-300">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-full bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-white md:w-auto"
              >
                Envoyer une demande de créneau
              </button>
              <p>
                Ce formulaire est une simulation. Dans la version finale, les informations
                seraient transmises à vos outils (Eventbrite, CRM, agenda…) et un lien de
                réservation pré-rempli serait généré.
              </p>
              {formSubmitted && (
                <div className="mt-2 rounded-xl bg-slate-800 px-4 py-3 text-[11px] text-slate-100">
                  <p className="font-semibold">Confirmation simulée</p>
                  <p className="mt-1">{confirmationMessage}</p>
                  <p className="mt-2">
                    Exemple de redirection :{" "}
                    <span className="break-all underline">
                      https://www.eventbrite.fr/e/mirokai-experience?profil={visitorProfile}
                      &taille={companySize || "na"}&secteur={sector || "na"}&
                      personnes={peopleCount || "na"}
                    </span>
                  </p>
                  <p className="mt-2">
                    Le message de confirmation final pourra être personnalisé selon que le
                    visiteur est B2B (entreprise/groupe) ou B2C (individuel).
                  </p>
                </div>
              )}
            </div>
          </form>
        </section>
      </main>

      {/* Bannière de capture email / nurturing */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-5xl px-4 pb-4">
        <div className="rounded-2xl border border-slate-300 bg-white/95 px-4 py-3 text-xs text-slate-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
          {captureSubmitted ? (
            <p>
              Merci, nous pourrions vous envoyer des cas d&apos;usage Mirokaï et des rappels
              (J-7, J-2, J-1) personnalisés à l&apos;adresse <strong>{captureEmail}</strong> dans
              une version connectée.
            </p>
          ) : (
            <form
              className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              onSubmit={(e) => {
                e.preventDefault();
                setCaptureSubmitted(true);
              }}
            >
              <div>
                <p className="font-semibold">
                  Recevez nos cas d&apos;usage et actualités robotique Mirokaï.
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dans une vraie intégration, cela activerait un nurturing avec rappels et
                  liens de confirmation de présence pour réduire le no-show.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:justify-end">
                <input
                  type="email"
                  required
                  value={captureEmail}
                  onChange={(e) => setCaptureEmail(e.target.value)}
                  placeholder="Votre e-mail professionnel"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
                />
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  Je m&apos;inscris
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

