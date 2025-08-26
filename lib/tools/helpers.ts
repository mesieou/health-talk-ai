import { PRACTICE_CONFIG, DEFAULT_TIME_SLOTS, ID_PREFIXES } from './business-context';

// Utility functions for common operations

/**
 * Generates a unique ID with a given prefix
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates appointment ID
 */
export function generateAppointmentId(): string {
  return generateId(ID_PREFIXES.APPOINTMENT);
}

/**
 * Generates patient ID
 */
export function generatePatientId(): string {
  return generateId(ID_PREFIXES.PATIENT);
}

/**
 * Generates risk assessment ID
 */
export function generateRiskAssessmentId(): string {
  return generateId(ID_PREFIXES.RISK_ASSESSMENT);
}

/**
 * Formats time slots from 24-hour to 12-hour format with AM/PM
 */
export function formatTimeSlots(slots: string[]): string {
  if (!slots || slots.length === 0) {
    return 'no available slots';
  }

  return slots.map(slot => {
    // Handle both "2025-08-26 09:00" and "09:00" formats
    const timePart = slot.includes(' ') ? slot.split(' ')[1] : slot;
    const [hour, minute] = timePart.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;

    // Use "o'clock" for times ending in :00
    if (minute === '00') {
      return `${displayHour} o'clock ${period}`;
    }

    return `${displayHour}:${minute} ${period}`;
  }).join(', ');
}

/**
 * Validates date format (YYYY-MM-DD)
 */
export function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * Validates time format (HH:mm)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Validates phone number (basic validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Australian phone number format (basic validation)
  const phoneRegex = /^(\+61|0)[2-478](?:[ -]?[0-9]){8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Generates available time slots for a given date
 */
export function generateTimeSlots(date: string, baseSlots: string[]): string[] {
  return baseSlots.map(slot => `${date} ${slot}`);
}

/**
 * Checks if a risk level requires immediate attention
 */
export function isHighRiskLevel(riskLevel: string): boolean {
  return riskLevel === 'high' || riskLevel === 'crisis';
}

/**
 * Formats a date string for display
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats a date string for speech (better TTS pronunciation)
 */
export function formatDateForSpeech(dateString: string): string {
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString('en-AU', { weekday: 'long' });
  const month = date.toLocaleDateString('en-AU', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();

  // Format year for better pronunciation (2025 → "twenty twenty-five")
  let yearSpeech;
  if (year >= 2000 && year <= 2099) {
    const lastTwoDigits = year % 100;
    if (lastTwoDigits === 0) {
      yearSpeech = `twenty hundred`;
    } else if (lastTwoDigits < 10) {
      yearSpeech = `twenty oh ${lastTwoDigits}`;
    } else {
      yearSpeech = `twenty ${lastTwoDigits}`;
    }
  } else {
    yearSpeech = year.toString();
  }

  return `${weekday}, ${month} ${day}, ${yearSpeech}`;
}

/**
 * Sanitizes input strings to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Validates required fields in an object
 */
export function validateRequiredFields(data: any, requiredFields: string[]) {
  const validationId = `validation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`🔍 [${validationId}] Starting field validation:`, {
    data,
    requiredFields,
    dataKeys: Object.keys(data || {})
  });
  console.log(`${'─'.repeat(50)}`);

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    const value = data?.[field];
    const valueType = typeof value;
    const isUndefined = value === undefined;
    const isNull = value === null;
    const isEmptyString = value === '';
    const isWhitespaceOnly = typeof value === 'string' && value.trim() === '';

    console.log(`🔍 [${validationId}] Validating field '${field}':`, {
      value,
      valueType,
      isUndefined,
      isNull,
      isEmptyString,
      isWhitespaceOnly
    });

    if (isUndefined || isNull || isEmptyString || isWhitespaceOnly) {
      console.log(`❌ [${validationId}] Field '${field}' is invalid`);
      missingFields.push(field);
    } else {
      console.log(`✅ [${validationId}] Field '${field}' is valid`);
    }
  }

  const isValid = missingFields.length === 0;

  console.log(`📊 [${validationId}] Validation result:`, { isValid, missingFields });
  console.log(`${'─'.repeat(50)}\n`);

  return { isValid, missingFields };
}
