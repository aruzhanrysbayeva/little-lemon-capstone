import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function Header({ navigation, showProfile = true }) {
  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <Image
        source={require('../../assets/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {showProfile ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.avatarWrapper}
        >
          <Image
            source={require('../../assets/ProfilePlaceholder.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#EDEFEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  spacer: {
    width: 40,
  },
  logo: {
    width: 160,
    height: 40,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
  },
});
