import React, { useState } from 'react';
import {
  Mail,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../portfolioData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Minor Futureproof met AI - Vraag / Netwerk',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setValidationError('Vul alstublieft alle verplichte velden in (naam, e-mail en bericht).');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setValidationError('Voer een geldig e-mailadres in.');
      return;
    }

    // In a prototype client, acknowledge submission
    setIsSubmitted(true);
  };

  return (
    <section id="contact-section" className="space-y-6">
      <div className="border-b border-[#EADFCB] pb-4">
        <div className="flex items-center gap-2 text-[#A92222] font-bold text-xs uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Netwerk & Connectie</span>
        </div>
        <h2 className="text-2xl font-black text-stone-900 mt-1">
          Contactgegevens & Professionele Profielen
        </h2>
        <p className="text-xs text-stone-600 mt-0.5">
          Kom in contact voor vragen over mijn portfolio, samenwerkingen of afstudeermogelijkheden.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Links & Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] shadow-xs space-y-5">
            <h3 className="font-bold text-base text-stone-900">
              Directe Contactkanalen
            </h3>

            <div className="space-y-3">
              {/* E-mail */}
              <a
                href={`mailto:${STUDENT_PROFILE.email}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#FFF3F0] border border-[#EADFCB] hover:border-[#FFCDD2] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F7F1E8] text-[#A92222] flex items-center justify-center border border-[#EADFCB] group-hover:border-[#FFCDD2]">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    E-mailadres
                  </span>
                  <span className="text-xs font-semibold text-stone-900 truncate block">
                    {STUDENT_PROFILE.email}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#A92222]" />
              </a>

              {/* GitHub */}
              <a
                href={STUDENT_PROFILE.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 border border-[#EADFCB] hover:border-stone-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F7F1E8] text-stone-900 flex items-center justify-center border border-[#EADFCB]">
                  <Github className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    GitHub Code Repository
                  </span>
                  <span className="text-xs font-semibold text-stone-900 truncate block">
                    github.com
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
              </a>

              {/* LinkedIn */}
              <a
                href={STUDENT_PROFILE.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-blue-50/50 border border-[#EADFCB] hover:border-blue-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F7F1E8] text-blue-700 flex items-center justify-center border border-[#EADFCB]">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    LinkedIn Netwerk
                  </span>
                  <span className="text-xs font-semibold text-stone-900 truncate block">
                    LinkedIn Profiel
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700" />
              </a>
            </div>

            <div className="pt-2 border-t border-[#EADFCB]/80 flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-4 h-4 text-stone-400" />
              <span>Locatie: {STUDENT_PROFILE.location} • Actief inzetbaar</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900">
              Stuur een Direct Bericht
            </h3>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">
                  Bedankt voor je bericht!
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Je bericht is in goede orde ontvangen. Ik neem zo snel mogelijk contact met je op via {formData.email}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      subject: 'Minor Futureproof met AI - Vraag / Netwerk',
                      message: '',
                    });
                  }}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Nog een bericht sturen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {validationError && (
                  <div className="p-3 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl text-[#C62828] text-xs">
                    {validationError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-semibold text-stone-700 block"
                    >
                      Uw Naam *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="bijv. Jan Jansen"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-semibold text-stone-700 block"
                    >
                      E-mailadres *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="naam@organisatie.nl"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="contact-subject"
                    className="text-xs font-semibold text-stone-700 block"
                  >
                    Onderwerp
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-semibold text-stone-700 block"
                  >
                    Bericht *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Typ hier uw vraag, feedback of uitnodiging..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#A92222] hover:bg-[#8B1A1A] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Verstuur Bericht</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
