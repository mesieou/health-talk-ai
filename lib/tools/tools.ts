// Service layer for business logic - separated from API handlers

import {
  PracticeInfo,
  AvailabilityParams,
  AvailabilityResponse,
  BookingParams,
  BookingResponse,
  PatientInfoParams,
  PatientInfoResponse,
  RiskAssessmentParams,
  RiskAssessmentResponse,
  ConfirmationParams,
  ConfirmationResponse
} from './types';
import { PRACTICE_CONFIG, DEFAULT_TIME_SLOTS, ID_PREFIXES } from './business-context';
import { MESSAGE_TEMPLATES } from './templates';
import {
  generateAppointmentId,
  generatePatientId,
  generateRiskAssessmentId,
  generateTimeSlots,
  formatTimeSlots,
  isHighRiskLevel
} from './helpers';

/**
 * Practice Information Service
 */
export class PracticeInfoService {
  static getPracticeInfo(): PracticeInfo {
    return {
      hours: PRACTICE_CONFIG.HOURS,
      pricing: PRACTICE_CONFIG.PRICING,
      location: PRACTICE_CONFIG.LOCATION,
      services: Array.from(PRACTICE_CONFIG.SERVICES)
    };
  }

  static formatPracticeMessage(infoType?: string): string {
    const templates = MESSAGE_TEMPLATES.PRACTICE_INFO;
    let message = '';

    if (infoType === 'hours' || infoType === 'all') {
      message += `${templates.hours()} `;
    }
    if (infoType === 'pricing' || infoType === 'all') {
      message += `${templates.pricing()} `;
    }
    if (infoType === 'location' || infoType === 'all') {
      message += `${templates.location()} `;
    }
    if (infoType === 'services' || infoType === 'all') {
      message += `${templates.services()} `;
    }

    return message || 'Here\'s our practice information. What would you like to know more about?';
  }
}

/**
 * Availability Service
 */
export class AvailabilityService {
  static async checkAvailability(params: AvailabilityParams): Promise<AvailabilityResponse> {
    // TODO: Integrate with your calendar system
    // Example: const slots = await calendarAPI.getAvailableSlotsForDate(params.date);

    // Generate mock slots for the requested date
    const availableSlots = generateTimeSlots(params.date, DEFAULT_TIME_SLOTS);

    return {
      date: params.date,
      available_slots: availableSlots
    };
  }

  static formatAvailabilityMessage(date: string, slots: string[]): string {
    const slotTimes = formatTimeSlots(slots);
    return `For ${date}, I have the following time slots available: ${slotTimes.join(', ')}. Would you like me to book one of these appointments for you?`;
  }
}

/**
 * Booking Service
 */
export class BookingService {
  static async bookAppointment(params: BookingParams): Promise<BookingResponse> {
    // TODO: Integrate with your booking system
    // Example: const booking = await bookingAPI.createAppointment(params);

    // TODO: Integrate with your calendar system
    // Example: await calendarAPI.blockSlot(params.date, params.time);

    const appointmentId = generateAppointmentId();

    // Save patient info if needed
    const patientId = await PatientService.savePatientInfo({
      patient_name: params.patient_name,
      phone: params.phone,
      date_of_birth: params.date_of_birth,
      address: params.address,
      emergency_contact: params.emergency_contact,
      presenting_issue: params.presenting_issue
    });

    return {
      appointment_id: appointmentId,
      patient_id: patientId.patient_id
    };
  }

  static formatBookingMessage(params: BookingParams, appointmentId: string): string {
    return MESSAGE_TEMPLATES.BOOKING.success(params.patient_name, params.date, params.time, appointmentId);
  }
}

/**
 * Patient Service
 */
export class PatientService {
  static async savePatientInfo(params: PatientInfoParams): Promise<PatientInfoResponse> {
    // TODO: Integrate with your database
    // Example: await database.savePatient(params);

    // TODO: Integrate with your CRM system
    // Example: await crmAPI.createLead(params);

    const patientId = generatePatientId();

    return {
      patient_id: patientId
    };
  }

  static getPatientInfoMessage(): string {
    return MESSAGE_TEMPLATES.PATIENT_INFO.saved;
  }
}

/**
 * Risk Assessment Service
 */
export class RiskAssessmentService {
  static async logRiskAssessment(params: RiskAssessmentParams): Promise<RiskAssessmentResponse> {
    // TODO: Integrate with your risk assessment system
    // Example: await riskAssessmentAPI.logAssessment(params);

    // TODO: Integrate with your alert system for high-risk cases
    if (isHighRiskLevel(params.risk_level)) {
      // Example: await alertSystem.notifyClinician(params);
      console.warn(`HIGH RISK ASSESSMENT: ${params.patient_name} - ${params.risk_level}`);
    }

    const assessmentId = generateRiskAssessmentId();

    return {
      assessment_id: assessmentId
    };
  }

  static getRiskAssessmentMessage(riskLevel: string): string {
    if (isHighRiskLevel(riskLevel)) {
      return MESSAGE_TEMPLATES.RISK_ASSESSMENT.crisis();
    }
    return MESSAGE_TEMPLATES.RISK_ASSESSMENT.logged();
  }
}

/**
 * Confirmation Service
 */
export class ConfirmationService {
  static async sendConfirmation(params: ConfirmationParams): Promise<ConfirmationResponse> {
    // TODO: Integrate with your SMS service
    // TODO: Integrate with your email service

    const confirmationData = MESSAGE_TEMPLATES.CONFIRMATION(
      params.patient_name,
      params.date,
      params.time
    );

    // TODO: Use confirmationData.messageToSend for SMS/email services
    // Example: await smsService.send(params.phone, confirmationData.messageToSend);
    // Example: await emailService.send(params.email, confirmationData.messageToSend);

    console.log('Confirmation message to send:', confirmationData.messageToSend);

    return {
      confirmation_sent: true
    };
  }

  static getConfirmationMessage(params: ConfirmationParams): string {
    const confirmationData = MESSAGE_TEMPLATES.CONFIRMATION(
      params.patient_name,
      params.date,
      params.time
    );
    return confirmationData.responseMessage;
  }
}
