
import { GoogleGenAI } from "@google/genai";

/**
 * HTTSMS INTEGRATION
 * Uses an Android phone as a gateway to send real SMS.
 */
const HTTSMS_API_KEY = 'pk_aecYxAb9A55sigL7m4bddNxevp7auScHA-ik4uS-MOp11Jy_0MnNHQzRmvMHcSu9';
const HTTSMS_URL = 'https://httsms.com/api/v1/messages';

export interface SMSPayload {
  to: string;
  message: string;
}

/**
 * Sends a real SMS via HttSms gateway.
 */
export const sendSMS = async (payload: SMSPayload): Promise<{ success: boolean; messageId: string; error?: string }> => {
  console.log(`[HTTSMS] Sending real SMS to: ${payload.to}`);
  
  try {
    // Ensure number is in international format (defaulting to India +91 if not specified)
    let cleanNumber = payload.to.replace(/\D/g, '');
    if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;
    if (!cleanNumber.startsWith('+')) cleanNumber = '+' + cleanNumber;

    const response = await fetch(HTTSMS_URL, {
      method: 'POST',
      headers: {
        'x-api-key': HTTSMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "to": cleanNumber,
        "content": payload.message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, messageId: data.id || 'sent' };
  } catch (error: any) {
    console.error("[HTTSMS] Delivery failed:", error.message);
    return { 
      success: false, 
      messageId: '', 
      error: error.message 
    };
  }
};

/**
 * Broadcasts an SMS to multiple stakeholders using HttSms.
 */
export const broadcastSMS = async (recipients: string[], message: string): Promise<boolean> => {
  try {
    // HttSms currently handles individual messages better for tracking, 
    // so we map through recipients and send them.
    const results = await Promise.all(
      recipients.map(to => sendSMS({ to, message }))
    );
    return results.some(r => r.success);
  } catch (error) {
    console.error("[HTTSMS] Broadcast Error:", error);
    return false;
  }
};

/**
 * Fallback to Native App if needed
 */
export const triggerNativeSMS = (to: string, message: string) => {
  const cleanNumber = to.replace(/\D/g, '');
  const smsUrl = `sms:${cleanNumber}?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
};

export const draftPondReportSMS = async (
  pondName: string, 
  metrics: { temp: string; ph: string; oxygen: string; ammonia: string },
  healthScore: number,
  lang: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Draft a professional, ultra-short SMS report for a farmer in ${lang}. Pond: ${pondName}. Score: ${healthScore}/100. End with 'FinGuard AI'.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || `FinGuard AI: ${pondName} health score ${healthScore}/100.`;
  } catch (error) {
    return `FinGuard AI: ${pondName} health score ${healthScore}/100.`;
  }
};
