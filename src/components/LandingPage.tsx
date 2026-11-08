import React, { useState } from 'react';
import {
  Shield,
  Camera,
  CalendarCheck,
  Building,
  Users,
  Smile,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  BarChart3,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  Cpu,
  Check,
  Eye,
  Radio,
  Play,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroImage = '/src/assets/images/hero_colorful_ai_3d_1794142469873.jpg';

  const benefits = [
    {
      title: 'Touchless High-Speed Entry',
      description: 'Under 40ms facial verification allows employees and students to walk through turnstiles without stopping.',
      icon: Zap,
      metric: '< 40ms',
      metricLabel: 'Inference Latency',
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50/70 border-blue-200/80',
      textColor: 'text-blue-600',
    },
    {
      title: 'Anti-Spoofing & Liveness Shield',
      description: 'Ocular blink detection, Eye Aspect Ratio (EAR), and skin chrominance frequency defeat photo and screen attacks.',
      icon: ShieldAlert,
      metric: '99.8%',
      metricLabel: 'Spoof Interception',
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50/70 border-emerald-200/80',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Smart Attendance Automation',
      description: 'Instant attendance marking with 5-minute duplicate suppression cooldown and one-click Excel & CSV exports.',
      icon: CalendarCheck,
      metric: '100%',
      metricLabel: 'Zero Double Entries',
      gradient: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50/70 border-purple-200/80',
      textColor: 'text-purple-600',
    },
    {
      title: 'Affective Computing (Emotion AI)',
      description: '6-class facial sentiment tracking evaluates workplace morale, employee wellness, and customer reception.',
      icon: Smile,
      metric: '6 Classes',
      metricLabel: 'Real-Time Emotions',
      gradient: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/70 border-amber-200/80',
      textColor: 'text-amber-600',
    },
  ];

  const modules = [
    {
      title: 'Real-Time Face Recognition',
      desc: '128-dimensional Euclidean distance matching with multi-person tracking and bounding box HUD.',
      icon: Camera,
      tag: 'Computer Vision',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      title: 'Biometric Face Registration',
      desc: 'Capture portrait biometrics via webcam or photo upload to compute permanent vector templates.',
      icon: Users,
      tag: 'Enrollment',
      color: 'bg-sky-50 border-sky-200 text-sky-600 group-hover:bg-sky-600 group-hover:text-white',
      badgeColor: 'bg-sky-100 text-sky-700',
    },
    {
      title: 'Automated Attendance System',
      desc: 'Daily, weekly, and monthly tracking with arrival density heatmaps and duplicate cooldown protection.',
      icon: CalendarCheck,
      tag: 'Workforce',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Visitor Management & Badging',
      desc: 'Digital visitor check-in, purpose logging, host employee assignment, and overstay alerts.',
      icon: Building,
      tag: 'Guest Protocol',
      color: 'bg-amber-50 border-amber-200 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Affective Emotion Analytics',
      desc: 'Evaluates employee morale and satisfaction across departments with sentiment streams.',
      icon: Smile,
      tag: 'Affective AI',
      color: 'bg-purple-50 border-purple-200 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'AI Security Alert Center',
      desc: 'Dynamic threat gauge, unauthorized intrusion alerts, security guard dispatch, and email alerts.',
      icon: ShieldAlert,
      tag: 'Surveillance',
      color: 'bg-rose-50 border-rose-200 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      title: 'Recognition Event Timeline',
      desc: 'Chronological audit feed with high-resolution snapshots, filterable by identity and confidence.',
      icon: Clock,
      tag: 'Audit Trail',
      color: 'bg-teal-50 border-teal-200 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
      badgeColor: 'bg-teal-100 text-teal-700',
    },
    {
      title: 'Executive Analytics Console',
      desc: 'High-level biometric accuracy meters, campus gate throughput trends, and edge node health.',
      icon: BarChart3,
      tag: 'Intelligence',
      color: 'bg-blue-50 border-blue-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Python & SQLite Code Hub',
      desc: 'Production-ready Python OpenCV + face_recognition + SQLite scripts and Streamlit dashboard blueprints.',
      icon: Layers,
      tag: 'Architecture',
      color: 'bg-violet-50 border-violet-200 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
      badgeColor: 'bg-violet-100 text-violet-700',
    },
    {
      title: 'Hands-Free Voice Assistant',
      desc: 'Web Speech API integration for complete hands-free navigation and spoken audio verification cues.',
      icon: Sparkles,
      tag: 'Voice AI',
      color: 'bg-pink-50 border-pink-200 text-pink-600 group-hover:bg-pink-600 group-hover:text-white',
      badgeColor: 'bg-pink-100 text-pink-700',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Edge Optical Capture',
      desc: 'High-definition 1080p camera nodes stream live video frames at 30+ FPS into the browser canvas engine.',
      accent: 'from-blue-600 to-sky-500',
    },
    {
      step: '02',
      title: 'Anti-Spoofing & Liveness',
      desc: 'Eye Aspect Ratio (EAR) and micro-texture variance verify a live human is present before authentication.',
      accent: 'from-emerald-600 to-teal-500',
    },
    {
      step: '03',
      title: '128-D Vector Extraction',
      desc: 'Facial landmarks and spatial luminance grids generate a normalized 128-dimensional biometric descriptor.',
      accent: 'from-purple-600 to-pink-500',
    },
    {
      step: '04',
      title: 'Policy Execution & Logging',
      desc: 'Matches registered personnel within 0.38 distance, logs attendance, or snapshots unknown intruders.',
      accent: 'from-amber-600 to-orange-500',
    },
  ];

  const faqs = [
    {
      q: 'Does FaceGuard AI store raw facial photos in the cloud?',
      a: 'No. FaceGuard AI operates on mathematical 128-dimensional embedding vectors. Raw facial images are processed directly at the edge, ensuring strict GDPR and CCPA privacy compliance.',
    },
    {
      q: 'How does the anti-spoofing liveness filter prevent photo attacks?',
      a: 'The system computes real-time Eye Aspect Ratio (EAR) to detect natural blinking, along with micro-texture luminance variance to detect flat surfaces like phone screens and paper prints.',
    },
    {
      q: 'Can the system detect multiple people simultaneously?',
      a: 'Yes. FaceGuard AI processes up to 5 faces simultaneously in the live camera feed, drawing independent color-coded bounding boxes and verifying each person in parallel.',
    },
    {
      q: 'How does the duplicate attendance prevention work?',
      a: 'When an employee is verified, the system applies an automated 5-minute cooldown period. Repeated passes during this window are recognized without generating duplicate attendance logs.',
    },
    {
      q: 'Can we export reports for payroll and security audits?',
      a: 'Yes! All attendance logs, visitor records, and recognition history can be exported immediately to standard CSV or Excel-compatible formats with a single click.',
    },
  ];

  const testimonials = [
    {
      quote:
        'FaceGuard AI transformed our 3,200-student university campus. Turnstile queues dropped to zero and attendance tracking is completely frictionless.',
      author: 'Dr. Rebecca Thorne',
      role: 'Dean of Technology',
      org: 'Pacific Institute of Technology',
      rating: 5,
    },
    {
      quote:
        'The anti-spoofing liveness filter stopped simulated photo attacks in our security audit immediately. The fastest biometric edge system we have deployed.',
      author: 'Marcus Vance',
      role: 'Head of Physical Security',
      org: 'FinTech Cloud Infrastructure',
      rating: 5,
    },
    {
      quote:
        'Visitor badging combined with real-time host notifications gave our enterprise campus total visibility over who is in the building at any second.',
      author: 'Elena Gomez',
      role: 'Director of Workplace Operations',
      org: 'Nexus Biotech Global',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-700">
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 px-6 lg:px-12 py-4 flex items-center justify-between gap-8 transition-all">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                FaceGuard AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                PROTOTYPE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Intelligent Biometric Security Platform
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <button onClick={() => scrollToSection('benefits')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            Benefits
          </button>
          <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            Modules
          </button>
          <button onClick={() => scrollToSection('pipeline')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            How It Works
          </button>
          <button onClick={() => scrollToSection('security')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            Anti-Spoofing
          </button>
          <button onClick={() => scrollToSection('testimonials')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            Case Studies
          </button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            FAQ
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSignIn}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 active:scale-98 transition-all cursor-pointer shadow-lg shadow-indigo-500/25 whitespace-nowrap"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto overflow-hidden">
        {/* Soft pastel ambient background blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          {/* Top Pill Kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-xs font-semibold text-indigo-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Next-Generation AI Face Recognition &amp; Security Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Transform Physical Security With{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Real-Time Biometric Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            A complete enterprise suite for real-time webcam face detection, anti-spoofing liveness verification, automated smart attendance, visitor badging, and affective emotion analytics.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 shadow-sm transition-all cursor-pointer"
            >
              <span>Explore 10 Modules</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust stats strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-indigo-600 tabular-nums">99.8%</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Recognition Accuracy</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-emerald-600 tabular-nums">&lt; 40ms</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Vector Inference</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-purple-600 tabular-nums">128-D</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Biometric Embedding</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-pink-600 tabular-nums">100%</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Local Edge Privacy</div>
            </div>
          </div>
        </div>

        {/* Hero 3D Colorful Illustration Showcase */}
        <div className="mt-14 relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white p-3 group">
          <div className="relative rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={heroImage}
              alt="FaceGuard AI 3D Isometric Biometric Platform Station"
              className="w-full h-auto object-cover max-h-[580px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

            {/* Floating Top Floating Holographic Badges */}
            <div className="absolute top-6 left-6 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Biometric Stream · Node CAM-01</span>
            </div>

            <div className="absolute top-6 right-6 hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-bold text-indigo-700">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Affective Emotion AI Active</span>
            </div>

            {/* Bottom Floating Interactive Banner */}
            <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Live Computer Vision Engine Ready
                  </div>
                  <div className="text-xs text-slate-500">
                    Real-time webcam detection, EAR blink liveness filter, and instant attendance logging.
                  </div>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Launch Interactive Prototype</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT / PROBLEM & SOLUTION */}
      <section className="px-6 lg:px-12 py-20 border-t border-slate-200/80 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 font-mono">
              01. The Problem &amp; The Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Replace Slow Manual Check-Ins with Instant Biometric Recognition
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Traditional plastic badges, paper visitor logs, and fingerprint scanners create crowded queues, lost cards, and proxy buddy punching.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              FaceGuard AI extracts deep 128-dimensional facial embedding vectors in under 40 milliseconds. The moment employees, students, or visitors approach the optical zone, their credentials are verified, attendance is recorded, and entry is authorized without slowing down.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-black text-indigo-600">3,600+</div>
                <div className="text-xs font-medium text-slate-500 mt-1">Scans Per Hour Capacity</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-black text-emerald-600">0.001%</div>
                <div className="text-xs font-medium text-slate-500 mt-1">False Acceptance Rate</div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-pink-50/30 border border-slate-200/80 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span>Full-Spectrum Biometric Perimeter Defense</span>
            </h3>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 font-bold" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Non-Intrusive Walk-Through Recognition</div>
                  <div className="text-slate-500 text-xs mt-0.5">Tracks up to 5 faces simultaneously in crowded entrance turnstiles.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 font-bold" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Automated 5-Min Duplicate Cooldown</div>
                  <div className="text-slate-500 text-xs mt-0.5">Prevents double entries when employees linger near optical sensors.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 font-bold" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Unknown Intruder Snapshot Capture</div>
                  <div className="text-slate-500 text-xs mt-0.5">Auto-captures high-resolution crops of unverified faces for security dispatch.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY BENEFITS SECTION */}
      <section id="benefits" className="px-6 lg:px-12 py-20 border-t border-slate-200/80 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 font-mono">
            02. Measurable Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Engineered for High-Throughput Enterprises &amp; Campuses
          </h2>
          <p className="text-slate-600 text-base">
            Eliminate credentials fraud, proxy attendance, and manual registration bottlenecks with real-time biometric intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${b.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {b.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className={`text-2xl font-black tabular-nums ${b.textColor}`}>{b.metric}</div>
                  <div className="text-xs font-semibold text-slate-400 mt-0.5">{b.metricLabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURES PREVIEW SECTION (10 MODULES) */}
      <section id="features" className="px-6 lg:px-12 py-20 border-t border-slate-200/80 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 font-mono">
              03. Complete AI Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              10 Integrated Biometric Modules
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              From real-time webcam surveillance to digital visitor badging and affective sentiment analytics.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <span>Access All Modules</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                onClick={onGetStarted}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border transition-colors ${m.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                      {m.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                      {m.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center text-xs text-indigo-600 font-bold gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Module</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. HOW IT WORKS / PIPELINE */}
      <section id="pipeline" className="px-6 lg:px-12 py-20 border-t border-slate-200/80 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 font-mono">
            04. Vision Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            How FaceGuard AI Operates in Under 40ms
          </h2>
          <p className="text-slate-600 text-base">
            A 4-stage pipeline that guarantees real human liveness before running Euclidean feature comparison.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 relative space-y-4 shadow-xs"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.accent} text-white font-mono font-bold flex items-center justify-center text-base shadow-sm`}>
                {s.step}
              </div>
              <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SECURITY & LIVENESS DEEP DIVE */}
      <section id="security" className="px-6 lg:px-12 py-20 border-t border-slate-200/80 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white grid grid-cols-1 lg:grid-cols-3 gap-8 items-center shadow-xl">
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <ShieldAlert className="w-4 h-4" />
              <span>Anti-Spoofing &amp; Biometric Privacy Shield</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Military-Grade Biometric Spoof Mitigation
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Standard facial recognition can be tricked by holding up a phone screen or printed photo. FaceGuard AI evaluates micro-physiological indicators: Eye Aspect Ratio (EAR) blink frequency, head micro-rotation, and skin luminance gradients to instantly flag spoof attacks.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold pt-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                AES-256 Vector Encryption
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                Zero Cloud Photo Storage
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                GDPR &amp; ISO 27001 Aligned
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-mono space-y-3.5">
            <div className="flex items-center justify-between text-slate-300">
              <span>Liveness Engine:</span>
              <span className="text-emerald-400 font-bold">ARMED &amp; ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Eye Aspect Ratio (EAR):</span>
              <span className="text-white font-bold">0.28 (Live Human)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Moiré Pattern Interception:</span>
              <span className="text-emerald-400 font-bold">PASS (No Screen Found)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Intrusion Alert Dispatch:</span>
              <span className="text-sky-300 font-bold">SMTP Dispatch Armed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section id="testimonials" className="px-6 lg:px-12 py-20 border-t border-slate-200/80 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 font-mono">
            05. Proven in Production
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Trusted by Enterprise Security Chiefs &amp; Campus Directors
          </h2>
          <p className="text-slate-600 text-base">
            Real deployments delivering frictionless check-ins and verified perimeter control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed font-normal italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-900">{t.author}</div>
                <div className="text-xs text-indigo-600 font-semibold">{t.role}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t.org}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ SECTION ACCORDION */}
      <section id="faq" className="px-6 lg:px-12 py-20 border-t border-slate-200/80 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 font-mono">
            06. Clear Answers
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about our edge biometric computer vision engine.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. BOTTOM CALL TO ACTION */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Experience FaceGuard AI?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              Test live webcam face recognition, inspect anti-spoofing liveness, enroll your face template, and explore real-time attendance analytics.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-white text-indigo-700 hover:bg-slate-50 transition-all cursor-pointer shadow-lg shadow-black/10"
              >
                <span>Launch Working Prototype</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="border-t border-slate-200/80 px-6 lg:px-12 py-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-800 font-bold">FaceGuard AI Platform</span>
          <span>· v2.4 Enterprise Edition</span>
        </div>
        <div className="text-slate-500">
          Edge Biometric Computer Vision · 128-D Euclidean Face Vector Matching
        </div>
      </footer>
    </div>
  );
};
