import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const Leave = () => {
  const Navigation = useNavigation();
  
  const [mode, setMode] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [priority, setPriority] = useState('');
  const [returnType, setReturnType] = useState('');
  const [handOver, setHandOver] = useState([]);
  const [selectHandOver, setSelectHandOver] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const [reason, setReason] = useState('');
  const [leaveReasons, setLeaveReasons] = useState([]);
  const [remark, setRemark] = useState('');
  const [documentUri, setDocumentUri] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [requestToNames, setRequestToNames] = useState([]);
  const [tokenFactoryId, setTokenFactoryId] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [selectedRequestTo, setSelectedRequestTo] = useState('');

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
    if (tokenFactoryId) {
      fetchRequestDetails(tokenFactoryId);
      fetchHandOver(tokenFactoryId);
    }
  }, [tokenFactoryId]);

  useEffect(() => {
    getLeave();
  }, []);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('EmployeeId');
      const storedFactoryId = await AsyncStorage.getItem('FactoryId');
  
      if (!storedToken || !storedFactoryId) {
        console.log('User is not authenticated. Redirecting to login screen...');
        Navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken); // Assuming you need to use EmployeeId as token or for display purposes.
        setTokenFactoryId(storedFactoryId);   // Assuming you need to use FactoryId.
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchOrganisationDetails = async (token) => {
    try {
      const EmployeeId = await AsyncStorage.getItem('EmployeeId');
      const response = await axios.get(
        `http://hrm.daivel.in:3000/api/v2/lve/organistionId/${EmployeeId}`,
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
        `http://hrm.daivel.in:3000/api/v2/lve/employeId/${EmployeeId}`,
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

  const fetchRequestDetails = async (tokenFactoryId) => {
    const FactoryId = await AsyncStorage.getItem('FactoryId');
    try {
      const response = await axios.get(
        `http://hrm.daivel.in:3000/api/v2/lve/request/${FactoryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenFactoryId}`,
          },
        }
      );
      console.log('Request Details Response:', response.data);
      if (response.data.length > 0) {
        setRequestToNames(response.data); // Store entire employee objects
      } else {
        console.error('Request names retrieval failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching request names:', error.response ? error.response.data : error.message);
    }
  };
  
  const fetchHandOver = async (tokenFactoryId) => {
    const FactoryId = await AsyncStorage.getItem('FactoryId');
    try {
      const response = await axios.get(
        `http://hrm.daivel.in:3000/api/v2/lve/request/${FactoryId}`, // Assuming this is the endpoint for handOver
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenFactoryId}`,
          },
        }
      );
      console.log('Hand Over Response:', response.data);
      if (response.data.length > 0) {
        setHandOver(response.data); // Store entire employee objects
      } else {
        console.error('Hand Over names retrieval failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching hand over names:', error.response ? error.response.data : error.message);
    }
  };

  const getLeave = async () => {
    try {
      const response = await axios.get('http://hrm.daivel.in:3000/api/v2/lve/getleave');
      console.log('Fetched Leave Reasons:', response.data); // Check the data structure here
      setLeaveReasons(response.data);
    } catch (error) {
      console.error('Error fetching leave reasons:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setDocumentUri(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.log('Error picking document:', err);
      }
    }
  };

  const saveLeaveRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('EmployeeId'); // Replace 'Token' with your actual token key

      const formData = {
        TrnDate: new Date().toISOString().split('T')[0], // Current date
        TrnMode: mode,
        ReturnSts: returnType,
        ModeType: mode,
        HandOverTo: selectHandOver,
        RequestTo: selectedRequestTo,
        Priority: priority,
        LeaveType: leaveType,
        FromDate: fromDate,
        ToDate: toDate,
        Reason: reason,
        Remarks: remark,
        UserId:  await AsyncStorage.getItem('EmployeeId'),
        ApproveStatus: 'N',
      };

      const response = await axios.post('http://hrm.daivel.in:3000/api/v2/lve/inserLeave', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert('Leave request submitted successfully!');
        // Optionally, clear the form or redirect the user
      } else {
        alert('Failed to submit leave request: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request: ' + error.message);
    }
  };

  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };

  const handleFromDateConfirm = (date) => {
    setFromDate(date.toISOString().split('T')[0]);
    hideFromDatePicker();
  };

  const showToDatePicker = () => {
    setToDatePickerVisibility(true);
  };

  const hideToDatePicker = () => {
    setToDatePickerVisibility(false);
  };

  const handleRequestToChange = (itemValue) => {
    setSelectedRequestTo(Number(itemValue)); // Convert to number
  };

  const handleHandOverToChange =(itemValue)=>{
    setSelectHandOver(Number(itemValue))
  }

  const handleToDateConfirm = (date) => {
    setToDate(date.toISOString().split('T')[0]);
    hideToDatePicker();
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
  <Text style={styles.label}>Request TO</Text>
  <Picker
    selectedValue={selectedRequestTo}
    onValueChange={(itemValue) => setSelectedRequestTo(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Select Request To" value="" />
    {requestToNames.map((employee) => (
      <Picker.Item key={employee.EmployeeId} label={employee.Employee} value={employee.EmployeeId} />
    ))}
  </Picker>
</View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Return Type</Text>
          <Picker
            selectedValue={returnType}
            onValueChange={(itemValue) => setReturnType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Non Return" value="N" />
            <Picker.Item label="Return" value="R" />
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mode Type</Text>
          <Picker
            selectedValue={mode}
            onValueChange={(itemValue) => setMode(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Leave" value="L" />
            <Picker.Item label="Permission" value="P" />
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Leave Type</Text>
          <Picker
            selectedValue={leaveType}
            onValueChange={(itemValue) => setLeaveType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Full Day" value="F" />
            <Picker.Item label="Morning" value="M" />
            <Picker.Item label="Afternoon" value="A" />
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Normal" value="N" />
            <Picker.Item label="Urgent" value="U" />
          </Picker>
        </View>
        <View style={styles.formGroup}>
  <Text style={styles.label}>Hand Over To</Text>
  <Picker
    selectedValue={selectHandOver}
    onValueChange={(itemValue) => setSelectHandOver(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Select Hand Over To" value="" />
    {handOver.map((employee) => (
      <Picker.Item key={employee.EmployeeId} label={employee.Employee} value={employee.EmployeeId} />
    ))}
  </Picker>
</View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity onPress={showFromDatePicker}>
            <TextInput
              style={styles.picker}
              placeholder="Select From Date"
              value={fromDate}
              editable={false}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isFromDatePickerVisible}
            mode="date"
            onConfirm={handleFromDateConfirm}
            onCancel={hideFromDatePicker}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity onPress={showToDatePicker}>
            <TextInput
              style={styles.picker}
              placeholder="Select To Date"
              value={toDate}
              editable={false}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isToDatePickerVisible}
            mode="date"
            onConfirm={handleToDateConfirm}
            onCancel={hideToDatePicker}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Reason</Text>
          <Picker
            selectedValue={reason}
            onValueChange={(itemValue) => setReason(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Reason" value="" />
            {leaveReasons.map((leaveItem, index) => (
              <Picker.Item key={index} label={leaveItem.Reason} value={leaveItem.ReasonId} />
            ))}
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Remark</Text>
          <TextInput
            style={styles.input}
            value={remark}
            onChangeText={setRemark}
            placeholder="Enter Remark"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Document</Text>
          <TouchableOpacity onPress={pickDocument} style={styles.documentButton}>
            <Text style={styles.documentButtonText}>Select Document</Text>
          </TouchableOpacity>
          {documentUri && <Text>Selected Document: {documentUri}</Text>}
        </View>
        <TouchableOpacity onPress={saveLeaveRequest} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  documentButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  documentButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Leave;
