import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph } from 'react-native-paper';
import EnhancedCard from '../components/EnhancedCard';
import FloatingActionButton from '../components/FloatingActionButton';
import NotificationPanel from '../components/NotificationPanel';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [energyData, setEnergyData] = useState({
    currentPower: 1250,
    todayEnergy: 15.6,
    todayCost: 2.34,
    onlineDevices: 8,
    totalDevices: 12,
  });

  const [chartData, setChartData] = useState({
    powerHistory: {
      labels: ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15'],
      datasets: [
        {
          data: [1200, 1350, 1100, 1250, 1300, 1250],
          color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    },
    deviceUsage: [
      { name: 'AC Unit', population: 35, color: '#00C853', legendFontColor: '#FFFFFF' },
      { name: 'Refrigerator', population: 25, color: '#4CAF50', legendFontColor: '#FFFFFF' },
      { name: 'Washing Machine', population: 20, color: '#81C784', legendFontColor: '#FFFFFF' },
      { name: 'Other', population: 20, color: '#A5D6A7', legendFontColor: '#FFFFFF' },
    ],
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const chartConfig = {
    backgroundColor: '#1a1a1a',
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#2d2d2d',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#00C853',
    },
  };

  const SummaryCard = ({ title, value, unit, icon, color, onPress, trend, badge }: any) => (
    <View style={styles.cardContainer}>
      <EnhancedCard
        title={title}
        value={value}
        unit={unit}
        icon={icon}
        color={color}
        onPress={onPress}
        trend={trend}
        badge={badge}
        style={styles.enhancedCard}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../../logo.png')} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => setShowNotifications(true)}
            >
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => navigation.navigate('AIAssistant')}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#00C853" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsContainer}>
          <SummaryCard
            title="Current Power"
            value={energyData.currentPower}
            unit="W"
            icon="flash"
            color="#00C853"
            onPress={() => navigation.navigate('Analytics')}
            trend={{ value: 5.2, isPositive: true }}
            badge="Live"
          />
          <SummaryCard
            title="Today's Energy"
            value={energyData.todayEnergy}
            unit="kWh"
            icon="battery-half"
            color="#4CAF50"
            onPress={() => navigation.navigate('Analytics')}
            trend={{ value: 2.1, isPositive: false }}
          />
          <SummaryCard
            title="Today's Cost"
            value={energyData.todayCost}
            unit="$"
            icon="cash"
            color="#FFB74D"
            onPress={() => navigation.navigate('Analytics')}
            trend={{ value: 3.8, isPositive: true }}
          />
          <SummaryCard
            title="Online Devices"
            value={`${energyData.onlineDevices}/${energyData.totalDevices}`}
            unit=""
            icon="hardware-chip"
            color="#81C784"
            onPress={() => navigation.navigate('Devices')}
            badge="Active"
          />
        </View>

        {/* Power Usage Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Power Usage (Last Hour)</Title>
            <LineChart
              data={chartData.powerHistory}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Device Usage Pie Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Energy Usage by Device</Title>
            <PieChart
              data={chartData.deviceUsage}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Devices')}
          >
            <Ionicons name="hardware-chip" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Device Control</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Ionicons name="analytics" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating AI Assistant Button */}
      <FloatingActionButton
        onPress={() => navigation.navigate('AIAssistant')}
        icon="chatbubble"
        color="#00C853"
        badge="3"
      />

      {/* Notification Panel */}
      <NotificationPanel
        visible={showNotifications}
        notifications={[
          {
            id: '1',
            title: 'High Energy Usage',
            message: 'AC Unit is consuming more power than usual',
            type: 'warning',
            timestamp: new Date(),
            isRead: false,
          },
          {
            id: '2',
            title: 'Device Offline',
            message: 'Water Heater has gone offline',
            type: 'error',
            timestamp: new Date(Date.now() - 300000),
            isRead: false,
          },
          {
            id: '3',
            title: 'Energy Saved',
            message: 'You saved 15% energy this week!',
            type: 'success',
            timestamp: new Date(Date.now() - 600000),
            isRead: true,
          },
        ]}
        onNotificationPress={(notification) => {
          console.log('Notification pressed:', notification);
          setShowNotifications(false);
        }}
        onMarkAllRead={() => {
          console.log('Mark all read');
        }}
        onClose={() => setShowNotifications(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiButton: {
    padding: 8,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardContainer: {
    width: '50%',
    padding: 5,
  },
  enhancedCard: {
    margin: 0,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.3)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});
