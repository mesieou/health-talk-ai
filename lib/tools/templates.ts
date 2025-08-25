import { PRACTICE_CONFIG } from './business-context';

// Message templates
export const MESSAGE_TEMPLATES = {
  PRACTICE_INFO: {
    hours: () => `We're open Monday to Thursday ${PRACTICE_CONFIG.HOURS.monday}, Friday ${PRACTICE_CONFIG.HOURS.friday}, Saturday ${PRACTICE_CONFIG.HOURS.saturday}, and ${PRACTICE_CONFIG.HOURS.sunday.toLowerCase()} on Sundays.`,
    pricing: () => `Initial sessions are ${PRACTICE_CONFIG.PRICING.initial_session} and follow-up sessions are ${PRACTICE_CONFIG.PRICING.follow_up_session}.${PRACTICE_CONFIG.PRICING.concession_available ? " Concession rates are available." : ""}`,
    location: () => `We're located at ${PRACTICE_CONFIG.LOCATION.address}, with ${PRACTICE_CONFIG.LOCATION.parking.toLowerCase()} and ${PRACTICE_CONFIG.LOCATION.public_transport.toLowerCase()}.`,
    services: () => `We specialize in ${PRACTICE_CONFIG.SERVICES.map(service => service.toLowerCase()).join(', ')}.`
  },
  CONFIRMATION: (name: string, date: string, time: string) => ({
    messageToSend: `Hi ${name}, your appointment is confirmed for ${date} at ${time}. Please arrive 10 minutes early. If you need to reschedule, call us at ${PRACTICE_CONFIG.CONTACT.phone} at least 24 hours in advance.`,
    responseMessage: "I've sent you a confirmation with your appointment details. Please check your phone for the confirmation message."
  }),
  BOOKING: {
    success: (name: string, date: string, time: string, appointmentId: string) => `Great! I've booked your appointment for ${date} at ${time}. Your appointment ID is ${appointmentId}. You'll receive a confirmation shortly.`
  },
  RISK_ASSESSMENT: {
    logged: () => `I've logged your assessment. If you need immediate help, please call Lifeline on ${PRACTICE_CONFIG.CONTACT.lifeline}.`,
    crisis: () => `This appears to be a crisis situation. Please call Lifeline immediately on ${PRACTICE_CONFIG.CONTACT.lifeline} or go to your nearest emergency department.`
  },
  PATIENT_INFO: {
    saved: "I've saved your information securely. This will help us prepare for your appointment."
  },
  ERROR: {
    method_not_allowed: "Method not allowed",
    generic: "Something went wrong. Please try again.",
    date_required: "Date parameter is required in YYYY-MM-DD format",
    booking_failed: "Sorry, I encountered an issue booking your appointment. Please try again.",
    info_unavailable: "Unable to retrieve practice information at the moment.",
    confirmation_failed: "Unable to send confirmation at the moment, but your appointment is still booked.",
    assessment_failed: "Unable to log assessment at the moment.",
    patient_save_failed: "Unable to save your information at the moment. Please try again.",
    availability_failed: "Unable to check availability at the moment. Please try again."
  }
};
