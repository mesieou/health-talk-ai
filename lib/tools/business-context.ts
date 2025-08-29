// Business configuration
export const PRACTICE_CONFIG = {
  NAME: "Mindful Mental Health Practice",
  CURRENT_DATE: new Date().toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' }).split('/').reverse().join('-'), // YYYY-MM-DD format in Australian timezone
  CURRENT_TIME: new Date().toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour12: false }), // HH:MM:SS format in Australian timezone
  HOURS: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 5:00 PM",
    saturday: "closed",
    sunday: "Closed"
  },
  PRICING: {
    initial_session: "$180",
    follow_up_session: "$150",
    concession_available: true
  },
  LOCATION: {
    address: "123 Mental Health Street, Sydney NSW 2000",
    parking: "free parking available",
    public_transport: "accessible by train and bus"
  },
  SERVICES: [
    "Mood disorders (depression, anxiety)",
    "Cognitive Behavioral Therapy (CBT)"
  ],
  CONTACT: {
    email: "info@mentalhealthpractice.com.au",
    phone: "0413 678 116",
    lifeline: "13 11 14"
  },
  FAQ: [
    {
      "question": "How can I book an appointment?",
      "answer": "You can book an appointment online through our website, via our app, or by calling the reception at 0413 678 116."
    },
    {
      "question": "What should I expect during my first session?",
      "answer": "During your first session, the psychologist will ask about your background, mental health history, current concerns, and goals for therapy. It usually lasts 50–60 minutes."
    },
    {
      "question": "Do you offer telehealth sessions?",
      "answer": "Yes, we offer both in-person and telehealth sessions. You can select your preferred option when booking."
    },
    {
      "question": "What is your cancellation policy?",
      "answer": "We require 24 hours notice for cancellations. If you cancel less than 24 hours before your appointment, you will be charged the full session fee."
    },
    {
      "question": "What should I do if I am in crisis?",
      "answer": "If you are in immediate danger or experiencing suicidal thoughts, please call 000. You can also contact Lifeline at 13 11 14 for urgent support."
    },
    {
      "question": "What information do I need to provide before my first session?",
      "answer": "Please provide your full name, date of birth, contact details, emergency contact, reason for visit, and any relevant medical or mental health history."
    },
    {
      "question": "Do you accept insurance or Medicare rebates?",
      "answer": "Yes, we provide receipts for sessions so you can claim rebates through Medicare or your private health insurance."
    },
    {
      "question": "Can I choose my psychologist?",
      "answer": "Yes, you can request a specific psychologist based on availability, or we can match you with a professional suited to your needs."
    },
    {
      "question": "How long is each session?",
      "answer": "Most sessions are 50–60 minutes. Some initial assessments may take up to 75 minutes."
    },
    {
      "question": "Is my information kept confidential?",
      "answer": "Yes, all your personal and health information is kept strictly confidential according to Australian privacy laws and professional guidelines."
    }
  ]

} as const;

export const DEFAULT_TIME_SLOTS = ["09:00", "10:30", "14:00", "15:30", "16:30"];

export const ID_PREFIXES = {
  APPOINTMENT: "APT",
  PATIENT: "PAT",
  RISK_ASSESSMENT: "RISK"
} as const;

// Helper function to get current date in readable format (Australian timezone)
export function getCurrentDateReadable(): string {
  const today = new Date();
  return today.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Australia/Sydney'
  });
}

// Helper function to get current date in ISO format (Australian timezone)
export function getCurrentDateISO(): string {
  const today = new Date();
  return today.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' }).split('/').reverse().join('-');
}

// Helper function to get current time in Australian timezone
export function getCurrentTimeAU(): string {
  return new Date().toLocaleTimeString('en-AU', {
    timeZone: 'Australia/Sydney',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Helper function to get current date and time in Australian timezone
export function getCurrentDateTimeAU(): string {
  const date = getCurrentDateReadable();
  const time = getCurrentTimeAU();
  return `${date} at ${time}`;
}
