import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  style?: ViewStyle;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  onClear,
  style,
  value,
  onChangeText,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleTextChange = (text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    setInternalValue('');
    onChangeText?.('');
    onClear?.();
  };

  const handleSearch = () => {
    onSearch?.(internalValue);
  };

  const currentValue = value !== undefined ? value : internalValue;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666"
          value={currentValue}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {currentValue.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

