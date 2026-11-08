import React, { useState, useEffect, useRef } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { FeaturesPage } from './components/FeaturesPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NotificationPanel } from './components/NotificationPanel';
import { DashboardView } from './components/DashboardView';
import { LiveRecognitionView } from './components/LiveRecognitionView';
import { AttendanceView } from './components/AttendanceView';
import { HistoryView } from './components/HistoryView';
import { RegisteredUsersView } from './components/RegisteredUsersView';
import { VisitorManagementView } from './components/VisitorManagementView';
import { TimelineView } from './components/TimelineView';
import { EmotionAnalyticsView } from './components/EmotionAnalyticsView';
import { SecurityAlertCenterView } from './components/SecurityAlertCenterView';
import { SettingsView } from './components/SettingsView';
import { PythonArchitectureView } from './components/PythonArchitectureView';
import { EnrollModal } from './components/EnrollModal';

import {
  ActiveScreen,
  AppStage,
  AttendanceRecord,
  AuthUser,
  EmailIncident,
  RecognitionLog,
  RoleType,
  SecurityAlert,
  SystemSettings,
  User,
  VisitorRecord,
} from './types';
import {
  DEFAULT_SETTINGS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_EMAIL_INCIDENTS,
  INITIAL_RECOGNITION_LOGS,
  INITIAL_REGISTERED_USERS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_VISITORS,
} from './data/mockData';
import { exportAttendanceToCsv, exportRecognitionLogsToCsv } from './utils/exportCsv';
import { initializeVoiceAssistant } from './utils/voiceAssistant';

export default function App() {
  // 1. Mandatory 5-Stage Routing Flow: Landing -> Login -> Features -> Dashboard -> Modules
  const [appStage, setAppStage] = useState<AppStage>('landing');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Active module screen inside stage 4
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [activeRole, setActiveRole] = useState<RoleType>('Security Administrator');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Biometric & Operational State
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('faceguard_users');
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_USERS;
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('faceguard_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });
  const [recognitionLogs, setRecognitionLogs] = useState<RecognitionLog[]>(() => {
    const saved = localStorage.getItem('faceguard_logs');
    return saved ? JSON.parse(saved) : INITIAL_RECOGNITION_LOGS;
  });
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => {
    const saved = localStorage.getItem('faceguard_alerts');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_ALERTS;
  });
  const [visitors, setVisitors] = useState<VisitorRecord[]>(() => {
    const saved = localStorage.getItem('faceguard_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });
  const [emailIncidents, setEmailIncidents] = useState<EmailIncident[]>(() => {
    const saved = localStorage.getItem('faceguard_incidents');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_INCIDENTS;
  });
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('faceguard_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [fps, setFps] = useState<number>(30);
  const [isEnrollOpen, setIsEnrollOpen] = useState<boolean>(false);
  const [enrollInitialSnapshot, setEnrollInitialSnapshot] = useState<string | undefined>(undefined);

  // Voice Assistant
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeVoiceCommand, setActiveVoiceCommand] = useState<string | null>(null);
  const voiceControllerRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // LocalStorage persistence
  useEffect(() => {
    localStorage.setItem('faceguard_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('faceguard_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('faceguard_logs', JSON.stringify(recognitionLogs));
  }, [recognitionLogs]);

  useEffect(() => {
    localStorage.setItem('faceguard_alerts', JSON.stringify(securityAlerts));
  }, [securityAlerts]);

  useEffect(() => {
    localStorage.setItem('faceguard_visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('faceguard_incidents', JSON.stringify(emailIncidents));
  }, [emailIncidents]);

  useEffect(() => {
    localStorage.setItem('faceguard_settings', JSON.stringify(settings));
  }, [settings]);

  // Voice Assistant setup
  useEffect(() => {
    const assistant = initializeVoiceAssistant(
      (screen) => {
        setAppStage('app');
        setActiveScreen(screen);
      },
      () => {
        setEnrollInitialSnapshot(undefined);
        setIsEnrollOpen(true);
      },
      () => {
        setSettings((prev) => ({ ...prev, isSimulated: !prev.isSimulated }));
      },
      (command) => {
        setActiveVoiceCommand(command);
        setTimeout(() => setActiveVoiceCommand(null), 3000);
      }
    );
    voiceControllerRef.current = assistant;
  }, []);

  const handleToggleVoice = () => {
    if (!voiceControllerRef.current) return;
    if (isListening) {
      voiceControllerRef.current.stop();
      setIsListening(false);
    } else {
      voiceControllerRef.current.start();
      setIsListening(true);
    }
  };

  // Auth & Journey Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    // STAGE 2 -> STAGE 3: Open Features Page (NOT dashboard!)
    setAppStage('features');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    // After logout: redirect to Landing Page!
    setAppStage('landing');
  };

  // Operational Event Handlers
  const handleRecordAttendance = (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
      timestamp: Date.now(),
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
  };

  const handleAddRecognitionLog = (log: Omit<RecognitionLog, 'id' | 'timestamp'>) => {
    const newLog: RecognitionLog = {
      ...log,
      id: `rec-${Date.now()}`,
      timestamp: Date.now(),
    };
    setRecognitionLogs((prev) => [newLog, ...prev]);
  };

  const handleAddSecurityAlert = (alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => {
    const newAlert: SecurityAlert = {
      ...alert,
      id: `alt-${Date.now()}`,
      timestamp: Date.now(),
    };
    setSecurityAlerts((prev) => [newAlert, ...prev]);
  };

  const handleResolveAlert = (alertId: string) => {
    setSecurityAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, resolved: true, resolvedBy: activeRole } : a
      )
    );
  };

  const handleSendEmailAlert = (incident: EmailIncident) => {
    setEmailIncidents((prev) => [incident, ...prev]);
  };

  const handleCheckInVisitor = (visitor: VisitorRecord) => {
    setVisitors((prev) => [visitor, ...prev]);
  };

  const handleCheckOutVisitor = (visitorId: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visitorId
          ? {
              ...v,
              status: 'Checked Out',
              exitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : v
      )
    );
  };

  const handleEnrollUser = (newUser: User) => {
    setRegisteredUsers((prev) => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleQuickEnrollUnknown = (snapshotUrl: string) => {
    setEnrollInitialSnapshot(snapshotUrl);
    setIsEnrollOpen(true);
  };

  const handleResetDemoData = () => {
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setRecognitionLogs(INITIAL_RECOGNITION_LOGS);
    setSecurityAlerts(INITIAL_SECURITY_ALERTS);
    setVisitors(INITIAL_VISITORS);
    setEmailIncidents(INITIAL_EMAIL_INCIDENTS);
    setSettings(DEFAULT_SETTINGS);
    localStorage.clear();
  };

  // Computations
  const today = new Date().toISOString().split('T')[0];
  const todayAttendanceCount = attendanceRecords.filter((r) => r.date === today).length;
  const unknownAlertCount = securityAlerts.filter((a) => !a.resolved).length;
  const activeVisitorsCount = visitors.filter((v) => v.status === 'Checked In').length;

  // ==========================================
  // STAGE 1: LANDING PAGE (DEFAULT INITIAL)
  // ==========================================
  if (appStage === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAppStage('login')}
        onSignIn={() => setAppStage('login')}
      />
    );
  }

  // ==========================================
  // STAGE 2: LOGIN PAGE (AUTHENTICATION)
  // ==========================================
  if (appStage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setAppStage('landing')}
      />
    );
  }

  // Protected Route Guard: User cannot access features or dashboard without logging in
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setAppStage('landing')}
      />
    );
  }

  // ==========================================
  // STAGE 3: FEATURES / CAPABILITIES PAGE
  // ==========================================
  if (appStage === 'features') {
    return (
      <FeaturesPage
        user={currentUser}
        onContinueToDashboard={() => {
          setAppStage('app');
          setActiveScreen('dashboard');
        }}
        onExploreModule={(module) => {
          setAppStage('app');
          setActiveScreen(module);
        }}
      />
    );
  }

  // ==========================================
  // STAGE 4 & 5: DASHBOARD & APPLICATION MODULES
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-700">
      {/* Top Navbar */}
      <Header
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        settings={settings}
        onUpdateSettings={(s) => setSettings((prev) => ({ ...prev, ...s }))}
        onOpenEnroll={() => {
          setEnrollInitialSnapshot(undefined);
          setIsEnrollOpen(true);
        }}
        fps={fps}
        cameraActive={true}
        isListening={isListening}
        onToggleVoice={handleToggleVoice}
        activeVoiceCommand={activeVoiceCommand}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        onLogout={handleLogout}
        onOpenFeatures={() => setAppStage('features')}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
        unreadAlertCount={unknownAlertCount}
        userName={currentUser.name}
      />

      {/* Main Layout Area: Left Sidebar + Center Viewport + Right Notification Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Left */}
        <Sidebar
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          registeredCount={registeredUsers.length}
          todayAttendanceCount={todayAttendanceCount}
          unknownAlertCount={unknownAlertCount}
          activeVisitorsCount={activeVisitorsCount}
        />

        {/* Main Content Center */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {activeScreen === 'dashboard' && (
            <DashboardView
              registeredUsers={registeredUsers}
              attendanceRecords={attendanceRecords}
              recognitionLogs={recognitionLogs}
              securityAlerts={securityAlerts}
              onNavigateToLive={() => setActiveScreen('live-recognition')}
              onNavigateToAttendance={() => setActiveScreen('attendance')}
              onNavigateToHistory={() => setActiveScreen('history')}
              onOpenEnroll={() => {
                setEnrollInitialSnapshot(undefined);
                setIsEnrollOpen(true);
              }}
              onExportAttendance={() => exportAttendanceToCsv(attendanceRecords)}
            />
          )}

          {activeScreen === 'live-recognition' && (
            <LiveRecognitionView
              registeredUsers={registeredUsers}
              settings={settings}
              onUpdateSettings={(s) => setSettings((prev) => ({ ...prev, ...s }))}
              onRecordAttendance={handleRecordAttendance}
              onAddRecognitionLog={handleAddRecognitionLog}
              onAddSecurityAlert={handleAddSecurityAlert}
              onOpenEnroll={() => {
                setEnrollInitialSnapshot(undefined);
                setIsEnrollOpen(true);
              }}
              onQuickEnrollUnknown={handleQuickEnrollUnknown}
              fps={fps}
              setFps={setFps}
            />
          )}

          {activeScreen === 'attendance' && (
            <AttendanceView
              records={attendanceRecords}
              onExportCsv={() => exportAttendanceToCsv(attendanceRecords)}
            />
          )}

          {activeScreen === 'registered-users' && (
            <RegisteredUsersView
              users={registeredUsers}
              onOpenEnroll={() => {
                setEnrollInitialSnapshot(undefined);
                setIsEnrollOpen(true);
              }}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeScreen === 'visitors' && (
            <VisitorManagementView
              visitors={visitors}
              onCheckInVisitor={handleCheckInVisitor}
              onCheckOutVisitor={handleCheckOutVisitor}
            />
          )}

          {activeScreen === 'timeline' && <TimelineView logs={recognitionLogs} />}

          {activeScreen === 'emotion-analytics' && <EmotionAnalyticsView logs={recognitionLogs} />}

          {activeScreen === 'security-center' && (
            <SecurityAlertCenterView
              alerts={securityAlerts}
              emailIncidents={emailIncidents}
              onResolveAlert={handleResolveAlert}
              onSendEmailAlert={handleSendEmailAlert}
              adminEmail={settings.alertEmail}
            />
          )}

          {activeScreen === 'history' && (
            <HistoryView
              logs={recognitionLogs}
              onExportCsv={() => exportRecognitionLogsToCsv(recognitionLogs)}
              onQuickEnrollUnknown={handleQuickEnrollUnknown}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(s) => setSettings((prev) => ({ ...prev, ...s }))}
              onResetDemoData={handleResetDemoData}
            />
          )}

          {activeScreen === 'python-hub' && <PythonArchitectureView />}
        </main>

        {/* Notification Panel Right */}
        <NotificationPanel
          alerts={securityAlerts}
          visitors={visitors}
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onNavigateToSecurity={() => {
            setActiveScreen('security-center');
            setIsNotificationsOpen(false);
          }}
          onNavigateToVisitors={() => {
            setActiveScreen('visitors');
            setIsNotificationsOpen(false);
          }}
        />
      </div>

      {/* Face Biometric Enrollment Modal */}
      <EnrollModal
        isOpen={isEnrollOpen}
        onClose={() => {
          setIsEnrollOpen(false);
          setEnrollInitialSnapshot(undefined);
        }}
        onEnrollUser={handleEnrollUser}
        initialSnapshotUrl={enrollInitialSnapshot}
      />
    </div>
  );
}
