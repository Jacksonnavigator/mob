import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  label?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function StatusIndicator({
  status,
  label,
  size = 'medium',
  style,
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: '#00C853',
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          text: 'Online',
        };
      case 'offline':
        return {
          color: '#FF6B6B',
          icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
          text: 'Offline',
        };
      case 'warning':
        return {
          color: '#FFB74D',
          icon: 'warning' as keyof typeof Ionicons.glyphMap,
          text: 'Warning',
        };
      case 'error':
        return {
          color: '#F44336',
          icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
          text: 'Error',
        };
      default:
        return {
          color: '#666',
          icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
          text: 'Unknown',
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { iconSize: 12, textSize: 10, dotSize: 6 };
      case 'medium':
        return { iconSize: 16, textSize: 12, dotSize: 8 };
      case 'large':
        return { iconSize: 20, textSize: 14, dotSize: 10 };
      default:
        return { iconSize: 16, textSize: 12, dotSize: 8 };
    }
  };

  const config = getStatusConfig();
  const sizeConfig = getSizeConfig();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.indicatorContainer}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: config.color,
              width: sizeConfig.dotSize,
              height: sizeConfig.dotSize,
              borderRadius: sizeConfig.dotSize / 2,
            },
          ]}
        />
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: config.color,
                fontSize: sizeConfig.textSize,
              },
            ]}
          >
            {label}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginRight: 6,
  },
  label: {
    fontWeight: '600',
  },
});

