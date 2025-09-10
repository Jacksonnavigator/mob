import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface EnhancedCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
  style?: ViewStyle;
  subtitle?: string;
  badge?: string;
}

export default function EnhancedCard({
  title,
  value,
  unit = '',
  icon,
  color,
  trend,
  onPress,
  style,
  subtitle,
  badge,
}: EnhancedCardProps) {
  const CardContent = () => (
    <View style={[styles.card, style]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
        style={styles.gradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          {badge && (
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          
          <View style={styles.valueContainer}>
            <Text style={styles.value}>
              {value} <Text style={styles.unit}>{unit}</Text>
            </Text>
            {trend && (
              <View style={styles.trendContainer}>
                <Ionicons
                  name={trend.isPositive ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={trend.isPositive ? '#00C853' : '#FF6B6B'}
                />
                <Text
                  style={[
                    styles.trendText,
                    { color: trend.isPositive ? '#00C853' : '#FF6B6B' }
                  ]}
                >
                  {Math.abs(trend.value)}%
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.indicator, { backgroundColor: color }]} />
        </View>
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
    minHeight: 120,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unit: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardFooter: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  indicator: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },
});

