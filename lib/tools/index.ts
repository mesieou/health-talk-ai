// Simple tool functions - no bullshit classes or interfaces

import {
  PracticeInfoService, AvailabilityService, BookingService,
  PatientService, RiskAssessmentService, ConfirmationService,
} from './tools';
import { MESSAGE_TEMPLATES } from './templates';
import { validateRequiredFields, isValidDateFormat, isValidTimeFormat, isValidPhoneNumber } from './helpers';

// Simple tool functions
const tools = {
  async 'get_practice_info'(params: any) {
    const data = PracticeInfoService.getPracticeInfo();
    const message = PracticeInfoService.formatPracticeMessage(params.info_type);
    return { message, data };
  },

  async 'check_availability'(params: any) {
    if (!params.date) throw new Error(MESSAGE_TEMPLATES.ERROR.date_required);
    if (!isValidDateFormat(params.date)) throw new Error('Date must be YYYY-MM-DD');

    const data = await AvailabilityService.checkAvailability(params);
    const message = AvailabilityService.formatAvailabilityMessage(data.date, data.available_slots);
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
  }
};

// Simple router
export async function runTool(toolName: string, params: any) {
  console.log('Available tools:', Object.keys(tools));
  console.log('Requested tool:', toolName);

  const tool = tools[toolName as keyof typeof tools];
  if (!tool) throw new Error(`Unknown tool: ${toolName}`);

  console.log(`Running ${toolName}:`, params);
  return await tool(params);
}
