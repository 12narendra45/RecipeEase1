import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://recipe-backend-lgzw.onrender.com/api/auth';


export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    identifier: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!form.identifier || !form.password) {
      Alert.alert('Missing fields', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: form.identifier,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Login Failed', data.error || 'Something went wrong');
        return;
      }

      // Save token and user to AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to Main/Home screen
      navigation.replace('Main');
    } catch (error) {
      console.warn('Login error:', error);
      Alert.alert('Connection Error', 'Failed to connect to server.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.overlay}>
            <Text style={styles.title}>Welcome Back, Foodie 🍔</Text>

            <TextInput
              style={styles.input}
              placeholder="Email / Username / Phone"
              placeholderTextColor="#eee"
              value={form.identifier}
              onChangeText={(text) => setForm({ ...form, identifier: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#eee"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Registeration')}>
              <Text style={styles.registerText}>
                Don’t have an account? Register
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#fff',
  },
  button: {
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  registerText: {
    color: '#eee',
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
});
