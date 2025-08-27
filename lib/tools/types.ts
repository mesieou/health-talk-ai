// Shared types for all tools
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface BaseParams {
  patient_name?: string;
  phone?: string;
  date?: string;
  time?: string;
}

// Practice Information Types
export interface PracticeInfoParams {
  info_type?: 'hours' | 'pricing' | 'location' | 'services' | 'all';
}

export interface PracticeHours {
  [key: string]: string;
}

export interface PracticePricing {
  initial_session: string;
  follow_up_session: string;
  concession_available: boolean;
}

export interface PracticeLocation {
  address: string;
  parking: string;
  public_transport: string;
}

export interface PracticeInfo {
  name: string;
  currentDate: string;
  currentTime: string;
  hours: PracticeHours;
  pricing: PracticePricing;
  location: PracticeLocation;
  services: string[];
}

// Availability Types
export interface AvailabilityParams {
  date: string; // Required date in YYYY-MM-DD format
  session_type?: 'initial' | 'follow_up';
}

export interface AvailabilityResponse {
  date: string;
  available_slots: string[];
}

// Booking Types
export interface BookingParams extends BaseParams {
  patient_name: string;
  phone: string;
  date: string;
  time: string;
  presenting_issue: string;
  gp_referral?: string;
  therapy_goals: string;
}

export interface BookingResponse {
  appointment_id: string;
  patient_id?: string;
}

// Patient Information Types
export interface PatientInfoParams {
  patient_name: string;
  phone: string;
  presenting_issue?: string;
  screening_status?: 'incomplete' | 'complete' | 'high_risk';
}

export interface PatientInfoResponse {
  patient_id: string;
}

// Risk Assessment Types
export interface RiskAssessmentParams {
  patient_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'crisis';
  suicide_risk?: boolean;
  self_harm_risk?: boolean;
  crisis_intervention_provided?: boolean;
  notes?: string;
}

export interface RiskAssessmentResponse {
  assessment_id: string;
}

// Confirmation Types
export interface ConfirmationParams extends BaseParams {
  patient_name: string;
  phone: string;
  date: string;
  time: string;
  confirmation_type?: 'sms' | 'email' | 'both';
}

export interface ConfirmationResponse {
  confirmation_sent: boolean;
}
