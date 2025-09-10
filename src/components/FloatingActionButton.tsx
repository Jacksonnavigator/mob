import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  size?: number;
  style?: ViewStyle;
  badge?: string;
}

export default function FloatingActionButton({
  onPress,
  icon,
  color = '#00C853',
  size = 56,
  style,
  badge,
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[color, color + 'DD']}
        style={[styles.gradient, { borderRadius: size / 2 }]}
      >
        <Ionicons name={icon} size={size * 0.4} color="#FFFFFF" />
        {badge && (
          <View style={styles.badge}>
            <Ionicons name="notifications" size={12} color="#FFFFFF" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

