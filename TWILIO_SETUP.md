# Twilio SMS Integration Setup Guide

## Overview
This integration allows the Health Talk AI system to send SMS confirmations for booked appointments using Twilio.

## Setup Instructions

### 1. Get Your Twilio Credentials
1. Log in to your [Twilio Console](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Note your Twilio phone number (the one you have active)

### 2. Add Environment Variables
Add these variables to your `.env.local` file (create if it doesn't exist):

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

**Example:**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=abcdef1234567890abcdef1234567890
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Phone Number Format
The system automatically handles Australian phone number formats:
- `0413 678 116` → `+61413678116`
- `413 678 116` → `+61413678116`
- `+61413678116` → `+61413678116` (already formatted)

### 4. Message Content
SMS confirmations now include:
- ✅ Patient name and appointment confirmation
- 📅 Date and time
- 📍 Practice location and address
- 🚗 Parking information
- 📞 Contact details for rescheduling
- 📧 Email for questions
- 🆔 Booking ID (if available)

### 5. Error Handling
- Invalid phone numbers are validated before sending
- SMS failures are logged but don't block the booking process
- Detailed error messages help with troubleshooting

## Testing
1. Book a test appointment through the system
2. Check the console logs for SMS sending confirmation
3. Verify the SMS is received on the provided phone number

## Troubleshooting
- **"Missing required Twilio environment variables"**: Check your `.env.local` file
- **"Invalid phone number format"**: Ensure phone numbers are Australian format
- **SMS not received**: Check Twilio console for delivery status and account balance
