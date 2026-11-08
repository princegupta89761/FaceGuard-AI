import { AttendanceRecord, RecognitionLog } from '../types';

export function downloadCsvFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAttendanceToCsv(records: AttendanceRecord[]) {
  const headers = ['Record ID', 'Person Name', 'Employee ID', 'Department', 'Date', 'Time', 'Status', 'Confidence %', 'Camera Node'];
  const rows = records.map((r) => [
    `"${r.id}"`,
    `"${r.personName}"`,
    `"${r.employeeId}"`,
    `"${r.department}"`,
    `"${r.date}"`,
    `"${r.time}"`,
    `"${r.status}"`,
    `"${r.confidence}%"`,
    `"${r.cameraId}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsvFile(csvContent, `attendance_report_${dateStr}.csv`);
}

export function exportRecognitionLogsToCsv(logs: RecognitionLog[]) {
  const headers = ['Log ID', 'Person Name', 'Identity Classification', 'Confidence %', 'Date', 'Time', 'Camera Node', 'Action Logged'];
  const rows = logs.map((l) => [
    `"${l.id}"`,
    `"${l.personName}"`,
    `"${l.isUnknown ? 'Unknown / Flagged' : 'Verified Known'}"`,
    `"${l.confidence}%"`,
    `"${l.dateStr}"`,
    `"${l.timeStr}"`,
    `"${l.cameraId}"`,
    `"${l.actionTaken}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsvFile(csvContent, `face_recognition_logs_${dateStr}.csv`);
}
