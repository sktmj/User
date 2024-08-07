import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Outpass = () => {
  const [leaveType, setLeaveType] = useState('');
  const [returnType, setReturnType] = useState('');
  const [remark, setRemark] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [organisation, setOrganisation] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
      fetchOrganisationDetails(token);
    }
  }, [token]);

  useEffect(() => {
    const currentTime = new Date();
    const formattedTime = currentTime.toTimeString().substring(0, 5);
    setFromTime(formattedTime);
    setToTime(formattedTime);
  }, []);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('EmployeeId');

      if (!storedToken) {
        console.log('User is not authenticated. Redirecting to login screen...');
        Navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchOrganisationDetails = async (token) => {
    try {
      const EmployeeId = await AsyncStorage.getItem('EmployeeId');

      const response = await axios.get(
        `http://hrm.daivel.in:3000/api/v2/home/organistionId/${EmployeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Organisation Response:', response.data);
      if (response.data.length > 0) {
        setOrganisation(response.data[0].Factory);
      } else {
        console.error('User organisation retrieval failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user organisation:', error.message);
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      const EmployeeId = await AsyncStorage.getItem('EmployeeId');

      const response = await axios.get(
        `http://hrm.daivel.in:3000/api/v2/home/employeId/${EmployeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('User Response:', response.data);
      if (response.data.length > 0) {
        setEmployeeName(response.data[0].Employee);
      } else {
        console.error('User details retrieval failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const formatDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  const saveLeaveRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('EmployeeId');

      if (!token) {
        console.log('Token not found');
        return;
      }

      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      const formattedFromTime = formatDateTime(currentDate, fromTime);
      const formattedToTime = formatDateTime(currentDate, toTime);

      const response = await axios.post(
        'http://hrm.daivel.in:3000/api/v2/home/outpass',
        {
          FromTime: formattedFromTime,
          ToTime: formattedToTime,
          ReturnSts: returnType,
          OPType: leaveType,
          Reason: remark,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log('Outpass submitted successfully:', response.data.message);
        // Optionally, you can reset the form or navigate to another screen here.
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting Outpass:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.heading}>Outpass Form</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Employee</Text>
          <TextInput
            style={styles.input}
            value={employeeName}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Organisation</Text>
          <TextInput
            style={styles.input}
            value={organisation}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>From Time</Text>
          <TextInput
            style={styles.input}
            value={fromTime}
            onChangeText={text => setFromTime(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>To Time</Text>
          <TextInput
            style={styles.input}
            value={toTime}
            onChangeText={text => setToTime(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Return Type</Text>
          <Picker
            selectedValue={returnType}
            onValueChange={itemValue => setReturnType(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Non Return" value="N" />
            <Picker.Item label="Return" value="Y" />
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Outpass Type</Text>
          <Picker
            selectedValue={leaveType}
            onValueChange={itemValue => setLeaveType(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Personal" value="P" />
            <Picker.Item label="Official" value="O" />
            <Picker.Item label="Leave" value="L" />
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Reason"
            multiline
            numberOfLines={2}
            value={remark}
            onChangeText={text => setRemark(text)}
          />
        </View>
        <TouchableOpacity
          onPress={saveLeaveRequest}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Save Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0f2e2',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  formGroup: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color:"black"
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color:"black"
  },
  submitButton: {
    backgroundColor: '#00796B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Outpass;
