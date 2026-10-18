import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

export default function ProfileScreen({ navigation, setIsOnboarded }) {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    orderStatuses: true,
    passwordChanges: true,
    specialOffers: true,
    newsletter: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('userProfile');
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    })();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert('Success', 'Profile changes saved!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  const handleDiscardChanges = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProfile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setIsOnboarded(false);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} showProfile={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Personal information</Text>

        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          value={profile.firstName}
          onChangeText={(val) => handleChange('firstName', val)}
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          value={profile.lastName}
          onChangeText={(val) => handleChange('lastName', val)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(val) => handleChange('email', val)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={profile.phoneNumber}
          onChangeText={(val) => handleChange('phoneNumber', val)}
          keyboardType="phone-pad"
          placeholder="(555) 000-0000"
        />

        <Text style={[styles.heading, { marginTop: 24 }]}>Email notifications</Text>

        {[
          { label: 'Order statuses', field: 'orderStatuses' },
          { label: 'Password changes', field: 'passwordChanges' },
          { label: 'Special offers', field: 'specialOffers' },
          { label: 'Newsletter', field: 'newsletter' },
        ].map((item) => (
          <View key={item.field} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={profile[item.field]}
              onValueChange={(val) => handleChange(item.field, val)}
              trackColor={{ true: '#495E57', false: '#CCC' }}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={handleDiscardChanges}
          >
            <Text style={styles.discardButtonText}>Discard changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#F4CE14',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#EE9972',
  },
  logoutButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333333',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  discardButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#495E57',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  discardButtonText: {
    color: '#495E57',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#495E57',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
