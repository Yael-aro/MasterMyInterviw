import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Phone, Star, Award, Users as UsersIcon,
  CheckCircle2, ArrowRight, Target, TrendingUp, Trophy, User, Menu, X,
} from 'lucide-react';
import { submitBooking } from '../api/public';
import { APPOINTMENT_TYPE_LABELS } from '../utils/labels';
import type { AppointmentType } from '../types';

const SERVICE_DESCRIPTIONS: Record<AppointmentType, string> = {
  ONLINE_COACHING: "Un accompagnement personnalisé, à distance, adapté à ton profil et tes objectifs.",
  TECH_PREP: "Préparation ciblée aux questions techniques de ton domaine.",
  HR_PREP: "Anticipe les questions RH classiques et travaille tes réponses.",
  COMM_PREP: "Structure ton discours et gagne en clarté face aux recruteurs.",
  MOCK_INTERVIEW: "Simulation réaliste dans les conditions du jour J.",
  CV_OPTIM: "Un CV clair, percutant, qui retient l'attention des recruteurs.",
  LINKEDIN_OPTIM: "Un profil LinkedIn optimisé pour être repéré par les recruteurs.",
};

const TESTIMONIALS = [
  { name: 'Auditeur Financier', company: 'PWC', text: "Avant de suivre ce coaching, je ne savais pas comment répondre aux questions techniques et comportementales en audit. Grâce à la méthodologie et aux simulations, j'ai gagné en confiance et obtenu une offre." },
  { name: 'Consultant Junior', company: 'Deloitte', text: "Un accompagnement structuré qui m'a permis de me démarquer face à des centaines d'autres candidatures." },
  { name: 'Analyste Data', company: 'Groupe bancaire', text: "Les simulations d'entretien m'ont vraiment aidé à rester calme et confiant le jour J." },
];

const NAV_LINKS = [
  { label: 'Accueil', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Avis', href: '#avis' },
];

const SERVICE_IMAGE_FILES: Record<AppointmentType, string> = {
  ONLINE_COACHING: 'online-coaching.jpg',
  TECH_PREP: 'tech-prep.jpg',
  HR_PREP: 'hr-prep.jpg',
  COMM_PREP: 'comm-prep.jpg',
  MOCK_INTERVIEW: 'mock-interview.jpg',
  CV_OPTIM: 'cv-optim.jpg',
  LINKEDIN_OPTIM: 'linkedin-optim.jpg',
};

const ServiceCard = ({ serviceKey }: { serviceKey: AppointmentType }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = `/images/services/${SERVICE_IMAGE_FILES[serviceKey]}`;

  return (
    <div className="group relative rounded-xl overflow-hidden border border-border hover:border-gold/30 transition-all duration-200 h-56">
      {!imgError ? (
        <img
          src={imgSrc}
          alt={APPOINTMENT_TYPE_LABELS[serviceKey]}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: 'grayscale(0.3) contrast(1.05)' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1F1B12 0%, #17150F 100%)' }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-5">
        <CheckCircle2 size={16} className="text-gold mb-2" />
        <h3 className="font-medium text-cream mb-1">{APPOINTMENT_TYPE_LABELS[serviceKey]}</h3>
        <p className="text-xs text-cream-muted leading-relaxed">{SERVICE_DESCRIPTIONS[serviceKey]}</p>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
            <span className="text-bg-primary font-serif font-bold text-sm">M</span>
          </div>
          <span className="font-serif text-base font-semibold text-cream">
            Master My <span className="text-gold">Interview</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream-muted hover:text-cream transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm text-cream-muted hover:text-cream transition-colors">
            Espace admin
          </Link>
          <a href="#reserver" className="btn-primary text-sm px-4 py-2">
            Réserver
          </a>
        </div>

        <button
          className="md:hidden text-cream"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg-primary px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-cream-muted hover:text-cream transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link to="/login" className="block text-sm text-cream-muted hover:text-cream transition-colors">
            Espace admin
          </Link>
          <a href="#reserver" className="btn-primary text-sm px-4 py-2 inline-block">
            Réserver
          </a>
        </div>
      )}
    </header>
  );
};

const STATS = [
  { value: '100+', label: 'Candidats accompagnés' },
  { value: '5.8K+', label: 'Abonnés LinkedIn' },
  { value: '15 min', label: 'Réponse moyenne' },
];

const Hero = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A227 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-16 sm:pt-40 sm:pb-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-xs text-gold font-medium tracking-wide uppercase">
              Coaching certifié · Top Voice LinkedIn
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream leading-[1.1] mb-6">
            Transforme ton stress d'entretien en <span className="text-gold">offre d'emploi.</span>
          </h1>

          <p className="text-cream-muted text-lg mb-8 max-w-lg">
            Coaching personnalisé, simulations réalistes et un accompagnement dédié
            jusqu'au jour J — pour te démarquer face aux recruteurs.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a href="#reserver" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base">
              Réserver ma séance <ArrowRight size={18} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 text-base border border-border-light rounded-lg text-cream hover:border-gold/40 transition-colors"
            >
              Voir les services
            </a>
          </div>

          <p className="text-xs text-cream-subtle">
            Sans engagement · Réponse sous 24h · Séances en ligne
          </p>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div
            className="absolute w-96 h-96 rounded-full opacity-50 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #C9A227 0%, transparent 70%)' }}
          />

          <div className="relative w-72 sm:w-96 aspect-[3/4]">
            {!imgError ? (
              <img
                src="/images/yassine-hero.jpg"
                alt="Yassine El Arousy"
                className="w-full h-full object-cover object-top"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                  WebkitMaskComposite: 'source-in',
                  maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                  maskComposite: 'intersect',
                }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <User size={64} className="text-gold/40" />
                <p className="text-cream-subtle text-xs px-6 text-center">
                  Ajoute ta photo dans public/images/yassine-hero.jpg
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 mb-16">
        <div className="card grid grid-cols-3 divide-x divide-border py-6 sm:py-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-2">
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-gold mb-1">{s.value}</p>
              <p className="text-xs text-cream-muted uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FEATURES = [
  { icon: Target, title: 'Préparation ciblée', text: 'Un plan de préparation adapté à ton secteur et au poste visé, pas une méthode générique.' },
  { icon: TrendingUp, title: 'Méthode éprouvée', text: 'Une approche testée sur des dizaines de candidats, affinée séance après séance.' },
  { icon: Trophy, title: 'Résultats concrets', text: "L'objectif : que tu sortes de l'entretien avec confiance, et une offre en poche." },
];

export const LandingPage = () => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', appointmentType: 'ONLINE_COACHING',
    preferredPeriod: '', message: '', school: '', applicationType: 'STAGE_PFE',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus('loading');
    try {
      await submitBooking(form);
      setStatus('success');
      setForm({
        name: '', phone: '', email: '', appointmentType: 'ONLINE_COACHING',
        preferredPeriod: '', message: '', school: '', applicationType: 'STAGE_PFE',
      });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen text-cream">
      <Navbar />
      <Hero />

      {/* Why section */}
      <section id="pourquoi" className="bg-bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid sm:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">{title}</h3>
                <p className="text-cream-muted text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        className="relative py-20"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(14,14,14,0.92), rgba(14,14,14,0.75)), url('/images/master_my_interview_cover.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-10 items-center">
            <div className="sm:col-span-1 flex justify-center sm:justify-start">
              <div className="w-36 h-36 rounded-full bg-bg-surface border border-gold/30 flex items-center justify-center">
                <span className="text-gold font-serif text-4xl">Y</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gold text-xs font-medium tracking-wide uppercase mb-3">À propos</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-4">Yassine El Arousy</h2>
              <p className="text-cream-muted mb-5 leading-relaxed">
                Créateur LinkedIn Maroc, Top Voice en Conseil et Communication, consultant expert
                pour les entretiens d'embauche et les stages. Plusieurs candidats m'ont déjà fait
                confiance pour réussir leurs entretiens — à toi maintenant.
              </p>
              <div className="flex gap-5 text-sm text-cream-muted flex-wrap">
                <span className="flex items-center gap-1.5"><Award size={15} className="text-gold" /> Top Voice LinkedIn</span>
                <span className="flex items-center gap-1.5"><UsersIcon size={15} className="text-gold" /> 5,800+ abonnés</span>
                <span className="flex items-center gap-1.5"><Star size={15} className="text-gold" /> Méthode éprouvée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-gold text-xs font-medium tracking-wide uppercase mb-3 text-center">Ce que je propose</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-cream text-center mb-12">Mes services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(APPOINTMENT_TYPE_LABELS) as AppointmentType[]).map((key) => (
              <ServiceCard key={key} serviceKey={key} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="avis" className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-gold text-xs font-medium tracking-wide uppercase mb-3 text-center">Témoignages</p>
        <h2 className="font-serif text-2xl sm:text-3xl text-cream text-center mb-12">Ce qu'ils en disent</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="text-gold fill-current" />
                ))}
              </div>
              <p className="text-sm text-cream-muted mb-4 italic">{t.text}</p>
              <p className="text-sm text-cream font-medium">{t.name}</p>
              <p className="text-xs text-cream-subtle">{t.company}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking form */}
      <section id="reserver" className="bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <p className="text-gold text-xs font-medium tracking-wide uppercase mb-3 text-center">Prochaine étape</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-cream text-center mb-2">Réserve ta séance</h2>
          <p className="text-cream-muted text-sm text-center mb-10">
            Remplis ce formulaire, je te recontacte sous 24h pour confirmer ton créneau.
          </p>

          {status === 'success' ? (
            <div className="card p-8 text-center">
              <CheckCircle2 size={40} className="text-green mx-auto mb-4" />
              <h3 className="font-serif text-lg text-cream mb-2">Merci !</h3>
              <p className="text-cream-muted text-sm">
                Ta demande a bien été enregistrée. Je te recontacte très vite pour confirmer ton créneau.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div>
                <label className="label">Nom complet *</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Téléphone *</label>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">École / établissement</label>
                  <input
                    className="input"
                    placeholder="ex: ENCG Casablanca"
                    value={form.school}
                    onChange={(e) => handleChange('school', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Type de candidature</label>
                  <select
                    className="input"
                    value={form.applicationType}
                    onChange={(e) => handleChange('applicationType', e.target.value)}
                  >
                    <option value="STAGE_PFE">Stage PFE</option>
                    <option value="CDI">CDI</option>
                    <option value="STAGE_CLASSIQUE">Stage classique</option>
                    <option value="ENTRETIEN_ECOLE">Entretien d'école</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Service souhaité</label>
                <select
                  className="input"
                  value={form.appointmentType}
                  onChange={(e) => handleChange('appointmentType', e.target.value)}
                >
                  {Object.entries(APPOINTMENT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Période souhaitée</label>
                <input
                  className="input"
                  placeholder="ex: la semaine prochaine, en soirée"
                  value={form.preferredPeriod}
                  onChange={(e) => handleChange('preferredPeriod', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Message (optionnel)</label>
                <textarea
                  className="input"
                  rows={3}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
              </div>

              {status === 'error' && (
                <p className="text-error text-sm">Une erreur est survenue, réessaie dans un instant.</p>
              )}

              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                {status === 'loading' ? 'Envoi...' : 'Réserver ma séance'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-3 text-sm text-cream-muted">
          <a href="https://wa.me/212714383868" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold transition-colors">
            <MessageCircle size={15} /> WhatsApp
          </a>
          <span className="flex items-center gap-1.5">
            <Phone size={15} /> +212 7 14 38 38 68
          </span>
        </div>
        <p className="text-xs text-cream-subtle">
          Master My Interview · <Link to="/login" className="hover:text-gold transition-colors">Espace admin</Link>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;