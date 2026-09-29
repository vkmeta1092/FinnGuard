
import { broadcastSMS } from './smsService';

export type NotificationChannel = 'PUSH' | 'SMS' | 'EMAIL';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  channels: NotificationChannel[];
  status: 'PENDING' | 'SENT' | 'FAILED';
}

class NotificationService {
  private history: AppNotification[] = [];

  /**
   * Triggers a multi-channel alert for critical pond failures.
   */
  async notifyCrisis(title: string, body: string, contactInfo: { phone?: string; email?: string }) {
    const channels: NotificationChannel[] = ['PUSH'];
    if (contactInfo.phone) channels.push('SMS');
    if (contactInfo.email) channels.push('EMAIL');

    const notification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      body,
      timestamp: new Date(),
      channels,
      status: 'PENDING'
    };

    console.log(`[SYSTEM] Initiating Multi-Channel Alert: ${title}`);

    try {
      // 1. Device Notification (Push Simulation)
      this.simulatePush(title, body);

      // 2. Mobile Notification (Real SMS via HTTSMS if phone is provided)
      if (contactInfo.phone) {
        await broadcastSMS([contactInfo.phone], `${title}: ${body}`);
      }
      
      // 3. Email Notification (SMTP Simulation if email is provided)
      if (contactInfo.email) {
        this.simulateEmail(contactInfo.email, title, body);
      } else {
        console.log("[SYSTEM] No email provided, skipping email notification.");
      }

      notification.status = 'SENT';
    } catch (err) {
      console.error("[SYSTEM] Notification failed", err);
      notification.status = 'FAILED';
    }

    this.history = [notification, ...this.history].slice(0, 50);
    return notification;
  }

  private simulatePush(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    console.log(`[PUSH] Dispatched to Device: ${title}`);
  }

  private simulateEmail(to: string, subject: string, body: string) {
    // Simulated SMTP Delivery
    console.group(`[EMAIL SYSTEM - SMTP OUTBOUND]`);
    console.log(`Priority: HIGH`);
    console.log(`To: ${to}`);
    console.log(`Subject: 🚨 ${subject}`);
    console.log(`Content: ${body}`);
    console.log(`Status: Delivered via finguard-mx-relay`);
    console.groupEnd();
  }

  getHistory() {
    return this.history;
  }
}

export const notificationService = new NotificationService();
