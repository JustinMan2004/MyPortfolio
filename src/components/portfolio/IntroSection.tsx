import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Target,
  Sparkles,
  BookOpen,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  User,
  Heart,
  Edit3,
  Camera,
  Check,
  X,
  Smile,
  Lightbulb,
  Link2,
  FolderGit2,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { StudentProfile } from '../../portfolioTypes';

interface IntroSectionProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onNavigateToSprints: () => void;
  onNavigateToProjects: () => void;
  onNavigateToContact: () => void;
  onNavigateToEvidence?: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToSprints,
  onNavigateToProjects,
  onNavigateToContact,
  onNavigateToEvidence,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editWhoAmI, setEditWhoAmI] = useState(profile.personalStory?.whoAmI || '');
  const [editPassions, setEditPassions] = useState(profile.personalStory?.passionsAndJoy || '');
  const [editWhyMinor, setEditWhyMinor] = useState(profile.personalStory?.whyThisMinor || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(profile.personalStory?.photoUrl || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl || '');
  const [editName, setEditName] = useState(profile.name);

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setEditAvatarUrl(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setEditPhotoUrl(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      name: editName.trim() || profile.name,
      bio: editBio.trim() || profile.bio,
      avatarUrl: editAvatarUrl.trim() || profile.avatarUrl,
      personalStory: {
        whoAmI: editWhoAmI.trim() || profile.personalStory.whoAmI,
        passionsAndJoy: editPassions.trim() || profile.personalStory.passionsAndJoy,
        whyThisMinor: editWhyMinor.trim() || profile.personalStory.whyThisMinor,
        photoUrl: editPhotoUrl.trim() || profile.personalStory.photoUrl,
        funFacts: profile.personalStory?.funFacts || [],
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(profile.name);
    setEditBio(profile.bio);
    setEditWhoAmI(profile.personalStory?.whoAmI || '');
    setEditPassions(profile.personalStory?.passionsAndJoy || '');
    setEditWhyMinor(profile.personalStory?.whyThisMinor || '');
    setEditPhotoUrl(profile.personalStory?.photoUrl || '');
    setEditAvatarUrl(profile.avatarUrl || '');
    setIsEditing(false);
  };

  return (
    <section id="intro-section" className="space-y-8">
      {/* Hero Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#721414] via-[#8F1D1D] to-[#B82424] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-red-950/15 border border-red-900/30">
        {/* Subtle decorative background glow and mesh */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Avatar with image or initials */}
          <div className="relative shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-28 h-28 md:w-36 md:h-36 rounded-3xl object-cover shadow-xl border-4 border-white/25 ring-4 ring-black/10"
              />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-white to-[#FFF5F3] text-[#A92222] font-black text-4xl md:text-5xl flex items-center justify-center shadow-xl border-4 border-white/25 ring-4 ring-black/10">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border-2 border-[#721414] shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7F1E8] animate-pulse" />
              <span>Student HU</span>
            </div>
          </div>

          {/* Bio & Information */}
          <div className="flex-1 text-center md:text-left space-y-3.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold tracking-wide backdrop-blur-md border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{profile.minor}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/25 shadow-xs active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Bewerken sluiten' : 'Mijn profiel & verhaal aanpassen'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {profile.name}
            </h1>

            <p className="text-sm md:text-base text-white/90 font-normal max-w-2xl leading-relaxed">
              {profile.bio}
            </p>

            {/* Quick badges */}
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-white/85">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>{profile.program}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Studiejaar {profile.academicYear}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                id="hero-view-sprints-btn"
                type="button"
                onClick={onNavigateToSprints}
                className="cursor-pointer inline-flex items-center gap-2 bg-[#F7F1E8] text-[#941F1F] hover:bg-[#FFF3F0] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Layers className="w-4 h-4" />
                <span>Bekijk de 8 Sprints</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onNavigateToEvidence && (
                <button
                  type="button"
                  onClick={onNavigateToEvidence}
                  className="cursor-pointer inline-flex items-center gap-2 bg-[#FFF3F0] text-[#941F1F] hover:bg-[#F7F1E8] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Mijn Werk &amp; Bewijzen</span>
                </button>
              )}

              <button
                id="hero-view-projects-btn"
                type="button"
                onClick={onNavigateToProjects}
                className="cursor-pointer inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all border border-white/20 backdrop-blur-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>AI Projecten</span>
              </button>

              <button
                id="hero-contact-btn"
                type="button"
                onClick={onNavigateToContact}
                className="cursor-pointer inline-flex items-center gap-2 bg-transparent hover:bg-black/20 text-white/90 font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all border border-white/25"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Micro-metric strip */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-lg font-black text-white">8</span>
            <span className="text-[11px] text-white/80 font-medium">Sprints & Show & Tell</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-lg font-black text-white">5</span>
            <span className="text-[11px] text-white/80 font-medium">HU Leeruitkomsten</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-lg font-black text-white">Opdracht 1 & 2</span>
            <span className="text-[11px] text-white/80 font-medium">Centrale Bewijzen & Verhaal</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-lg font-black text-white">Vibe-coding</span>
            <span className="text-[11px] text-white/80 font-medium">AI Web Ecosystem</span>
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Card when user wants to customize their story */}
      {isEditing && (
        <div className="bg-[#F7F1E8] rounded-3xl p-6 md:p-8 border-2 border-[#A92222]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#EADFCB] pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#A92222]" />
                <span>Pas je eigen verhaal en foto&apos;s aan</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Opdrachtvereiste 2: Maak de site persoonlijk met foto’s en een verhaal over wie je bent en waar je blij van wordt!
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Jouw Naam</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">Profielfoto (Avatar)</label>
                <div className="flex items-center gap-3">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Avatar preview"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-[#EADFCB] shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 border border-[#EADFCB] shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0E6] text-[#A92222] font-bold text-xs border border-[#EADFCB] transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload vanaf computer</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Of voer een foto URL in (https://...)"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Korte Bio / Introductietekst</label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Wie ben ik? (Achtergrond en interesses)</label>
                <textarea
                  rows={3}
                  value={editWhoAmI}
                  onChange={(e) => setEditWhoAmI(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Waar word ik blij van? (Passies & Energie)</label>
                <textarea
                  rows={3}
                  value={editPassions}
                  onChange={(e) => setEditPassions(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Waarom deze minor Futureproof met AI?</label>
                <textarea
                  rows={3}
                  value={editWhyMinor}
                  onChange={(e) => setEditWhyMinor(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">Persoonlijke Sfeerfoto</label>
                <div className="flex items-center gap-3">
                  {editPhotoUrl ? (
                    <img
                      src={editPhotoUrl}
                      alt="Sfeerfoto preview"
                      referrerPolicy="no-referrer"
                      className="w-16 h-10 rounded-xl object-cover border border-[#EADFCB] shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 border border-[#EADFCB] shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={photoFileInputRef}
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0E6] text-[#A92222] font-bold text-xs border border-[#EADFCB] transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload vanaf computer</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Of voer een foto URL in (https://...)"
                  value={editPhotoUrl}
                  onChange={(e) => setEditPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                />
                <p className="text-[11px] text-stone-500">
                  Tip: Upload een eigen foto vanaf je apparaat of vul een URL in.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EADFCB]">
              <button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#A92222] hover:bg-[#8B1A1A] text-white rounded-xl shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Wijzigingen Opslaan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persoonlijk Verhaal & Wie ik ben (Opdracht 2) */}
      <div className="bg-[#F7F1E8] rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#941F1F] font-bold text-xs uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Persoonlijk Profiel • Opdracht 2</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1 tracking-tight">
              Mijn Verhaal &amp; Wat Mij Drijft
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-[#941F1F] text-xs font-bold self-start sm:self-auto border border-stone-200 transition-all hover:shadow-2xs active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Tekst &amp; Foto&apos;s aanpassen</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Photo */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="group relative overflow-hidden rounded-2xl border border-stone-200/90 shadow-md aspect-4/3 sm:aspect-16/11 bg-stone-100">
              <img
                src={profile.personalStory?.photoUrl || profile.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'}
                alt="Persoonlijke sfeerfoto"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                <span className="font-extrabold text-sm block drop-shadow-sm">{profile.name}</span>
                <span className="text-stone-200 text-[11px] font-medium">Minor Futureproof met AI • Portfolio</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 italic text-center">
              Eigen profiel- en sfeerfoto voor het assessmentportfolio
            </p>
          </div>

          {/* Story columns */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F6] border border-[#FFCDD2]/70 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-[#941F1F] flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#941F1F]/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#941F1F]" />
                </div>
                <span>Wie ik ben:</span>
              </span>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
                {profile.personalStory?.whoAmI}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF5] border border-amber-200/80 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <span>Waar ik blij van word:</span>
              </span>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
                {profile.personalStory?.passionsAndJoy}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#F4FBF7] border border-emerald-200/80 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <span>Waarom Futureproof met AI?</span>
              </span>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
                {profile.personalStory?.whyThisMinor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persoonlijke Leerdoelen Sectie */}
      <div className="bg-[#F7F1E8] rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#941F1F] font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Focus &amp; Ambitie</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1 tracking-tight">
              Mijn Leerdoelen voor de Minor
            </h2>
          </div>
          <span className="text-xs text-stone-700 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 font-semibold shadow-2xs">
            4 Geformuleerde doelen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.learningGoals.map((goal, idx) => (
            <div
              key={goal.id}
              className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-[#941F1F]/50 hover:bg-[#F7F1E8] hover:shadow-md transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#A92222]/10 text-[#A92222]">
                    Doel #{idx + 1} • {goal.category}
                  </span>
                  <span className="text-xs font-semibold text-stone-600 bg-[#F7F1E8] px-2.5 py-0.5 rounded-md border border-stone-200/90 shadow-2xs">
                    {goal.targetSprint}
                  </span>
                </div>
                <h3 className="font-bold text-base text-stone-900 leading-snug">
                  {goal.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {goal.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
