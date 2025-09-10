import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'chart' | 'recommendation';
  data?: any;
}

export default function AIAssistantScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Smart Energy Assistant. I can help you analyze your energy usage, provide insights, and suggest ways to save energy. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickQuestions = [
    "Which device consumes the most energy?",
    "How much energy did I use yesterday?",
    "Predict tomorrow's energy consumption",
    "What are the best times to run my AC?",
    "How can I save money on electricity?",
    "Show me my weekly energy report",
  ];

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple AI responses based on keywords
    if (lowerMessage.includes('device') && lowerMessage.includes('most')) {
      return {
        id: Date.now().toString(),
        text: "Based on your current usage, your AC Unit is consuming the most energy at 35% of total consumption (850W). The Refrigerator follows at 25% (120W). Would you like me to suggest ways to optimize these devices?",
        isUser: false,
        timestamp: new Date(),
        type: 'recommendation',
        data: {
          devices: [
            { name: 'AC Unit', usage: 35, power: 850 },
            { name: 'Refrigerator', usage: 25, power: 120 },
            { name: 'Washing Machine', usage: 20, power: 0 },
            { name: 'Lights', usage: 12, power: 45 },
            { name: 'Other', usage: 8, power: 0 },
          ]
        }
      };
    }
    
    if (lowerMessage.includes('yesterday') || lowerMessage.includes('yesterday')) {
      return {
        id: Date.now().toString(),
        text: "Yesterday you consumed 15.2 kWh of energy, costing approximately $2.28. Your peak usage was between 2-6 PM (2.1 kWh). This is 8% higher than your average daily consumption.",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('predict') || lowerMessage.includes('tomorrow')) {
      return {
        id: Date.now().toString(),
        text: "Based on your usage patterns, I predict tomorrow's consumption will be around 16.5 kWh, costing approximately $2.48. The forecast shows higher usage in the afternoon due to expected warmer weather. Consider running energy-intensive appliances during off-peak hours.",
        isUser: false,
        timestamp: new Date(),
        type: 'recommendation'
      };
    }
    
    if (lowerMessage.includes('ac') || lowerMessage.includes('air conditioning')) {
      return {
        id: Date.now().toString(),
        text: "For optimal AC usage and energy savings:\n\n• Set temperature to 78°F (26°C) when home, 85°F (29°C) when away\n• Use programmable thermostat to avoid cooling empty rooms\n• Clean or replace filters monthly\n• Run during off-peak hours (before 2 PM or after 6 PM)\n• Close blinds during peak sun hours\n\nThis could save you $15-25 per month!",
        isUser: false,
        timestamp: new Date(),
        type: 'recommendation'
      };
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('money')) {
      return {
        id: Date.now().toString(),
        text: "Here are my top energy-saving recommendations:\n\n💰 **Immediate Savings (0-30 days):**\n• Turn off lights when not in use: Save $5/month\n• Unplug unused devices: Save $8/month\n• Use smart power strips: Save $12/month\n\n⚡ **Medium-term (1-3 months):**\n• Optimize AC usage: Save $15/month\n• Run appliances during off-peak hours: Save $10/month\n• Install LED bulbs: Save $8/month\n\n🏠 **Long-term (3+ months):**\n• Smart thermostat: Save $20/month\n• Energy-efficient appliances: Save $25/month\n\n**Total potential savings: $103/month**",
        isUser: false,
        timestamp: new Date(),
        type: 'recommendation'
      };
    }
    
    if (lowerMessage.includes('weekly') || lowerMessage.includes('report')) {
      return {
        id: Date.now().toString(),
        text: "Here's your weekly energy report:\n\n📊 **Week Summary:**\n• Total Consumption: 95.2 kWh\n• Average Daily: 13.6 kWh\n• Total Cost: $14.28\n• Peak Day: Saturday (18.3 kWh)\n• Most Efficient Day: Monday (12.5 kWh)\n\n📈 **Trends:**\n• 5.2% increase from last week\n• Weekend usage 15% higher than weekdays\n• Peak usage time: 2-6 PM daily\n\n💡 **Recommendations:**\n• Consider reducing weekend AC usage\n• Schedule heavy appliances for weekdays\n• Your efficiency score improved by 2.5% this week!",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: "I understand you're asking about energy usage. I can help you with:\n\n• Device energy consumption analysis\n• Historical usage reports\n• Energy predictions and forecasts\n• Cost-saving recommendations\n• Peak usage optimization\n• Efficiency tips and insights\n\nCould you be more specific about what you'd like to know?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const sendQuickQuestion = (question: string) => {
    setInputText(question);
    sendMessage();
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const MessageBubble = ({ message }: { message: Message }) => (
    <View style={[styles.messageContainer, message.isUser ? styles.userMessage : styles.aiMessage]}>
      <View style={[styles.messageBubble, message.isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, message.isUser ? styles.userText : styles.aiText]}>
          {message.text}
        </Text>
        {message.type === 'recommendation' && message.data && (
          <View style={styles.recommendationData}>
            {message.data.devices && (
              <View style={styles.deviceList}>
                {message.data.devices.map((device: any, index: number) => (
                  <View key={index} style={styles.deviceItem}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceUsage}>{device.usage}% ({device.power}W)</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        <Text style={[styles.timestamp, message.isUser ? styles.userTimestamp : styles.aiTimestamp]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../logo.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>AI Energy Assistant</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>AI is thinking...</Text>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => sendQuickQuestion(question)}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about your energy usage..."
            placeholderTextColor="#666"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  backButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  placeholder: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#00C853',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  recommendationData: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 8,
  },
  deviceList: {
    marginTop: 8,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deviceUsage: {
    color: '#00C853',
    fontSize: 14,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C853',
    marginHorizontal: 2,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  quickQuestionsContainer: {
    marginBottom: 20,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  quickQuestionButton: {
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickQuestionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#00C853',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(0, 200, 83, 0.3)',
  },
});
