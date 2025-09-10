import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DeviceData } from '../services/iotService';
import { EnergyData, AIInsight } from '../services/dataService';
import IoTService from '../services/iotService';
import DataService from '../services/dataService';
import NotificationService from '../services/notifications';

interface AppContextType {
  // Device data
  devices: DeviceData[];
  currentEnergyData: EnergyData | null;
  isLoading: boolean;
  
  // AI insights
  aiInsights: AIInsight[];
  
  // Actions
  toggleDevice: (deviceId: string) => Promise<boolean>;
  toggleAllDevices: (turnOn: boolean) => Promise<boolean>;
  addDevice: (deviceInfo: { name: string; type: string; model?: string }) => Promise<string>;
  removeDevice: (deviceId: string) => Promise<boolean>;
  
  // Notifications
  sendNotification: (type: string, data: any) => Promise<void>;
  
  // Data refresh
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [currentEnergyData, setCurrentEnergyData] = useState<EnergyData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Request notification permissions
      await NotificationService.requestPermissions();
      
      // Subscribe to IoT device updates
      IoTService.subscribeToAllDevices((deviceData: DeviceData) => {
        setDevices(prevDevices => {
          const updatedDevices = [...prevDevices];
          const existingIndex = updatedDevices.findIndex(d => d.id === deviceData.id);
          
          if (existingIndex >= 0) {
            updatedDevices[existingIndex] = deviceData;
          } else {
            updatedDevices.push(deviceData);
          }
          
          return updatedDevices;
        });
      });

      // Update energy data when devices change
      const updateEnergyData = () => {
        const currentDevices = IoTService.getAllDevices();
        const energyData = DataService.updateEnergyData(currentDevices);
        setCurrentEnergyData(energyData);
        setAiInsights(DataService.getRecentInsights(10));
      };

      // Initial data load
      updateEnergyData();
      
      // Set up periodic updates
      const interval = setInterval(updateEnergyData, 30000); // Update every 30 seconds
      
      setIsLoading(false);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  const toggleDevice = async (deviceId: string): Promise<boolean> => {
    try {
      const device = devices.find(d => d.id === deviceId);
      if (!device) return false;

      const command = device.isOn ? 'OFF' : 'ON';
      const success = await IoTService.sendDeviceCommand(deviceId, command);
      
      if (success) {
        // Send notification
        await NotificationService.scheduleLocalNotification({
          title: 'Device Control',
          body: `${device.name} turned ${command}`,
          type: 'device_offline',
          data: { deviceId, command },
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error toggling device:', error);
      return false;
    }
  };

  const toggleAllDevices = async (turnOn: boolean): Promise<boolean> => {
    try {
      const command = turnOn ? 'ON' : 'OFF';
      const success = await IoTService.sendBulkCommand(command);
      
      if (success) {
        await NotificationService.scheduleLocalNotification({
          title: 'Bulk Control',
          body: `All devices turned ${command}`,
          type: 'device_offline',
          data: { command },
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error toggling all devices:', error);
      return false;
    }
  };

  const addDevice = async (deviceInfo: { name: string; type: string; model?: string }): Promise<string> => {
    try {
      const deviceId = await IoTService.addDevice(deviceInfo);
      return deviceId;
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  };

  const removeDevice = async (deviceId: string): Promise<boolean> => {
    try {
      const success = await IoTService.removeDevice(deviceId);
      if (success) {
        setDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
      }
      return success;
    } catch (error) {
      console.error('Error removing device:', error);
      return false;
    }
  };

  const sendNotification = async (type: string, data: any): Promise<void> => {
    try {
      switch (type) {
        case 'energy_alert':
          await NotificationService.sendEnergyAlert(data.currentUsage, data.threshold);
          break;
        case 'device_offline':
          await NotificationService.sendDeviceOfflineAlert(data.deviceName);
          break;
        case 'high_usage':
          await NotificationService.sendHighUsageAlert(data.deviceName, data.powerUsage);
          break;
        case 'ai_recommendation':
          await NotificationService.sendAIRecommendation(data.recommendation);
          break;
        case 'cost_alert':
          await NotificationService.sendCostAlert(data.dailyCost, data.budget);
          break;
        default:
          console.warn('Unknown notification type:', type);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const refreshData = () => {
    const currentDevices = IoTService.getAllDevices();
    const energyData = DataService.updateEnergyData(currentDevices);
    setCurrentEnergyData(energyData);
    setAiInsights(DataService.getRecentInsights(10));
  };

  const value: AppContextType = {
    devices,
    currentEnergyData,
    isLoading,
    aiInsights,
    toggleDevice,
    toggleAllDevices,
    addDevice,
    removeDevice,
    sendNotification,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
