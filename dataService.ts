// Data Service for Smart Energy Monitor
// Centralized data management and state handling

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceData } from './iotService';

export interface EnergyData {
  timestamp: Date;
  totalPower: number;
  totalEnergy: number;
  totalCost: number;
  onlineDevices: number;
  totalDevices: number;
}

export interface HistoricalData {
  hourly: EnergyData[];
  daily: EnergyData[];
  weekly: EnergyData[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  units: {
    energy: 'kWh' | 'Wh';
    power: 'W' | 'kW';
    currency: 'USD' | 'EUR' | 'GBP';
  };
  thresholds: {
    maxPower: number;
    maxDailyCost: number;
    maxDailyEnergy: number;
  };
  location: string;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'alert';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionable: boolean;
  actionText?: string;
}

export class DataService {
  private static instance: DataService;
  private energyData: EnergyData[] = [];
  private historicalData: HistoricalData = {
    hourly: [],
    daily: [],
    weekly: [],
  };
  private userPreferences: UserPreferences = {
    theme: 'dark',
    notifications: true,
    units: {
      energy: 'kWh',
      power: 'W',
      currency: 'USD',
    },
    thresholds: {
      maxPower: 2000,
      maxDailyCost: 10,
      maxDailyEnergy: 20,
    },
    location: 'San Francisco, CA',
  };
  private aiInsights: AIInsight[] = [];

  private constructor() {
    this.loadData();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Data loading and saving
  private async loadData(): Promise<void> {
    try {
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      if (savedPreferences) {
        this.userPreferences = JSON.parse(savedPreferences);
      }

      const savedHistoricalData = await AsyncStorage.getItem('historicalData');
      if (savedHistoricalData) {
        this.historicalData = JSON.parse(savedHistoricalData);
      }

      const savedInsights = await AsyncStorage.getItem('aiInsights');
      if (savedInsights) {
        this.aiInsights = JSON.parse(savedInsights);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private async saveData(): Promise<void> {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
      await AsyncStorage.setItem('historicalData', JSON.stringify(this.historicalData));
      await AsyncStorage.setItem('aiInsights', JSON.stringify(this.aiInsights));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Energy data management
  public updateEnergyData(devices: DeviceData[]): EnergyData {
    const totalPower = devices
      .filter(device => device.isOnline && device.isOn)
      .reduce((total, device) => total + device.currentPower, 0);

    const totalEnergy = devices
      .reduce((total, device) => total + device.energyToday, 0);

    const totalCost = this.calculateCost(totalEnergy);
    const onlineDevices = devices.filter(device => device.isOnline).length;

    const energyData: EnergyData = {
      timestamp: new Date(),
      totalPower,
      totalEnergy,
      totalCost,
      onlineDevices,
      totalDevices: devices.length,
    };

    this.energyData.push(energyData);
    this.updateHistoricalData(energyData);
    this.generateAIInsights(energyData, devices);

    return energyData;
  }

  private calculateCost(energy: number): number {
    // Simple cost calculation - in real app, this would use actual rates
    const ratePerKWh = 0.15; // $0.15 per kWh
    return energy * ratePerKWh;
  }

  private updateHistoricalData(data: EnergyData): void {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDate();
    const week = Math.ceil(day / 7);

    // Update hourly data (keep last 24 hours)
    this.historicalData.hourly.push(data);
    if (this.historicalData.hourly.length > 24) {
      this.historicalData.hourly.shift();
    }

    // Update daily data (keep last 30 days)
    const existingDayIndex = this.historicalData.daily.findIndex(
      d => d.timestamp.getDate() === day
    );
    if (existingDayIndex >= 0) {
      this.historicalData.daily[existingDayIndex] = data;
    } else {
      this.historicalData.daily.push(data);
      if (this.historicalData.daily.length > 30) {
        this.historicalData.daily.shift();
      }
    }

    // Update weekly data (keep last 12 weeks)
    const existingWeekIndex = this.historicalData.weekly.findIndex(
      d => Math.ceil(d.timestamp.getDate() / 7) === week
    );
    if (existingWeekIndex >= 0) {
      this.historicalData.weekly[existingWeekIndex] = data;
    } else {
      this.historicalData.weekly.push(data);
      if (this.historicalData.weekly.length > 12) {
        this.historicalData.weekly.shift();
      }
    }

    this.saveData();
  }

  // AI Insights generation
  private generateAIInsights(energyData: EnergyData, devices: DeviceData[]): void {
    const insights: AIInsight[] = [];

    // High power usage alert
    if (energyData.totalPower > this.userPreferences.thresholds.maxPower) {
      insights.push({
        id: Date.now().toString(),
        type: 'alert',
        title: 'High Power Usage',
        description: `Current power consumption (${energyData.totalPower}W) exceeds your threshold (${this.userPreferences.thresholds.maxPower}W)`,
        priority: 'high',
        timestamp: new Date(),
        actionable: true,
        actionText: 'View devices',
      });
    }

    // High daily cost alert
    if (energyData.totalCost > this.userPreferences.thresholds.maxDailyCost) {
      insights.push({
        id: (Date.now() + 1).toString(),
        type: 'alert',
        title: 'High Daily Cost',
        description: `Today's cost ($${energyData.totalCost.toFixed(2)}) exceeds your budget ($${this.userPreferences.thresholds.maxDailyCost})`,
        priority: 'high',
        timestamp: new Date(),
        actionable: true,
        actionText: 'View analytics',
      });
    }

    // Device optimization recommendations
    const highPowerDevices = devices.filter(device => 
      device.isOn && device.currentPower > 500
    );
    if (highPowerDevices.length > 0) {
      insights.push({
        id: (Date.now() + 2).toString(),
        type: 'recommendation',
        title: 'Device Optimization',
        description: `${highPowerDevices.length} high-power devices are running. Consider scheduling them during off-peak hours.`,
        priority: 'medium',
        timestamp: new Date(),
        actionable: true,
        actionText: 'Optimize devices',
      });
    }

    // Energy saving tips
    if (energyData.totalPower < 1000) {
      insights.push({
        id: (Date.now() + 3).toString(),
        type: 'recommendation',
        title: 'Great Job!',
        description: 'Your current power usage is very efficient. Keep up the good work!',
        priority: 'low',
        timestamp: new Date(),
        actionable: false,
      });
    }

    this.aiInsights = [...insights, ...this.aiInsights].slice(0, 50); // Keep last 50 insights
    this.saveData();
  }

  // Getters
  public getCurrentEnergyData(): EnergyData | null {
    return this.energyData.length > 0 ? this.energyData[this.energyData.length - 1] : null;
  }

  public getHistoricalData(): HistoricalData {
    return this.historicalData;
  }

  public getUserPreferences(): UserPreferences {
    return this.userPreferences;
  }

  public getAIInsights(): AIInsight[] {
    return this.aiInsights;
  }

  public getRecentInsights(limit: number = 10): AIInsight[] {
    return this.aiInsights
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Setters
  public async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    await this.saveData();
  }

  public async updateThresholds(thresholds: Partial<UserPreferences['thresholds']>): Promise<void> {
    this.userPreferences.thresholds = { ...this.userPreferences.thresholds, ...thresholds };
    await this.saveData();
  }

  public async markInsightAsRead(insightId: string): Promise<void> {
    this.aiInsights = this.aiInsights.filter(insight => insight.id !== insightId);
    await this.saveData();
  }

  // Analytics helpers
  public getEnergyTrend(period: 'hour' | 'day' | 'week'): number {
    const data = this.historicalData[period === 'hour' ? 'hourly' : period === 'day' ? 'daily' : 'weekly'];
    if (data.length < 2) return 0;

    const recent = data[data.length - 1].totalEnergy;
    const previous = data[data.length - 2].totalEnergy;
    
    return ((recent - previous) / previous) * 100;
  }

  public getCostTrend(period: 'hour' | 'day' | 'week'): number {
    const data = this.historicalData[period === 'hour' ? 'hourly' : period === 'day' ? 'daily' : 'weekly'];
    if (data.length < 2) return 0;

    const recent = data[data.length - 1].totalCost;
    const previous = data[data.length - 2].totalCost;
    
    return ((recent - previous) / previous) * 100;
  }

  public getPeakUsageTime(): string {
    const hourlyData = this.historicalData.hourly;
    if (hourlyData.length === 0) return 'N/A';

    const peakHour = hourlyData.reduce((max, current) => 
      current.totalPower > max.totalPower ? current : max
    );

    return peakHour.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  public getAverageDailyUsage(): number {
    const dailyData = this.historicalData.daily;
    if (dailyData.length === 0) return 0;

    const total = dailyData.reduce((sum, day) => sum + day.totalEnergy, 0);
    return total / dailyData.length;
  }

  public getAverageDailyCost(): number {
    const dailyData = this.historicalData.daily;
    if (dailyData.length === 0) return 0;

    const total = dailyData.reduce((sum, day) => sum + day.totalCost, 0);
    return total / dailyData.length;
  }

  // Predictions
  public predictNextHourUsage(): number {
    const current = this.getCurrentEnergyData();
    if (!current) return 0;

    // Simple prediction based on current usage and time of day
    const hour = new Date().getHours();
    const multiplier = hour >= 6 && hour <= 22 ? 1.1 : 0.8; // Higher usage during day
    
    return current.totalEnergy * multiplier;
  }

  public predictNextDayUsage(): number {
    const average = this.getAverageDailyUsage();
    const trend = this.getEnergyTrend('day');
    
    return average * (1 + trend / 100);
  }

  public predictNextWeekUsage(): number {
    const average = this.getAverageDailyUsage();
    const trend = this.getEnergyTrend('week');
    
    return average * 7 * (1 + trend / 100);
  }

  // Export data
  public exportData(format: 'json' | 'csv'): string {
    const data = {
      energyData: this.energyData,
      historicalData: this.historicalData,
      userPreferences: this.userPreferences,
      aiInsights: this.aiInsights,
      exportDate: new Date().toISOString(),
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // Simple CSV export for energy data
      const csvHeader = 'Timestamp,Total Power,Total Energy,Total Cost,Online Devices\n';
      const csvRows = this.energyData.map(d => 
        `${d.timestamp.toISOString()},${d.totalPower},${d.totalEnergy},${d.totalCost},${d.onlineDevices}`
      ).join('\n');
      
      return csvHeader + csvRows;
    }
  }

  // Clear all data
  public async clearAllData(): Promise<void> {
    this.energyData = [];
    this.historicalData = { hourly: [], daily: [], weekly: [] };
    this.aiInsights = [];
    await AsyncStorage.clear();
  }
}

// Export singleton instance
export default DataService.getInstance();
