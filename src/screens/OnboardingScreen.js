import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

export default function OnboardingScreen({ setIsOnboarded }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const isEmailValid = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isNameValid = (val) => val.trim().length > 0 && /^[a-zA-Z\s]+$/.test(val);

  const isValid = isNameValid(firstName) && isEmailValid(email);

  const handleNext = async () => {
    if (!isValid) return;
    try {
      const userData = {
        firstName: firstName.trim(),
        lastName: '',
        email: email.trim(),
        phoneNumber: '',
        orderStatuses: true,
        passwordChanges: true,
        specialOffers: true,
        newsletter: true,
      };
      await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
      await AsyncStorage.setItem('isOnboarded', 'true');
      setIsOnboarded(true);
    } catch (e) {
      console.error('Error saving onboarding data:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showProfile={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Let us get to know you</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="john@example.com"
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            disabled={!isValid}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  banner: {
    backgroundColor: '#495E57',
    paddingVertical: 32,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EDEFEE',
  },
  form: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#495E57',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  footer: {
    padding: 24,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#F4CE14',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#BCC6C2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});
