import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Outpass = () => {
 

  const [leaveType, setLeaveType] = useState('');
  const [returnType, setReturnType] = useState('');
  const [remark, setRemark] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

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
  const formatDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };
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
        `http://10.0.2.2:3000/api/v2/home/organistionId/${EmployeeId}`,
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
        `http://10.0.2.2:3000/api/v2/home/employeId/${EmployeeId}`,
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
      'http://10.0.2.2:3000/api/v2/home/outpass',
      {
        FromTime: formattedFromTime, // Ensure this is in a valid DateTime format
        ToTime: formattedToTime, // Ensure this is in a valid DateTime format
        ReturnSts: returnType, // Ensure this matches the expected Char values
        OPType: leaveType, // Ensure this matches the expected Char values
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
      <ScrollView>
        <Text style={styles.heading}>Leave Request Form</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Employee</Text>
          <TextInput
            style={styles.picker}
            value={employeeName}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Organisation</Text>
          <TextInput
            style={styles.picker}
            value={organisation}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>From Time</Text>
          <TextInput
            style={styles.picker}
            value={fromTime}
            onChangeText={(text) => setFromTime(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>To Time</Text>
          <TextInput
            style={styles.picker}
            value={toTime}
            onChangeText={(text) => setToTime(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Return Type</Text>
          <Picker
            style={styles.picker}
            selectedValue={returnType}
            onValueChange={(itemValue) => setReturnType(itemValue)}>
            <Picker.Item label="Non Return" value="N" />
            <Picker.Item label="Return" value="Y" />
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Outpass Type</Text>
          <Picker
            style={styles.picker}
            selectedValue={leaveType}
            onValueChange={(itemValue) => setLeaveType(itemValue)}>
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
            onChangeText={(text) => setRemark(text)}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={saveLeaveRequest}>
          <Text style={styles.buttonText}>Save Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Outpass;
