import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph, List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function SettingsScreen({ navigation }: any) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
  });
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
    model: '',
  });

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              await AsyncStorage.removeItem('authToken');
              navigation.replace('Auth');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const addDevice = () => {
    if (!newDevice.name || !newDevice.type) {
      Alert.alert('Error', 'Please fill in device name and type');
      return;
    }
    
    Alert.alert('Success', 'Device added successfully!');
    setNewDevice({ name: '', type: '', model: '' });
    setShowDeviceModal(false);
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    showArrow = true 
  }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#00C853" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent || (showArrow && <Ionicons name="chevron-forward" size={20} color="#666" />)}
      </View>
    </TouchableOpacity>
  );

  const ProfileModal = () => (
    <Modal
      visible={showProfileModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowProfileModal(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
        </View>

        <ScrollView style={styles.modalContent}>
          <Card style={styles.profileCard}>
            <Card.Content>
              <View style={styles.profileSection}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={userProfile.name}
                  onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={userProfile.email}
                  onChangeText={(text) => setUserProfile({ ...userProfile, email: text })}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.textInput}
                  value={userProfile.location}
                  onChangeText={(text) => setUserProfile({ ...userProfile, location: text })}
                  placeholder="Enter your location"
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={() => setShowProfileModal(false)}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );

  const DeviceModal = () => (
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
          <Text style={styles.modalTitle}>Add New Device</Text>
        </View>

        <ScrollView style={styles.modalContent}>
          <Card style={styles.deviceCard}>
            <Card.Content>
              <View style={styles.profileSection}>
                <Text style={styles.inputLabel}>Device Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={newDevice.name}
                  onChangeText={(text) => setNewDevice({ ...newDevice, name: text })}
                  placeholder="e.g., Living Room AC"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.inputLabel}>Device Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={newDevice.type}
                  onChangeText={(text) => setNewDevice({ ...newDevice, type: text })}
                  placeholder="e.g., Air Conditioner"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.inputLabel}>Model (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newDevice.model}
                  onChangeText={(text) => setNewDevice({ ...newDevice, model: text })}
                  placeholder="e.g., Samsung AR12"
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity style={styles.addButton} onPress={addDevice}>
                <Text style={styles.addButtonText}>Add Device</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </ScrollView>
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
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {/* Handle search */}}
          >
            <Ionicons name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Profile</Title>
            <SettingItem
              icon="person"
              title={userProfile.name}
              subtitle={userProfile.email}
              onPress={() => setShowProfileModal(true)}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="location"
              title="Location"
              subtitle={userProfile.location}
              onPress={() => setShowProfileModal(true)}
            />
          </Card.Content>
        </Card>

        {/* Device Management */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Device Management</Title>
            <SettingItem
              icon="hardware-chip"
              title="Add New Device"
              subtitle="Connect smart devices"
              onPress={() => setShowDeviceModal(true)}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="list"
              title="Manage Devices"
              subtitle="12 devices connected"
              onPress={() => navigation.navigate('DeviceControl')}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="wifi"
              title="Network Settings"
              subtitle="Configure IoT connection"
              onPress={() => Alert.alert('Info', 'Network settings coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Preferences */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Preferences</Title>
            <SettingItem
              icon="moon"
              title="Dark Mode"
              subtitle="Use dark theme"
              rightComponent={
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  color="#00C853"
                />
              }
              showArrow={false}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Energy alerts and updates"
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color="#00C853"
                />
              }
              showArrow={false}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="speedometer"
              title="Units"
              subtitle="kWh, Watts, $"
              onPress={() => Alert.alert('Info', 'Unit settings coming soon')}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="time"
              title="Time Zone"
              subtitle="Pacific Standard Time"
              onPress={() => Alert.alert('Info', 'Time zone settings coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Alerts & Thresholds */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Alerts & Thresholds</Title>
            <SettingItem
              icon="warning"
              title="Energy Thresholds"
              subtitle="Set usage limits"
              onPress={() => Alert.alert('Info', 'Threshold settings coming soon')}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="mail"
              title="Email Alerts"
              subtitle="Weekly reports"
              onPress={() => Alert.alert('Info', 'Email settings coming soon')}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="phone-portrait"
              title="Push Notifications"
              subtitle="Real-time alerts"
              onPress={() => Alert.alert('Info', 'Push notification settings coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Security */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Security</Title>
            <SettingItem
              icon="lock-closed"
              title="Change Password"
              subtitle="Update your password"
              onPress={() => Alert.alert('Info', 'Password change coming soon')}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="shield-checkmark"
              title="Two-Factor Authentication"
              subtitle="Enhanced security"
              onPress={() => Alert.alert('Info', '2FA setup coming soon')}
            />
          </Card.Content>
        </Card>

        {/* About */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>About</Title>
            <SettingItem
              icon="information-circle"
              title="App Version"
              subtitle="1.0.0"
              showArrow={false}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Get help and support"
              onPress={() => Alert.alert('Info', 'Help center coming soon')}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="document-text"
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              onPress={() => Alert.alert('Info', 'Privacy policy coming soon')}
            />
            <Divider style={styles.divider} />
            <SettingItem
              icon="document"
              title="Terms of Service"
              subtitle="Read our terms"
              onPress={() => Alert.alert('Info', 'Terms of service coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <ProfileModal />
      <DeviceModal />
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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionCard: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 16,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginLeft: 8,
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
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 20,
  },
  deviceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#00C853',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#00C853',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
