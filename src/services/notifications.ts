import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  type: 'energy_alert' | 'device_offline' | 'high_usage' | 'ai_recommendation' | 'cost_alert';
}

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  static async getPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  static async scheduleLocalNotification(notificationData: NotificationData, delay: number = 0) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: delay > 0 ? { seconds: delay } : null,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async sendEnergyAlert(currentUsage: number, threshold: number) {
    const notificationData: NotificationData = {
      title: '⚡ High Energy Usage Alert',
      body: `Current usage: ${currentUsage}W exceeds threshold: ${threshold}W`,
      type: 'energy_alert',
      data: { currentUsage, threshold },
    };

    await this.scheduleLocalNotification(notificationData);
  }

  static async sendDeviceOfflineAlert(deviceName: string) {
    const notificationData: NotificationData = {
      title: '🔌 Device Offline',
      body: `${deviceName} has gone offline`,
      type: 'device_offline',
      data: { deviceName },
    };

    await this.scheduleLocalNotification(notificationData);
  }

  static async sendHighUsageAlert(deviceName: string, powerUsage: number) {
    const notificationData: NotificationData = {
      title: '⚠️ High Power Usage',
      body: `${deviceName} is consuming ${powerUsage}W - higher than normal`,
      type: 'high_usage',
      data: { deviceName, powerUsage },
    };

    await this.scheduleLocalNotification(notificationData);
  }

  static async sendAIRecommendation(recommendation: string) {
    const notificationData: NotificationData = {
      title: '🤖 AI Recommendation',
      body: recommendation,
      type: 'ai_recommendation',
      data: { recommendation },
    };

    await this.scheduleLocalNotification(notificationData);
  }

  static async sendCostAlert(dailyCost: number, budget: number) {
    const notificationData: NotificationData = {
      title: '💰 Cost Alert',
      body: `Daily cost $${dailyCost.toFixed(2)} is approaching budget $${budget}`,
      type: 'cost_alert',
      data: { dailyCost, budget },
    };

    await this.scheduleLocalNotification(notificationData);
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

// Export default instance
export default NotificationService;
