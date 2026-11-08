import React, { useState } from 'react';
import {
  Camera,
  Users,
  CalendarCheck,
  Smile,
  Building,
  ShieldAlert,
  BarChart3,
  Clock,
  Mail,
  Mic,
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle2,
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  Layers,
  Activity,
  Lock,
} from 'lucide-react';
import { ActiveScreen, AuthUser } from '../types';

interface FeaturesPageProps {
  user: AuthUser;
  onContinueToDashboard: () => void;
  onExploreModule: (module: ActiveScreen) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  user,
  onContinueToDashboard,
  onExploreModule,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const onboardingSteps = [
    {
      step: 1,
      title: 'Welcome to FaceGuard AI',
      subtitle: 'Next-Generation Physical Identity Platform',
      icon: Shield,
      accent: 'from-indigo-600 to-blue-500',
      description:
        'FaceGuard AI is an industry-grade computer vision system engineered for enterprise campuses, corporate offices, and university turnstiles. It combines 128-dimensional Euclidean biometric matching with anti-spoofing defense.',
      points: [
        'Real-time webcam inference at 30+ FPS directly in the browser',
        'Private local processing with zero raw cloud image transmission',
        'Sub-40 millisecond vector identification latency',
      ],
      quickAction: 'Continue Tour',
    },
    {
      step: 2,
      title: 'Real-Time Face Recognition HUD',
      subtitle: '128-D Euclidean Biometric Vector Matching',
      icon: Camera,
      accent: 'from-sky-500 to-indigo-600',
      description:
        'The optical engine extracts normalized face embeddings and measures the Euclidean distance against registered staff. If the vector distance is below 0.38, identity is immediately confirmed with high confidence.',
      points: [
        'Simultaneous multi-face detection for busy doorways & turnstiles',
        'Dynamic bounding boxes with name, role, and confidence score',
        'Instant fallback to Unknown Person protocol for unregistered visitors',
      ],
      quickAction: 'Explore Attendance',
    },
    {
      step: 3,
      title: 'Smart Attendance Automation',
      subtitle: 'Duplicate Suppression & Automated Logging',
      icon: CalendarCheck,
      accent: 'from-emerald-600 to-teal-500',
      description:
        'Say goodbye to proxy punch-ins and buddy attendance. The system marks arrival the split-second a face is verified and applies an automated 5-minute cooldown to stop duplicate logs.',
      points: [
        'Automated daily, weekly, and monthly attendance archives',
        'Instant one-click exports to standard CSV & Excel formats',
        'Arrival density curves and punctuality analytics',
      ],
      quickAction: 'Explore Security',
    },
    {
      step: 4,
      title: 'AI Security Sentinel & Anti-Spoofing',
      subtitle: 'Eye Aspect Ratio (EAR) & Moiré Pattern Interception',
      icon: ShieldAlert,
      accent: 'from-rose-500 to-pink-600',
      description:
        'Printed photographs and high-res smartphone screen playbacks are instantly intercepted by micro-physiological blink analysis (EAR) and surface frequency analysis.',
      points: [
        'Ocular blink detection flags stationary printed photo spoofs',
        'High-resolution snapshot audit for all unrecognized faces',
        'Automated security guard dispatch and email incident alerts',
      ],
      quickAction: 'Explore Analytics',
    },
    {
      step: 5,
      title: 'Executive Analytics & Affective AI',
      subtitle: 'Campus Morale, Visitor Protocol & Telemetry',
      icon: BarChart3,
      accent: 'from-purple-600 to-indigo-600',
      description:
        'Monitor campus throughput, camera node health, and department morale in real-time. Affective computing evaluates 6 sentiment classes (Happy, Neutral, Surprise, Sad, Angry, Fear).',
      points: [
        'Comprehensive visitor check-in, purpose badging, and host notifications',
        'Workplace morale index aggregated across departments',
        'Integrated Hands-Free Voice Assistant with Web Speech API',
      ],
      quickAction: 'Go to Dashboard',
    },
  ];

  const featureList = [
    {
      id: 'live-recognition' as ActiveScreen,
      title: 'Real-Time Face Recognition & HUD',
      desc: 'Sub-40ms facial detection and 128-D Euclidean vector matching on live webcam feeds with multi-person tracking and bounding box HUD.',
      benefits: 'Walk-through turnstile verification, multi-face crowd detection, sub-0.38 distance margin.',
      icon: Camera,
      tag: 'Vision Core',
      cardStyle: 'bg-indigo-50/50 border-indigo-200/80 hover:border-indigo-400',
      iconStyle: 'bg-indigo-600 text-white',
      badgeStyle: 'bg-indigo-100 text-indigo-700',
      btnStyle: 'bg-indigo-600 text-white hover:bg-indigo-700',
    },
    {
      id: 'registered-users' as ActiveScreen,
      title: 'Biometric Face Registration System',
      desc: 'Dedicated enrollment module where employees, students, or staff register their face via live webcam capture or photo upload.',
      benefits: 'Computes normalized 128-D floating point embedding vectors for instant identification.',
      icon: Users,
      tag: 'Enrollment',
      cardStyle: 'bg-blue-50/50 border-blue-200/80 hover:border-blue-400',
      iconStyle: 'bg-blue-600 text-white',
      badgeStyle: 'bg-blue-100 text-blue-700',
      btnStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      id: 'attendance' as ActiveScreen,
      title: 'Smart Attendance Automation',
      desc: 'Zero-touch biometric check-ins with 5-minute duplicate suppression cooldown, daily/weekly/monthly tracking, and CSV & Excel exports.',
      benefits: 'Eliminates proxy attendance, generates arrival density heatmaps, 100% automated logging.',
      icon: CalendarCheck,
      tag: 'Workforce',
      cardStyle: 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-400',
      iconStyle: 'bg-emerald-600 text-white',
      badgeStyle: 'bg-emerald-100 text-emerald-700',
      btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700',
    },
    {
      id: 'emotion-analytics' as ActiveScreen,
      title: 'Affective Emotion & Morale AI',
      desc: '6-class facial sentiment classifier analyzing mouth curvature, smile ratio, and brow furrow (Happy, Neutral, Surprise, Sad, Angry, Fear).',
      benefits: 'Workplace morale index, department wellness comparison, real-time sentiment stream.',
      icon: Smile,
      tag: 'Affective AI',
      cardStyle: 'bg-purple-50/50 border-purple-200/80 hover:border-purple-400',
      iconStyle: 'bg-purple-600 text-white',
      badgeStyle: 'bg-purple-100 text-purple-700',
      btnStyle: 'bg-purple-600 text-white hover:bg-purple-700',
    },
    {
      id: 'visitors' as ActiveScreen,
      title: 'Visitor Management & Digital Badging',
      desc: 'Guest registration protocol with photo capture, purpose logging, host employee assignment, digital badge ID, and overstay alerts.',
      benefits: 'Total campus visitor visibility, auto-notifies host employee, digital badge issuance.',
      icon: Building,
      tag: 'Visitor Protocol',
      cardStyle: 'bg-amber-50/50 border-amber-200/80 hover:border-amber-400',
      iconStyle: 'bg-amber-600 text-white',
      badgeStyle: 'bg-amber-100 text-amber-700',
      btnStyle: 'bg-amber-600 text-white hover:bg-amber-700',
    },
    {
      id: 'security-center' as ActiveScreen,
      title: 'AI Security Sentinel & Alert Center',
      desc: 'Threat level triage (Normal / Elevated / Critical), spoof attack interception, security guard dispatch, and blacklist monitoring.',
      benefits: 'Neutralizes phone screen playback attacks, auto-snapshots unauthorized intruders.',
      icon: ShieldAlert,
      tag: 'Defense',
      cardStyle: 'bg-rose-50/50 border-rose-200/80 hover:border-rose-400',
      iconStyle: 'bg-rose-600 text-white',
      badgeStyle: 'bg-rose-100 text-rose-700',
      btnStyle: 'bg-rose-600 text-white hover:bg-rose-700',
    },
    {
      id: 'dashboard' as ActiveScreen,
      title: 'Executive Analytics Dashboard',
      desc: 'Live telemetry cards, edge camera node health, scan volume histograms, and high-level biometric accuracy meters.',
      benefits: 'Single pane of glass across all campus camera nodes with 30 FPS telemetry.',
      icon: BarChart3,
      tag: 'Intelligence',
      cardStyle: 'bg-sky-50/50 border-sky-200/80 hover:border-sky-400',
      iconStyle: 'bg-sky-600 text-white',
      badgeStyle: 'bg-sky-100 text-sky-700',
      btnStyle: 'bg-sky-600 text-white hover:bg-sky-700',
    },
    {
      id: 'timeline' as ActiveScreen,
      title: 'Recognition Event Timeline',
      desc: 'Chronological audit trail tracking every biometric scan with high-res cropped snapshot evidence, timestamps, and emotion badges.',
      benefits: 'Searchable, filterable by identity classification, and exportable for security audits.',
      icon: Clock,
      tag: 'Audit Trail',
      cardStyle: 'bg-teal-50/50 border-teal-200/80 hover:border-teal-400',
      iconStyle: 'bg-teal-600 text-white',
      badgeStyle: 'bg-teal-100 text-teal-700',
      btnStyle: 'bg-teal-600 text-white hover:bg-teal-700',
    },
    {
      id: 'python-hub' as ActiveScreen,
      title: 'Python OpenCV & SQLite Architecture',
      desc: 'Complete reference code snippets for standalone Python deployments, OpenCV Haar & deep models, SQLite schemas, and Streamlit dashboards.',
      benefits: 'Exportable blueprints ready for Linux edge hardware & Raspberry Pi turnstiles.',
      icon: Layers,
      tag: 'Architecture',
      cardStyle: 'bg-violet-50/50 border-violet-200/80 hover:border-violet-400',
      iconStyle: 'bg-violet-600 text-white',
      badgeStyle: 'bg-violet-100 text-violet-700',
      btnStyle: 'bg-violet-600 text-white hover:bg-violet-700',
    },
    {
      id: 'live-recognition' as ActiveScreen,
      title: 'Hands-Free AI Voice Assistant',
      desc: 'Web Speech API integration supporting voice directives ("Start Camera", "Register User", "Show Attendance") with spoken feedback.',
      benefits: 'Hands-free command and control in security kiosks and gate stations.',
      icon: Mic,
      tag: 'Voice AI',
      cardStyle: 'bg-pink-50/50 border-pink-200/80 hover:border-pink-400',
      iconStyle: 'bg-pink-600 text-white',
      badgeStyle: 'bg-pink-100 text-pink-700',
      btnStyle: 'bg-pink-600 text-white hover:bg-pink-700',
    },
  ];

  const activeOnboarding = onboardingSteps[currentStep - 1];
  const StepIcon = activeOnboarding.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-700 pb-28">
      {/* Top Welcome Bar */}
      <header className="px-6 lg:px-12 py-4 bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-slate-900">FaceGuard AI Hub</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Session
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Welcome, <strong className="text-slate-800">{user.name}</strong> ({user.role})
            </p>
          </div>
        </div>

        <button
          onClick={onContinueToDashboard}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Continue to Operational Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 space-y-10">
        {/* ============================================================== */}
        {/* INTERACTIVE 5-STEP ONBOARDING EXPERIENCE */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Guided Tour</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                System Onboarding &amp; Architectural Briefing
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Step through the 5 core capabilities before launching the live surveillance console.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span>Step</span>
              <span className="font-mono text-indigo-600 font-black text-base">{currentStep}</span>
              <span>of</span>
              <span className="font-mono text-slate-700 font-bold">5</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {onboardingSteps.map((step) => {
              const isActive = step.step === currentStep;
              const isPast = step.step < currentStep;
              return (
                <button
                  key={step.step}
                  onClick={() => setCurrentStep(step.step)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-sm'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-white border-slate-100 hover:border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">0{step.step}</span>
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    ) : null}
                  </div>
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {step.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Content Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeOnboarding.accent} flex items-center justify-center text-white shadow-md`}>
                  <StepIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{activeOnboarding.title}</h3>
                  <div className="text-xs font-semibold text-indigo-600">{activeOnboarding.subtitle}</div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {activeOnboarding.description}
              </p>

              <div className="space-y-2 pt-2">
                {activeOnboarding.points.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step Navigation
              </div>

              <div className="w-full space-y-2">
                {currentStep < 5 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Next: Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onContinueToDashboard}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Launch Dashboard Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Step</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 10 MODULES SHOWCASE GRID */}
        {/* ============================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                All 10 System Modules
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any module card below to launch and test its individual capabilities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureList.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 shadow-xs ${feature.cardStyle}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl shadow-sm ${feature.iconStyle}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${feature.badgeStyle}`}>
                        {feature.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                        {feature.desc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-slate-200/60">
                    <div className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium leading-relaxed">{feature.benefits}</span>
                    </div>

                    <button
                      onClick={() => onExploreModule(feature.id)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${feature.btnStyle}`}
                    >
                      <span>Launch This Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Floating Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3.5 px-6 lg:px-12 flex items-center justify-between shadow-xl">
        <div className="text-xs text-slate-600 hidden sm:block font-medium">
          Logged in as <strong className="text-slate-900">{user.name}</strong> · All 10 biometric modules ready
        </div>

        <button
          onClick={onContinueToDashboard}
          className="ml-auto sm:ml-0 flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer"
        >
          <span>Continue to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
