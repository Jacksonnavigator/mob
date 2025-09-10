// IoT Integration Service for Smart Energy Monitor
// This service handles MQTT connections and device communication

export interface DeviceData {
  id: string;
  name: string;
  type: string;
  isOnline: boolean;
  isOn: boolean;
  currentPower: number;
  voltage: number;
  current: number;
  energyToday: number;
  timestamp: Date;
}

export interface TelemetryData {
  deviceId: string;
  power: number;
  voltage: number;
  current: number;
  energy: number;
  timestamp: Date;
}

export class IoTService {
  private static instance: IoTService;
  private mqttClient: any = null;
  private isConnected: boolean = false;
  private deviceData: Map<string, DeviceData> = new Map();
  private subscribers: Map<string, (data: DeviceData) => void> = new Map();

  private constructor() {
    this.initializeMQTT();
  }

  static getInstance(): IoTService {
    if (!IoTService.instance) {
      IoTService.instance = new IoTService();
    }
    return IoTService.instance;
  }

  private async initializeMQTT() {
    try {
      // In a real implementation, you would use a proper MQTT library
      // For now, we'll simulate the connection
      console.log('Initializing MQTT connection...');
      
      // Simulate connection after 2 seconds
      setTimeout(() => {
        this.isConnected = true;
        this.startSimulation();
        console.log('MQTT connected successfully');
      }, 2000);
    } catch (error) {
      console.error('Failed to initialize MQTT:', error);
    }
  }

  private startSimulation() {
    // Simulate real-time device data updates
    setInterval(() => {
      this.simulateDeviceData();
    }, 5000); // Update every 5 seconds
  }

  private simulateDeviceData() {
    const devices = [
      { id: '1', name: 'Living Room AC', type: 'Air Conditioner', basePower: 850 },
      { id: '2', name: 'Refrigerator', type: 'Refrigerator', basePower: 120 },
      { id: '3', name: 'Washing Machine', type: 'Washing Machine', basePower: 0 },
      { id: '4', name: 'Kitchen Lights', type: 'Lighting', basePower: 45 },
      { id: '5', name: 'Water Heater', type: 'Water Heater', basePower: 0 },
    ];

    devices.forEach(device => {
      const isOn = Math.random() > 0.3; // 70% chance device is on
      const currentPower = isOn ? device.basePower + (Math.random() - 0.5) * 50 : 0;
      const voltage = 120 + (Math.random() - 0.5) * 10; // 115-125V
      const current = currentPower / voltage;
      const energyToday = Math.random() * 5; // Random energy for today

      const deviceData: DeviceData = {
        id: device.id,
        name: device.name,
        type: device.type,
        isOnline: Math.random() > 0.1, // 90% chance online
        isOn,
        currentPower: Math.max(0, currentPower),
        voltage,
        current,
        energyToday,
        timestamp: new Date(),
      };

      this.deviceData.set(device.id, deviceData);
      this.notifySubscribers(device.id, deviceData);
    });
  }

  private notifySubscribers(deviceId: string, data: DeviceData) {
    const callback = this.subscribers.get(deviceId);
    if (callback) {
      callback(data);
    }

    // Also notify general subscribers
    const generalCallback = this.subscribers.get('*');
    if (generalCallback) {
      generalCallback(data);
    }
  }

  // Public methods
  public isMQTTConnected(): boolean {
    return this.isConnected;
  }

  public getDeviceData(deviceId: string): DeviceData | undefined {
    return this.deviceData.get(deviceId);
  }

  public getAllDevices(): DeviceData[] {
    return Array.from(this.deviceData.values());
  }

  public subscribeToDevice(deviceId: string, callback: (data: DeviceData) => void): void {
    this.subscribers.set(deviceId, callback);
  }

  public subscribeToAllDevices(callback: (data: DeviceData) => void): void {
    this.subscribers.set('*', callback);
  }

  public unsubscribeFromDevice(deviceId: string): void {
    this.subscribers.delete(deviceId);
  }

  public async sendDeviceCommand(deviceId: string, command: 'ON' | 'OFF'): Promise<boolean> {
    try {
      console.log(`Sending command ${command} to device ${deviceId}`);
      
      // In a real implementation, this would send MQTT message
      // For simulation, we'll update the device state directly
      const device = this.deviceData.get(deviceId);
      if (device) {
        device.isOn = command === 'ON';
        device.currentPower = command === 'ON' ? device.currentPower : 0;
        device.timestamp = new Date();
        
        this.deviceData.set(deviceId, device);
        this.notifySubscribers(deviceId, device);
      }

      return true;
    } catch (error) {
      console.error('Failed to send device command:', error);
      return false;
    }
  }

  public async sendBulkCommand(command: 'ON' | 'OFF'): Promise<boolean> {
    try {
      console.log(`Sending bulk command ${command} to all devices`);
      
      const devices = this.getAllDevices();
      const promises = devices
        .filter(device => device.isOnline)
        .map(device => this.sendDeviceCommand(device.id, command));

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Failed to send bulk command:', error);
      return false;
    }
  }

  public async addDevice(deviceInfo: {
    name: string;
    type: string;
    model?: string;
  }): Promise<string> {
    const deviceId = Date.now().toString();
    const deviceData: DeviceData = {
      id: deviceId,
      name: deviceInfo.name,
      type: deviceInfo.type,
      isOnline: true,
      isOn: false,
      currentPower: 0,
      voltage: 120,
      current: 0,
      energyToday: 0,
      timestamp: new Date(),
    };

    this.deviceData.set(deviceId, deviceData);
    this.notifySubscribers(deviceId, deviceData);

    return deviceId;
  }

  public async removeDevice(deviceId: string): Promise<boolean> {
    try {
      this.deviceData.delete(deviceId);
      this.subscribers.delete(deviceId);
      return true;
    } catch (error) {
      console.error('Failed to remove device:', error);
      return false;
    }
  }

  public getTotalPowerConsumption(): number {
    return Array.from(this.deviceData.values())
      .filter(device => device.isOnline && device.isOn)
      .reduce((total, device) => total + device.currentPower, 0);
  }

  public getTotalEnergyToday(): number {
    return Array.from(this.deviceData.values())
      .reduce((total, device) => total + device.energyToday, 0);
  }

  public getOnlineDeviceCount(): number {
    return Array.from(this.deviceData.values())
      .filter(device => device.isOnline).length;
  }

  public getTotalDeviceCount(): number {
    return this.deviceData.size;
  }

  // Disconnect and cleanup
  public disconnect(): void {
    this.isConnected = false;
    this.deviceData.clear();
    this.subscribers.clear();
    console.log('IoT service disconnected');
  }
}

// Export singleton instance
export default IoTService.getInstance();
