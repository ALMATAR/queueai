export interface Clinic {
  id: string;
  name: string;
  currentNumber: number;
  status: 'active' | 'paused' | 'stopped';
  lastCallTime: string;
  screenId: string;
  password?: string;
}

export interface Doctor {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  specialty: string;
  clinicId: string;
  workingDays: string[];
  status: 'present' | 'absent' | 'leave';
  notes?: string;
  email?: string; // For auth
}

export interface Settings {
  centerName: string;
  scrollText: string;
  scrollSpeed: number;
  notificationDuration: number;
  voiceSpeed: number;
  audioPath: string; // URL or relative path
  videoPath: string; // URL or relative path
  alertMessage: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  nationalId: string;
  phone: string;
  clinicId: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface LeaveRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  type: string;
  startDate: string;
  endDate: string;
  replacement?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Complaint {
  id: string;
  type: 'complaint' | 'suggestion';
  text: string;
  contact?: string;
  createdAt: string;
}