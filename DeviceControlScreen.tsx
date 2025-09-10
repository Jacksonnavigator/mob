import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph, Switch, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import SearchBar from '../components/SearchBar';
import StatusIndicator from '../components/StatusIndicator';

const { width } = Dimensions.get('window');

interface Device {
  id: string;
  name: string;
  type: string;
  isOnline: boolean;
  isOn: boolean;
  currentPower: number;
  todayEnergy: number;
  model: string;
  energyRating: string;
}

export default function DeviceControlScreen({ navigation }: any) {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Living Room AC',
      type: 'Air Conditioner',
      isOnline: true,
      isOn: true,
      currentPower: 850,
      todayEnergy: 6.2,
      model: 'Samsung AR12',
      energyRating: 'A++',
    },
    {
      id: '2',
      name: 'Refrigerator',
      type: 'Refrigerator',
      isOnline: true,
      isOn: true,
      currentPower: 120,
      todayEnergy: 2.8,
      model: 'LG LFXS28968S',
      energyRating: 'A+',
    },
    {
      id: '3',
      name: 'Washing Machine',
      type: 'Washing Machine',
      isOnline: true,
      isOn: false,
      currentPower: 0,
      todayEnergy: 1.5,
      model: 'Whirlpool WTW5000DW',
      energyRating: 'A',
    },
    {
      id: '4',
      name: 'Kitchen Lights',
      type: 'Lighting',
      isOnline: true,
      isOn: true,
      currentPower: 45,
      todayEnergy: 0.8,
      model: 'Philips Hue',
      energyRating: 'A+',
    },
    {
      id: '5',
      name: 'Water Heater',
      type: 'Water Heater',
      isOnline: false,
      isOn: false,
      currentPower: 0,
      todayEnergy: 0,
      model: 'Rheem RTEX-13',
      energyRating: 'B',
    },
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const toggleDevice = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? { ...device, isOn: !device.isOn, currentPower: device.isOn ? 0 : device.currentPower }
          : device
      )
    );
  };

  const toggleAllDevices = (turnOn: boolean) => {
    setDevices(prevDevices =>
      prevDevices.map(device => ({
        ...device,
        isOn: turnOn && device.isOnline,
        currentPower: turnOn && device.isOnline ? device.currentPower : 0,
      }))
    );
  };

  const openDeviceDetails = (device: Device) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  const DeviceCard = ({ device }: { device: Device }) => (
    <TouchableOpacity onPress={() => openDeviceDetails(device)}>
      <Card style={[styles.deviceCard, !device.isOnline && styles.offlineCard]}>
        <Card.Content style={styles.deviceCardContent}>
          <View style={styles.deviceHeader}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceType}>{device.type}</Text>
            </View>
            <StatusIndicator
              status={device.isOnline ? 'online' : 'offline'}
              label={device.isOnline ? 'Online' : 'Offline'}
              size="small"
            />
          </View>

          <View style={styles.deviceMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Power</Text>
              <Text style={styles.metricValue}>{device.currentPower}W</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Today</Text>
              <Text style={styles.metricValue}>{device.todayEnergy}kWh</Text>
            </View>
          </View>

          <View style={styles.deviceControls}>
            <Switch
              value={device.isOn}
              onValueChange={() => toggleDevice(device.id)}
              disabled={!device.isOnline}
              color="#00C853"
            />
            <Text style={styles.switchLabel}>
              {device.isOn ? 'ON' : 'OFF'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const DeviceDetailsModal = () => (
    <Modal
      visible={showDeviceModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowDeviceModal(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Device Details</Text>
        </View>

        {selectedDevice && (
          <ScrollView style={styles.modalContent}>
            <Card style={styles.detailCard}>
              <Card.Content>
                <Title style={styles.detailTitle}>{selectedDevice.name}</Title>
                <Paragraph style={styles.detailSubtitle}>{selectedDevice.type}</Paragraph>
                
                <View style={styles.detailInfo}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Model:</Text>
                    <Text style={styles.detailValue}>{selectedDevice.model}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Energy Rating:</Text>
                    <Text style={styles.detailValue}>{selectedDevice.energyRating}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: selectedDevice.isOnline ? '#00C853' : '#FF6B6B' }]}>
                      {selectedDevice.isOnline ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                </View>

                <View style={styles.powerChart}>
                  <Title style={styles.chartTitle}>Power Usage (Last 24 Hours)</Title>
                  <LineChart
                    data={{
                      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                      datasets: [{
                        data: [0, 0, 0, selectedDevice.currentPower, selectedDevice.currentPower, 0],
                        color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
                        strokeWidth: 3,
                      }],
                    }}
                    width={width - 60}
                    height={200}
                    chartConfig={{
                      backgroundColor: '#1a1a1a',
                      backgroundGradientFrom: '#1a1a1a',
                      backgroundGradientTo: '#2d2d2d',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>

                <View style={styles.modalControls}>
                  <Switch
                    value={selectedDevice.isOn}
                    onValueChange={() => {
                      toggleDevice(selectedDevice.id);
                      setSelectedDevice({ ...selectedDevice, isOn: !selectedDevice.isOn });
                    }}
                    disabled={!selectedDevice.isOnline}
                    color="#00C853"
                  />
                  <Text style={styles.switchLabel}>
                    {selectedDevice.isOn ? 'Turn OFF' : 'Turn ON'}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        )}
      </LinearGradient>
    </Modal>
  );

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../logo.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Device Control</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {/* Handle search */}}
          >
            <Ionicons name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {/* Handle filter */}}
          >
            <Ionicons name="filter-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search devices..."
          style={styles.searchBar}
        />

        {/* Bulk Controls */}
        <Card style={styles.bulkControlCard}>
          <Card.Content>
            <Title style={styles.bulkTitle}>Bulk Control</Title>
            <View style={styles.bulkButtons}>
              <Button
                mode="contained"
                onPress={() => toggleAllDevices(true)}
                style={[styles.bulkButton, styles.turnOnButton]}
                labelStyle={styles.bulkButtonText}
              >
                Turn All ON
              </Button>
              <Button
                mode="contained"
                onPress={() => toggleAllDevices(false)}
                style={[styles.bulkButton, styles.turnOffButton]}
                labelStyle={styles.bulkButtonText}
              >
                Turn All OFF
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Device List */}
        <View style={styles.devicesContainer}>
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </View>
      </ScrollView>

      <DeviceDetailsModal />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  filterButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchBar: {
    marginBottom: 16,
  },
  bulkControlCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
    borderRadius: 12,
  },
  bulkTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bulkButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bulkButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  turnOnButton: {
    backgroundColor: '#00C853',
  },
  turnOffButton: {
    backgroundColor: '#FF6B6B',
  },
  bulkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesContainer: {
    paddingBottom: 20,
  },
  deviceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
    borderRadius: 12,
  },
  offlineCard: {
    opacity: 0.6,
  },
  deviceCardContent: {
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  deviceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  deviceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 20,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailSubtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: 20,
  },
  detailInfo: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  powerChart: {
    marginBottom: 20,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  modalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
