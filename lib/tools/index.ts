// Simple tool functions - no bullshit classes or interfaces

import {
  PracticeInfoService, AvailabilityService, BookingService,
  PatientService, RiskAssessmentService, ConfirmationService,
  ConsentService, PrivacyService, BusinessInfoService
} from './tools';
import { MESSAGE_TEMPLATES } from './templates';
import { validateRequiredFields, isValidDateFormat, isValidTimeFormat, isValidPhoneNumber, formatDateForSpeech } from './helpers';
import { ClinikoClient } from 'cliniko-api-client';
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


// Simple tool functions
const tools = {
  async 'get_practice_info'(params: any) {
    const data = PracticeInfoService.getPracticeInfo();
    const message = PracticeInfoService.formatPracticeMessage(params.info_type);
    return { message, data };
  },

  async 'log_consent'(params: any) {
    const data = await ConsentService.logConsent(params);
    const message = ConsentService.getConsentMessage(params.consent_given);
    return { message, data };
  },

  async 'log_privacy_check'(params: any) {
    const data = await PrivacyService.logPrivacyCheck(params);
    const message = PrivacyService.getPrivacyMessage(params.privacy_confirmed);
    return { message, data };
  },

  async 'check_availability'(params: AvailabilityParams ) {
    const toolId = `check_avail_${Date.now()}`;
    console.log(`📅 [${toolId}] check_availability called with:`, params);

    // Require a specific date from the user
    if (!params.date) {
      console.log(`❌ [${toolId}] Missing date parameter`);
      throw new Error(MESSAGE_TEMPLATES.ERROR.date_required);
    }

    if (!isValidDateFormat(params.date)) {
      console.log(`❌ [${toolId}] Invalid date format:`, params.date);
      throw new Error('Date must be YYYY-MM-DD');
    }

    console.log(`✅ [${toolId}] Date validation passed:`, params.date);

    const data = await AvailabilityService.checkAvailability(params);
    const message = AvailabilityService.formatAvailabilityMessage(data);

    console.log(`✅ [${toolId}] check_availability completed:`, {
      date: data.date,
      availableSlots: data.available_slots,
      message: message
    });

    return { message, data };
  },

  async 'book_appointment'(params: any) {
    const validation = validateRequiredFields(params, ['patient_name', 'phone', 'date', 'time']);
    if (!validation.isValid) throw new Error(`Missing: ${validation.missingFields.join(', ')}`);
    if (!isValidDateFormat(params.date)) throw new Error('Invalid date format');
    if (!isValidTimeFormat(params.time)) throw new Error('Invalid time format');
    if (!isValidPhoneNumber(params.phone)) throw new Error('Invalid phone number');

    const data = await BookingService.bookAppointment(params);
    const message = BookingService.formatBookingMessage(params, data.appointment_id);
    return { message, data };
  },

  async 'save_patient_info'(params: any) {
    const validation = validateRequiredFields(params, ['patient_name', 'phone']);
    if (!validation.isValid) throw new Error(`Missing: ${validation.missingFields.join(', ')}`);
    if (!isValidPhoneNumber(params.phone)) throw new Error('Invalid phone number');

    const data = await PatientService.savePatientInfo(params);
    const message = PatientService.getPatientInfoMessage();
    return { message, data };
  },

  async 'log_risk_assessment'(params: any) {
    const validation = validateRequiredFields(params, ['patient_name', 'risk_level']);
    if (!validation.isValid) throw new Error(`Missing: ${validation.missingFields.join(', ')}`);

    const validLevels = ['low', 'medium', 'high', 'crisis'];
    if (!validLevels.includes(params.risk_level)) {
      throw new Error(`Risk level must be: ${validLevels.join(', ')}`);
    }

    const data = await RiskAssessmentService.logRiskAssessment(params);
    const message = RiskAssessmentService.getRiskAssessmentMessage(params.risk_level);
    return { message, data };
  },

  async 'send_confirmation'(params: any) {
    const validation = validateRequiredFields(params, ['patient_name', 'phone', 'date', 'time']);
    if (!validation.isValid) throw new Error(`Missing: ${validation.missingFields.join(', ')}`);
    if (!isValidDateFormat(params.date)) throw new Error('Invalid date format');
    if (!isValidTimeFormat(params.time)) throw new Error('Invalid time format');
    if (!isValidPhoneNumber(params.phone)) throw new Error('Invalid phone number');

    const data = await ConfirmationService.sendConfirmation(params);
    const message = ConfirmationService.getConfirmationMessage(params);
    return { message, data };
  },

  async 'save_business_info'(params: any) {
    const validation = validateRequiredFields(params, ['business_name', 'business_address', 'business_phone', 'business_email', 'business_website', 'business_description']);
    if (!validation.isValid) throw new Error(`Missing: ${validation.missingFields.join(', ')}`);
    // if (!isValidPhoneNumber(params.business_phone)) throw new Error('Invalid phone number');

    const data = await BusinessInfoService.saveBusinessInfo(params);
    const message = BusinessInfoService.getBusinessInfoMessage();
    return { message, data };
  }
};

// Simple router
export async function runTool(toolName: string, params: any, agentType?: string) {
  const tool = tools[toolName as keyof typeof tools];
  if (!tool) {
    console.log(`❌ Unknown tool: ${toolName} (Agent: ${agentType || 'unknown'})`);
    throw new Error(`Unknown tool: ${toolName}`);
  }

  try {
    console.log(`🔧 Running tool: ${toolName} (Agent: ${agentType || 'unknown'})`);
    const result = await tool(params);
    return result;
  } catch (error) {
    console.error(`💥 Tool ${toolName} failed (Agent: ${agentType || 'unknown'}):`, error instanceof Error ? error.message : error);
    throw error;
  }
}
