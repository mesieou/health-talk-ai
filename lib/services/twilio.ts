import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

export interface SMSParams {
  to: string;
  message: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class TwilioService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

    if (!accountSid || !authToken || !this.fromNumber) {
      throw new Error('Missing required Twilio environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
    }

    this.client = twilio(accountSid, authToken);
  }

  /**
   * Send SMS message via Twilio
   */
  async sendSMS(params: SMSParams): Promise<SMSResponse> {
    try {
      // Format phone number for international use
      const formattedPhone = this.formatPhoneNumber(params.to);

      const message = await this.client.messages.create({
        body: params.message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`SMS sent successfully to ${formattedPhone}. Message SID: ${message.sid}`);

      return {
        success: true,
        messageId: message.sid
      };
    } catch (error) {
      console.error('Failed to send SMS:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Format Australian phone numbers for international use
   * Converts formats like:
   * - 0413 678 116 -> +61413678116
   * - 413 678 116 -> +61413678116
   * - +61413678116 -> +61413678116 (already formatted)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // If it starts with +, assume it's already in international format
    if (cleaned.startsWith('+')) {
      return cleaned;
    }

    // If it starts with 0, remove it and add +61
    if (cleaned.startsWith('0')) {
      return '+61' + cleaned.substring(1);
    }

    // If it doesn't start with 0 or +, assume it's Australian mobile without country code
    if (cleaned.length === 9 && (cleaned.startsWith('4') || cleaned.startsWith('5'))) {
      return '+61' + cleaned;
    }

    // Default: add +61 prefix
    return '+61' + cleaned;
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);

    // Australian mobile numbers: +614xxxxxxxx or +615xxxxxxxx (10 digits after +61)
    // Australian landlines: +61[2-9]xxxxxxxx (9 digits after +61)
    const australianMobileRegex = /^\+61[45]\d{8}$/;
    const australianLandlineRegex = /^\+61[2-9]\d{8}$/;

    return australianMobileRegex.test(formatted) || australianLandlineRegex.test(formatted);
  }
}

// Singleton instance
let twilioService: TwilioService | null = null;

export function getTwilioService(): TwilioService {
  if (!twilioService) {
    twilioService = new TwilioService();
  }
  return twilioService;
}
