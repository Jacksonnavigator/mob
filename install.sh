#!/bin/bash

# Smart Energy Monitor App - Installation Script

echo "🚀 Installing Smart Energy Monitor App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g @expo/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p assets
mkdir -p src/components
mkdir -p src/utils

# Set up Firebase configuration
echo "🔥 Setting up Firebase configuration..."
echo "⚠️  Please update src/services/firebase.ts with your Firebase configuration"

# Set up Expo project
echo "⚙️  Setting up Expo project..."
npx expo install --fix

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update src/services/firebase.ts with your Firebase configuration"
echo "2. Create app icons and splash screen in the assets/ directory"
echo "3. Run 'npm start' to start the development server"
echo "4. Scan the QR code with Expo Go app on your phone"
echo ""
echo "For more information, see README.md"
