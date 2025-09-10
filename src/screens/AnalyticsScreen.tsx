import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph, SegmentedButtons } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen({ navigation }: any) {
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [selectedView, setSelectedView] = useState('consumption');

  const [analyticsData, setAnalyticsData] = useState({
    hourly: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{
        data: [0.5, 0.3, 0.8, 1.2, 1.5, 1.8],
        color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
        strokeWidth: 3,
      }],
    },
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [12.5, 15.2, 13.8, 16.1, 14.9, 18.3, 17.2],
        color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
        strokeWidth: 3,
      }],
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        data: [95.2, 102.8, 98.5, 105.3],
        color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
        strokeWidth: 3,
      }],
    },
    deviceComparison: {
      labels: ['AC Unit', 'Refrigerator', 'Washing Machine', 'Lights', 'Other'],
      data: [35, 25, 20, 12, 8],
    },
    predictions: {
      nextHour: 1.8,
      nextDay: 16.5,
      nextWeek: 108.2,
      costSavings: 12.5,
    },
  });

  const chartConfig = {
    backgroundColor: '#1a1a1a',
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#2d2d2d',
    decimalPlaces: 1,
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

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'hour':
        return analyticsData.hourly;
      case 'day':
        return analyticsData.daily;
      case 'week':
        return analyticsData.weekly;
      default:
        return analyticsData.daily;
    }
  };

  const exportData = async () => {
    try {
      const data = {
        period: selectedPeriod,
        view: selectedView,
        timestamp: new Date().toISOString(),
        data: getCurrentData(),
      };
      
      await Share.share({
        message: `Energy Analytics Report\nPeriod: ${selectedPeriod}\nData: ${JSON.stringify(data, null, 2)}`,
        title: 'Energy Analytics Export',
      });
    } catch (error) {
      console.error('Error sharing data:', error);
    }
  };

  const StatCard = ({ title, value, unit, icon, color, trend }: any) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statCardContent}>
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={20} color={color} />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={styles.statValue}>
          {value} <Text style={styles.statUnit}>{unit}</Text>
        </Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={trend > 0 ? "trending-up" : "trending-down"} 
              size={16} 
              color={trend > 0 ? "#00C853" : "#FF6B6B"} 
            />
            <Text style={[styles.trendText, { color: trend > 0 ? "#00C853" : "#FF6B6B" }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const PredictionCard = ({ title, value, unit, icon, color }: any) => (
    <Card style={[styles.predictionCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.predictionContent}>
        <View style={styles.predictionHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={styles.predictionTitle}>{title}</Text>
        </View>
        <Text style={styles.predictionValue}>
          {value} <Text style={styles.predictionUnit}>{unit}</Text>
        </Text>
      </Card.Content>
    </Card>
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
          <Text style={styles.title}>Energy Analytics</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.periodButton}
            onPress={() => {/* Handle period selection */}}
          >
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
            <Text style={styles.periodText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={exportData} style={styles.exportButton}>
            <Ionicons name="download-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Period Selection */}
        <Card style={styles.periodCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Time Period</Title>
            <SegmentedButtons
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
              buttons={[
                { value: 'hour', label: 'Hourly' },
                { value: 'day', label: 'Daily' },
                { value: 'week', label: 'Weekly' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Consumption"
            value={selectedPeriod === 'hour' ? '1.2' : selectedPeriod === 'day' ? '15.6' : '95.2'}
            unit={selectedPeriod === 'hour' ? 'kWh' : selectedPeriod === 'day' ? 'kWh' : 'kWh'}
            icon="battery-half"
            color="#00C853"
            trend={5.2}
          />
          <StatCard
            title="Peak Usage"
            value={selectedPeriod === 'hour' ? '1.8' : selectedPeriod === 'day' ? '2.1' : '18.3'}
            unit="kWh"
            icon="trending-up"
            color="#FFB74D"
            trend={-2.1}
          />
          <StatCard
            title="Average Cost"
            value={selectedPeriod === 'hour' ? '0.18' : selectedPeriod === 'day' ? '2.34' : '14.28'}
            unit="$"
            icon="cash"
            color="#4CAF50"
            trend={3.8}
          />
          <StatCard
            title="Efficiency Score"
            value="85"
            unit="%"
            icon="star"
            color="#81C784"
            trend={2.5}
          />
        </View>

        {/* Main Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>
              Energy Consumption - {selectedPeriod === 'hour' ? 'Last Hour' : selectedPeriod === 'day' ? 'Last 7 Days' : 'Last 4 Weeks'}
            </Title>
            <LineChart
              data={getCurrentData()}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Device Comparison */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Device Energy Usage Comparison</Title>
            <BarChart
              data={analyticsData.deviceComparison}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* AI Predictions */}
        <Card style={styles.predictionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>AI Predictions & Insights</Title>
            <View style={styles.predictionsContainer}>
              <PredictionCard
                title="Next Hour"
                value={analyticsData.predictions.nextHour}
                unit="kWh"
                icon="time"
                color="#00C853"
              />
              <PredictionCard
                title="Tomorrow"
                value={analyticsData.predictions.nextDay}
                unit="kWh"
                icon="calendar"
                color="#4CAF50"
              />
              <PredictionCard
                title="Next Week"
                value={analyticsData.predictions.nextWeek}
                unit="kWh"
                icon="trending-up"
                color="#81C784"
              />
              <PredictionCard
                title="Potential Savings"
                value={analyticsData.predictions.costSavings}
                unit="$/month"
                icon="bulb"
                color="#FFB74D"
              />
            </View>
          </Card.Content>
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Energy Saving Recommendations</Title>
            <View style={styles.recommendationsList}>
              <View style={styles.recommendationItem}>
                <Ionicons name="bulb" size={20} color="#FFB74D" />
                <Text style={styles.recommendationText}>
                  Turn off AC during peak hours (2-6 PM) to save $15/month
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Ionicons name="refresh" size={20} color="#4CAF50" />
                <Text style={styles.recommendationText}>
                  Run washing machine during off-peak hours
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Ionicons name="settings" size={20} color="#00C853" />
                <Text style={styles.recommendationText}>
                  Enable smart scheduling for water heater
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  periodText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  exportButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  periodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statCard: {
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderLeftWidth: 4,
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  statCardContent: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#B0B0B0',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
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
  predictionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
    borderRadius: 12,
  },
  predictionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  predictionCard: {
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderLeftWidth: 4,
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  predictionContent: {
    padding: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionTitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 8,
  },
  predictionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  predictionUnit: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  recommendationsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
    borderRadius: 12,
  },
  recommendationsList: {
    marginTop: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
});
