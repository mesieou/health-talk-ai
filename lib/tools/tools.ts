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
  ConfirmationResponse,
  BusinessInfoParams,
  BusinessInfoResponse
} from './types';
import { PRACTICE_CONFIG, DEFAULT_TIME_SLOTS, ID_PREFIXES } from './business-context';
import { MESSAGE_TEMPLATES } from './templates';
import {
  generateAppointmentId,
  generatePatientId,
  generateRiskAssessmentId,
  generateBusinessId,
  generateTimeSlots,
  formatTimeSlots,
  formatDateForDisplay,
  formatDateForSpeech,
  isHighRiskLevel
} from './helpers';
import { SupabaseBusinessService } from '../supabase/business-service';

/**
 * Practice Information Service
 */
export class PracticeInfoService {
  static getPracticeInfo(): PracticeInfo {
    return {
      name: PRACTICE_CONFIG.NAME,
      currentDate: PRACTICE_CONFIG.CURRENT_DATE,
      currentTime: PRACTICE_CONFIG.CURRENT_TIME,
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
    if (infoType === 'datetime' || infoType === 'all') {
      message += `${templates.currentDateTime()} `;
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

  static formatAvailabilityMessage(data: AvailabilityResponse): string {
    const slotTimes = formatTimeSlots(data.available_slots);
    const formattedDate = formatDateForSpeech(data.date);
    return `For ${formattedDate}, I have the following time slots available: ${slotTimes}. Would you like me to book one of these appointments for you?`;
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
 * Consent Service
 */
export class ConsentService {
  static async logConsent(params: { consent_given: boolean; reason?: string }): Promise<{ consent_id: string }> {
    // TODO: Integrate with your consent tracking system
    // Example: await consentAPI.logConsent(params);

    const consentId = `CONSENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Consent logged: ${consentId} - Given: ${params.consent_given}`);

    return {
      consent_id: consentId
    };
  }

  static getConsentMessage(consentGiven: boolean): string {
    return consentGiven
      ? "Thank you for confirming."
      : "I understand you don't consent to recording. Unfortunately, I cannot proceed without consent. Please call back when you're ready to provide consent.";
  }
}

/**
 * Privacy Service
 */
export class PrivacyService {
  static async logPrivacyCheck(params: { privacy_confirmed: boolean; reason?: string }): Promise<{ privacy_id: string }> {
    // TODO: Integrate with your privacy tracking system
    // Example: await privacyAPI.logPrivacyCheck(params);

    const privacyId = `PRIVACY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Privacy check logged: ${privacyId} - Confirmed: ${params.privacy_confirmed}`);

    return {
      privacy_id: privacyId
    };
  }

  static getPrivacyMessage(privacyConfirmed: boolean): string {
    return privacyConfirmed
      ? "Perfect, thank you for confirming your privacy."
      : "I understand you're not in a private location. Please find a quiet, private space and call back when you're ready to proceed.";
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

/**
 * Business Information Service
 */
export class BusinessInfoService {
  static async saveBusinessInfo(params: BusinessInfoParams): Promise<BusinessInfoResponse> {    

    try {
      // Generate unique business ID
      
      // Save to Supabase database
      const data = await SupabaseBusinessService.saveBusinessInfo(params);

      // TODO: Send notification to business development team
      // Example: await notificationService.notifyBusinessTeam(params);

      console.log('Business info saved successfully:', {        
        businessName: params.business_name,
        businessEmail: params.business_email
      });

      return {
        business_id: data.business_id
      };
    } catch (error) {
      console.error('Failed to save business info:', error);
      throw new Error('Failed to save business information. Please try again.');
    }
  }

  static getBusinessInfoMessage(): string {
    return "Thank you for setting up your business with us. Have a great day!";
  }

  /**
   * Get business information by business ID
   */
  static async getBusinessInfo(businessId: string) {
    try {
      const businessInfo = await SupabaseBusinessService.getBusinessInfo(businessId);
      
      if (!businessInfo) {
        throw new Error('Business information not found');
      }

      return businessInfo;
    } catch (error) {
      console.error('Failed to get business info:', error);
      throw new Error('Failed to retrieve business information. Please check the business ID.');
    }
  }

  /**
   * Get all business information records
   */
  static async getAllBusinessInfo() {
    try {
      return await SupabaseBusinessService.getAllBusinessInfo();
    } catch (error) {
      console.error('Failed to get all business info:', error);
      throw new Error('Failed to retrieve business information.');
    }
  }

  /**
   * Update business information
   */
  static async updateBusinessInfo(businessId: string, updates: Partial<BusinessInfoParams>) {
    try {
      return await SupabaseBusinessService.updateBusinessInfo(businessId, updates);
    } catch (error) {
      console.error('Failed to update business info:', error);
      throw new Error('Failed to update business information.');
    }
  }

  /**
   * Delete business information
   */
  static async deleteBusinessInfo(businessId: string) {
    try {
      return await SupabaseBusinessService.deleteBusinessInfo(businessId);
    } catch (error) {
      console.error('Failed to delete business info:', error);
      throw new Error('Failed to delete business information.');
    }
  }
}
