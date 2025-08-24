# Tool Integration Guide

This document explains how to integrate the mental health practice tools with your external systems.

## Overview

The tools are currently using mock data. To make them fully functional, you need to integrate with:

1. **Database System** - For storing patient information
2. **Calendar System** - For managing appointments
3. **Notification Service** - For sending SMS/email confirmations
4. **Risk Assessment System** - For logging and alerting on high-risk cases

## Integration Points

### 1. Database Integration

**File:** `utils/tools.ts` - `savePatientInfo()` function

**Current:** Mock implementation
```typescript
// TODO: Integrate with your database
// Example: await database.savePatient(params);
```

**Integration Examples:**

**PostgreSQL:**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function savePatientInfo(params: PatientInfoParams) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO patients (name, dob, phone, address, emergency_contact, presenting_issue, screening_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [params.patient_name, params.date_of_birth, params.phone, params.address, params.emergency_contact, params.presenting_issue, params.screening_status]
    );
    return { success: true, patient_id: result.rows[0].id };
  } finally {
    client.release();
  }
}
```

**MongoDB:**
```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function savePatientInfo(params: PatientInfoParams) {
  await client.connect();
  const db = client.db('mental_health_practice');
  const result = await db.collection('patients').insertOne(params);
  return { success: true, patient_id: result.insertedId };
}
```

### 2. Calendar Integration

**File:** `utils/tools.ts` - `checkAvailability()` and `bookAppointment()` functions

**Current:** Mock implementation
```typescript
// TODO: Integrate with your calendar system
// Example: const slots = await calendarAPI.getAvailableSlots(params);
```

**Integration Examples:**

**Google Calendar:**
```typescript
import { google } from 'googleapis';

const calendar = google.calendar({ version: 'v3' });

export async function checkAvailability(params: AvailabilityParams) {
  const response = await calendar.freebusy.query({
    auth: await getGoogleAuth(),
    requestBody: {
      timeMin: new Date(params.date).toISOString(),
      timeMax: new Date(params.date + 'T23:59:59').toISOString(),
      items: [{ id: 'primary' }]
    }
  });

  // Process free/busy data to find available slots
  return { success: true, available_slots: availableSlots };
}
```

**Calendly:**
```typescript
import axios from 'axios';

export async function checkAvailability(params: AvailabilityParams) {
  const response = await axios.get(
    `https://api.calendly.com/event_types/${process.env.CALENDLY_EVENT_TYPE_ID}/availability`,
    {
      headers: { Authorization: `Bearer ${process.env.CALENDLY_API_KEY}` }
    }
  );

  return { success: true, available_slots: response.data.slots };
}
```

### 3. Notification Service Integration

**File:** `utils/tools.ts` - `sendConfirmation()` function

**Current:** Mock implementation
```typescript
// TODO: Integrate with your SMS service
// Example: await smsService.send(params.phone, confirmationMessage);
```

**Integration Examples:**

**Twilio SMS:**
```typescript
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendConfirmation(params: ConfirmationParams) {
  const message = `Hi ${params.patient_name}, your appointment is confirmed for ${params.date} at ${params.time}. Please arrive 10 minutes early.`;

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: params.phone
  });

  return { success: true, confirmation_sent: true };
}
```

**SendGrid Email:**
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendConfirmation(params: ConfirmationParams) {
  const msg = {
    to: params.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Appointment Confirmation',
    text: `Hi ${params.patient_name}, your appointment is confirmed for ${params.date} at ${params.time}.`,
    html: `<p>Hi ${params.patient_name},</p><p>Your appointment is confirmed for ${params.date} at ${params.time}.</p>`
  };

  await sgMail.send(msg);
  return { success: true, confirmation_sent: true };
}
```

### 4. Risk Assessment Integration

**File:** `utils/tools.ts` - `logRiskAssessment()` function

**Current:** Mock implementation
```typescript
// TODO: Integrate with your risk assessment system
// Example: await riskAssessmentAPI.logAssessment(params);
```

**Integration Examples:**

**Custom Risk Assessment System:**
```typescript
export async function logRiskAssessment(params: RiskAssessmentParams) {
  // Log to database
  await database.riskAssessments.create({
    patientName: params.patient_name,
    riskLevel: params.risk_level,
    suicideRisk: params.suicide_risk,
    selfHarmRisk: params.self_harm_risk,
    timestamp: new Date()
  });

  // Alert clinicians for high-risk cases
  if (params.risk_level === 'high' || params.risk_level === 'crisis') {
    await notifyClinicians(params);
  }

  return { success: true, assessment_id: `RISK-${Date.now()}` };
}
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# Database
DATABASE_URL=your_database_connection_string

# Calendar
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key

# Notifications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_from_email

# Risk Assessment
RISK_ASSESSMENT_WEBHOOK=your_webhook_url
```

## Testing Tools

To test the tools without full integration:

1. **Check browser console** for tool call logs
2. **Use mock data** (already implemented)
3. **Test individual functions** in isolation

## Security Considerations

1. **Encrypt sensitive data** before storing
2. **Validate all inputs** before processing
3. **Use HTTPS** for all API calls
4. **Implement rate limiting** for tool calls
5. **Log all tool executions** for audit trails
6. **Comply with HIPAA** and Australian privacy laws

## Next Steps

1. Choose your integration services
2. Update the TODO comments in `utils/tools.ts`
3. Add environment variables
4. Test each integration
5. Deploy with proper security measures
