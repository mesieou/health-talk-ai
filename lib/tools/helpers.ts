import { ID_PREFIXES } from './business-context';

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
export function formatTimeSlots(slots: string[]): string[] {
  return slots.map(slot => {
    const time = slot.split(' ')[1] || slot;
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  });
}

/**
 * Validates date format (YYYY-MM-DD)
 */
export function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * Validates time format (HH:mm)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

/**
 * Validates phone number (basic validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic phone validation - adjust regex based on your requirements
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
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
export function formatDateForDisplay(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field as string);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}
