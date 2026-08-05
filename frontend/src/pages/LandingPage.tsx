import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Phone, Star, Award, Users as UsersIcon,
  CheckCircle2, ArrowRight, Target, TrendingUp, Trophy, User,
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

const HeroPhoto = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative flex justify-center lg:justify-end">
      <svg
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-40 pointer-events-none hidden sm:block"
        viewBox="0 0 400 400"
      >
        <circle
          cx="200" cy="200" r="180"
          fill="none" stroke="#C9A227" strokeWidth="1.5"
          strokeDasharray="280 850"
        />
      </svg>

      <div
        className="absolute w-96 h-96 rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C9A227 0%, transparent 70%)' }}
      />

      <div className="relative w-72 sm:w-96 aspect-[3/4]">
        {!imgError ? (
          <img
            src="/images/yassine-hero.jpg"
            alt="Yassine El Arousy"
            className="w-full h-full object-cover object-top"
            // style={{
            //   filter: 'grayscale(1) contrast(1.1)',
            //   WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            //   WebkitMaskComposite: 'source-in',
            //   maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            //   maskComposite: 'intersect',
            // }}
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
  );
};

const FEATURES = [
  { icon: Target, lines: ['Préparation ciblée', '& personnalisée'] },
  { icon: TrendingUp, lines: ['Méthode efficace', '& concrète'] },
  { icon: Trophy, lines: ['Résultats', 'garantis'] },
];

const AVATAR_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

export const LandingPage = () => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', appointmentType: 'ONLINE_COACHING',
    preferredPeriod: '', message: '',
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
      setForm({ name: '', phone: '', email: '', appointmentType: 'ONLINE_COACHING', preferredPeriod: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen text-cream">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A227 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <HeroPhoto />

          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream leading-tight mb-4">
              Je t'aide à réussir<br />ton <span className="text-gold">Entretien</span>
            </h1>
            <div className="w-16 h-1 bg-gold rounded-full mb-8" />

            <div className="flex flex-wrap gap-x-6 gap-y-4 mb-8">
              {FEATURES.map(({ icon: Icon, lines }, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && <div className="hidden sm:block w-px h-8 bg-border mr-3" />}
                  <Icon size={22} className="text-gold shrink-0" />
                  <p className="text-sm text-cream leading-tight">
                    {lines[0]}<br />{lines[1]}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-8">
              <div>
                <div className="flex gap-0.5 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-gold fill-current" />
                  ))}
                </div>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-2">
                    {AVATAR_COLORS.map((color, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full ${color} border-2 border-bg-primary flex items-center justify-center`}
                      >
                        <User size={11} className="text-white/90" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-cream-muted">+100 candidats accompagnés</span>
                </div>
              </div>

              <div className="hidden sm:block w-px h-10 bg-border" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center rotate-45 shrink-0">
                  <Star size={14} className="text-white fill-current -rotate-45" />
                </div>
                <p className="text-xs text-cream leading-tight">Top<br />Freelancer</p>
              </div>

              <div className="hidden sm:block w-px h-10 bg-border" />

              <div className="flex items-center gap-1.5 bg-white rounded-full pl-1.5 pr-3 py-1.5">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">in</span>
                </div>
                <span className="text-xs font-semibold text-bg-primary">Top Voice</span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-border" />

              <div className="w-14 h-14 rounded-full border border-gold/40 flex flex-col items-center justify-center shrink-0">
                <span className="text-gold font-serif font-bold text-sm leading-none">MMI</span>
                <span className="text-[5px] text-cream-subtle leading-tight mt-1 text-center px-1">
                  MASTER IN INTERVIEW
                </span>
              </div>
            </div>

            <a href="#reserver" className="inline-flex items-center gap-3 border border-gold/50 rounded-full pl-2 pr-6 py-2 hover:bg-gold/5 transition-all duration-200">
              <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center shrink-0">
                <ArrowRight size={16} className="text-bg-primary" />
              </span>
              <span className="text-cream font-medium">Réservez votre session maintenant</span>
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 border-b border-border">
        <div className="grid sm:grid-cols-3 gap-8 items-center">
          <div className="sm:col-span-1 flex justify-center">
            <div className="w-40 h-40 rounded-full bg-bg-surface border border-gold/30 flex items-center justify-center">
              <span className="text-gold font-serif text-5xl">Y</span>
            </div>
          </div>
          <div className="sm:col-span-2">
            <h2 className="font-serif text-2xl text-cream mb-3">Yassine El Arousy</h2>
            <p className="text-cream-muted mb-4">
              Créateur LinkedIn Maroc, Top Voice en Conseil et Communication, consultant expert
              pour les entretiens d'embauche et les stages. Plusieurs candidats m'ont déjà fait
              confiance pour réussir leurs entretiens — à toi maintenant.
            </p>
            <div className="flex gap-4 text-sm text-cream-muted flex-wrap">
              <span className="flex items-center gap-1.5"><Award size={15} className="text-gold" /> Top Voice LinkedIn</span>
              <span className="flex items-center gap-1.5"><UsersIcon size={15} className="text-gold" /> 5,800+ abonnés</span>
              <span className="flex items-center gap-1.5"><Star size={15} className="text-gold" /> Méthode éprouvée</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-border">
        <h2 className="font-serif text-2xl text-cream text-center mb-10">Mes services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(APPOINTMENT_TYPE_LABELS) as AppointmentType[]).map((key) => (
            <div key={key} className="card p-5 hover:border-gold/30 transition-all duration-200">
              <CheckCircle2 size={18} className="text-gold mb-3" />
              <h3 className="font-medium text-cream mb-1.5">{APPOINTMENT_TYPE_LABELS[key]}</h3>
              <p className="text-sm text-cream-muted">{SERVICE_DESCRIPTIONS[key]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-border">
        <h2 className="font-serif text-2xl text-cream text-center mb-10">Ce qu'ils en disent</h2>
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

      <section id="reserver" className="max-w-2xl mx-auto px-6 py-16 border-b border-border">
        <h2 className="font-serif text-2xl text-cream text-center mb-2">Réserve ta séance</h2>
        <p className="text-cream-muted text-sm text-center mb-8">
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
      </section>

      <footer className="py-8 px-6 text-center">
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