import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, Text, StyleSheet,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [appName, setAppName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOTP] = useState('');
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const Navigation = useNavigation()

  const handleSendOTP = async () => {
    try {
      const response = await fetch('http://hrm.daivel.in:3000/api/v1/auth/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ MobileNo: mobileNo, AppName: appName }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        Alert.alert('OTP sent successfully');
      } else {
        Alert.alert('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('http://hrm.daivel.in:3000/api/v1/auth/verifyOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ MobileNo: mobileNo, AppName: appName, EnteredOTP: otp, Passwrd: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowUsernamePassword(true);
        Alert.alert('OTP verified successfully');
      } else {
        Alert.alert('Failed to verify OTP & Choose Another Mobile Number');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Failed to verify OTP & Choose Another Mobile Number');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('http://hrm.daivel.in:3000/api/v1/auth/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ MobileNo: mobileNo, AppName: appName }), // Pass only MobileNo and AppName for now
      });
  
      const data = await response.json();
  
      if (response.ok) {
       Navigation.navigate("Login")
        Alert.alert('Signup successful');
      } else {
        Alert.alert('Failed to signup');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Failed to signup');
    }
  };
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/daivel1.png')} style={styles.image} />
      <Text style={styles.title}>SignUp</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNo}
        onChangeText={setMobileNo}
        keyboardType="numeric"
        placeholderTextColor="#888" 
      />
      <TextInput
        style={styles.input}
        placeholder="App Name"
        value={appName}
        onChangeText={setAppName}
        placeholderTextColor="#888" 
      />
      {/* Send OTP Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#059A5F' }]} // Custom background color
        onPress={handleSendOTP}
        disabled={!mobileNo || !appName}
      >
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      {otpSent && (
        <>
          {/* Enter OTP Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOTP}
            keyboardType="numeric"
            placeholderTextColor="#888" 
          />
          {/* Verify OTP Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#059A5F' }]} // Custom background color
            onPress={handleVerifyOTP}
            disabled={!otp}
          >
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {showUsernamePassword && (
        <>
          {/* Username Input */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={mobileNo} // Automatically filled with Mobile Number
            editable={false} // User can't edit
          />
          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888" 
          />
          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#059A5F' }]} // Custom background color
            onPress={handleSignup}
            disabled={!password}
          >
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "#090920",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: "#fff",
    color:"black"
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: '30%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  image: {
    width: 300,
    height:75,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
});

export default SignUp;
