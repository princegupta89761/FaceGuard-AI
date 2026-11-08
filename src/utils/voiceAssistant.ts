import { ActiveScreen } from '../types';

/**
 * Voice Assistant & Speech Recognition Controller
 * Supports voice commands and speech synthesis for accessibility and hands-free control.
 */

// Define SpeechRecognition interface for browsers
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: { results: Array<Array<{ transcript: string }>> }) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function speakFeedback(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis failures
  }
}

export function initializeVoiceAssistant(
  onNavigate: (screen: ActiveScreen) => void,
  onOpenEnroll: () => void,
  onToggleCamera: () => void,
  onCommandRecognized: (transcript: string) => void
): { start: () => void; stop: () => void; isSupported: boolean } {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const recognition = new SpeechRecognitionClass();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const results = event.results;
    if (results.length > 0) {
      const last = results[results.length - 1];
      const text = last[0].transcript.trim().toLowerCase();
      onCommandRecognized(text);

      if (text.includes('open dashboard') || text.includes('go to dashboard')) {
        speakFeedback('Opening Executive Dashboard');
        onNavigate('dashboard');
      } else if (text.includes('start camera') || text.includes('live recognition') || text.includes('open camera')) {
        speakFeedback('Navigating to live face recognition camera');
        onNavigate('live-recognition');
      } else if (text.includes('stop camera') || text.includes('camera off')) {
        speakFeedback('Camera stream paused');
        onToggleCamera();
      } else if (text.includes('register user') || text.includes('enroll face') || text.includes('new face')) {
        speakFeedback('Opening biometric face enrollment module');
        onOpenEnroll();
      } else if (text.includes('show attendance') || text.includes('attendance management')) {
        speakFeedback('Opening attendance management records');
        onNavigate('attendance');
      } else if (text.includes('visitor') || text.includes('show visitors')) {
        speakFeedback('Opening visitor management system');
        onNavigate('visitors');
      } else if (text.includes('security logs') || text.includes('security alert') || text.includes('security center')) {
        speakFeedback('Opening AI security alert center');
        onNavigate('security-center');
      } else if (text.includes('emotion') || text.includes('emotion analytics')) {
        speakFeedback('Opening facial emotion analytics');
        onNavigate('emotion-analytics');
      } else if (text.includes('timeline') || text.includes('recognition timeline')) {
        speakFeedback('Opening recognition timeline');
        onNavigate('timeline');
      } else if (text.includes('system settings') || text.includes('open settings')) {
        speakFeedback('Opening system settings');
        onNavigate('settings');
      }
    }
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch {
        // already started
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // ignored
      }
    },
    isSupported: true,
  };
}
