# Smart Energy Monitor App

A comprehensive React Native application for monitoring, controlling, and analyzing household energy usage in real-time. Features IoT integration, AI-powered insights, and predictive analytics.

## Features

### 🔐 Authentication & Security
- Firebase Authentication with email/password
- Secure token storage
- Two-factor authentication support
- Persistent user sessions

### 📊 Real-time Dashboard
- Live energy consumption monitoring
- Interactive charts and graphs
- Summary cards with key metrics
- Pull-to-refresh functionality

### 🏠 Device Control
- Individual device control (ON/OFF)
- Bulk device operations
- Real-time device status
- Detailed device analytics
- Device management and configuration

### 📈 Energy Analytics
- Historical usage analysis
- Hourly, daily, and weekly views
- Device comparison charts
- AI-powered predictions
- Cost analysis and savings recommendations

### 🤖 AI Assistant
- Conversational interface
- Energy usage insights
- Cost-saving recommendations
- Predictive analytics
- Quick question templates

### 🔔 Notifications & Alerts
- Real-time energy alerts
- Device status notifications
- Usage threshold warnings
- AI-recommended actions

### ⚙️ Settings & Profile
- User profile management
- Device management
- Theme preferences (Dark/Light)
- Notification settings
- Security options

## Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation 6
- **UI Components**: React Native Paper
- **Charts**: React Native Chart Kit
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **State Management**: React Hooks
- **Styling**: StyleSheet with Linear Gradients
- **Icons**: Ionicons

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartEnergyMonitor
   ```

2. **Install dependencies**
   ```bash
   ./install.sh
   # or manually: npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `src/services/firebase.ts` with your config

4. **Run the application**
   ```bash
   npm start
   ```

## Logo Integration

The app uses your custom logo (`logo.png`) throughout the interface:
- **Splash Screen**: Large logo with animation
- **Authentication**: Logo in header
- **Home Dashboard**: Logo in header with greeting
- **AI Assistant**: Logo in header
- **Settings**: Logo in header
- **App Icon**: Used as app icon for iOS/Android
- **Splash Screen**: Used as splash screen image

The logo is automatically resized and styled appropriately for each context.

## Project Structure

```
src/
├── screens/           # All screen components
│   ├── SplashScreen.tsx
│   ├── AuthScreen.tsx
│   ├── HomeScreen.tsx
│   ├── DeviceControlScreen.tsx
│   ├── AnalyticsScreen.tsx
│   ├── AIAssistantScreen.tsx
│   └── SettingsScreen.tsx
├── services/          # Backend services
│   └── firebase.ts
├── theme/            # Theme configuration
│   └── theme.ts
└── components/       # Reusable components
```

## Key Features Implementation

### Real-time Data
- MQTT/WebSocket integration for live telemetry
- Cloud database synchronization
- Offline data caching

### AI Integration
- Local prediction algorithms
- Cloud AI API integration
- Natural language processing for chat interface

### IoT Integration
- ESP32/Raspberry Pi microcontroller support
- Smart plug and sensor integration
- MQTT protocol for device communication

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Dark/Light theme support

## Future Enhancements

- Voice control integration (Alexa/Google Assistant)
- Advanced machine learning predictions
- Energy cost forecasting
- Gamification features
- Smart automation rules
- Multi-user household support
- Energy trading capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
