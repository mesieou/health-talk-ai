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
 * Generates business info ID
 */
export function generateBusinessId(): string {
  return generateId('BIZ');
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

/**
 * Australian address parsing interface
 */
export interface ParsedAddress {
  address_1: string;
  city: string;
  state: string;
  post_code: string;
  country: string;
}

/**
 * Parses a single Australian address string into structured components
 * Handles formats like: "123 Collins Street, Melbourne, VIC, 3000"
 */
export function parseAustralianAddress(addressString: string): ParsedAddress {
  if (!addressString || typeof addressString !== 'string') {
    return {
      address_1: '',
      city: '',
      state: '',
      post_code: '',
      country: 'Australia'
    };
  }

  // Clean the address string
  const cleaned = addressString.trim().replace(/\s+/g, ' ');
  
  // Australian state codes (including territories)
  const australianStates = [
    'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT',
    'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 
    'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'
  ];

  // Split by commas first, then by spaces for remaining parts
  let parts = cleaned.split(',').map(part => part.trim());
  
  // If no commas, split by spaces and try to reconstruct
  if (parts.length === 1) {
    parts = cleaned.split(/\s+/);
  }

  let address_1 = '';
  let city = '';
  let state = '';
  let post_code = '';

  // Find postal code (4 digits at the end)
  const postCodePattern = /\b\d{4}\b/;
  const postCodeMatch = cleaned.match(postCodePattern);
  if (postCodeMatch) {
    post_code = postCodeMatch[0];
  }

  // Find state (look for Australian state codes)
  let stateIndex = -1;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].replace(/[.,]/g, '').trim().toUpperCase();
    if (australianStates.map(s => s.toUpperCase()).includes(part)) {
      state = part.length <= 3 ? part : getStateAbbreviation(part);
      stateIndex = i;
      break;
    }
  }

  // Reconstruct based on what we found
  if (parts.length >= 3) {
    // Format: "Street, City, State Postcode" or similar
    if (stateIndex > 0) {
      address_1 = parts.slice(0, stateIndex - 1).join(', ').replace(/[.,\s]+$/, '');
      city = parts[stateIndex - 1].replace(/[.,]/g, '').trim();
    } else {
      // Fallback: first part is address, second is city
      address_1 = parts[0].replace(/[.,]/g, '').trim();
      city = parts[1].replace(/[.,]/g, '').trim();
    }
  } else {
    // Try to parse from a space-separated string
    const allParts = cleaned.split(/\s+/);
    
    // Remove postal code and state from the end
    let remainingParts = [...allParts];
    if (post_code) {
      remainingParts = remainingParts.filter(part => part !== post_code);
    }
    if (state) {
      remainingParts = remainingParts.filter(part => 
        part.toUpperCase() !== state.toUpperCase()
      );
    }

    // Last remaining word is likely city, rest is address
    if (remainingParts.length >= 2) {
      city = remainingParts[remainingParts.length - 1];
      address_1 = remainingParts.slice(0, -1).join(' ');
    } else if (remainingParts.length === 1) {
      address_1 = remainingParts[0];
      city = 'Melbourne'; // Default fallback
    }
  }

  // Clean up and provide defaults
  address_1 = address_1 || '123 Test Street';
  city = city || 'Melbourne';
  state = state || 'VIC';
  post_code = post_code || '3000';

  return {
    address_1: capitalizeWords(address_1),
    city: capitalizeWords(city),
    state: state.toUpperCase(),
    post_code,
    country: 'Australia'
  };
}

/**
 * Convert full state names to abbreviations
 */
function getStateAbbreviation(fullStateName: string): string {
  const stateMap: { [key: string]: string } = {
    'NEW SOUTH WALES': 'NSW',
    'VICTORIA': 'VIC',
    'QUEENSLAND': 'QLD',
    'WESTERN AUSTRALIA': 'WA',
    'SOUTH AUSTRALIA': 'SA',
    'TASMANIA': 'TAS',
    'AUSTRALIAN CAPITAL TERRITORY': 'ACT',
    'NORTHERN TERRITORY': 'NT'
  };
  
  return stateMap[fullStateName.toUpperCase()] || fullStateName;
}

/**
 * Capitalize each word in a string
 */
function capitalizeWords(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
