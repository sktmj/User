// LeaveEntryScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';

const LeaveEntryScreen = () => {
  const organizations = ['Org1', 'Org2', 'Org3'];
  const employees = ['Employee1', 'Employee2', 'Employee3'];
  const requestTo = ['Manager1', 'Manager2', 'Manager3'];
  const modes = ['Mode1', 'Mode2', 'Mode3'];
  const leaveTypes = ['Sick Leave', 'Vacation', 'Maternity Leave'];
  const priorities = ['High', 'Medium', 'Low'];
  const returnTypes = ['Email', 'Hard Copy'];
  const handOverTo = ['Colleague1', 'Colleague2', 'Colleague3'];
  const reasons = ['Reason1', 'Reason2', 'Reason3'];

  const [organisation, setOrganisation] = useState('');
  const [employee, setEmployee] = useState('');
  const [requestToValue, setRequestToValue] = useState('');
  const [mode, setMode] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [priority, setPriority] = useState('');
  const [returnType, setReturnType] = useState('');
  const [handOverToValue, setHandOverToValue] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const [reason, setReason] = useState('');
  const [remark, setRemark] = useState('');
  const [documentUri, setDocumentUri] = useState(null);

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

  const saveLeaveRequest = () => {
    console.log('Leave request saved!');
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

  const handleToDateConfirm = (date) => {
    setToDate(date.toISOString().split('T')[0]);
    hideToDatePicker();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Leave Request Form</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Organisation</Text>
        <Picker
          selectedValue={organisation}
          onValueChange={(itemValue) => setOrganisation(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Organisation" value="" />
          {organizations.map((org, index) => (
            <Picker.Item key={index} label={org} value={org} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Employee</Text>
        <Picker
          selectedValue={employee}
          onValueChange={(itemValue) => setEmployee(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Employee" value="" />
          {employees.map((emp, index) => (
            <Picker.Item key={index} label={emp} value={emp} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Request To</Text>
        <Picker
          selectedValue={requestToValue}
          onValueChange={(itemValue) => setRequestToValue(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Request To" value="" />
          {requestTo.map((to, index) => (
            <Picker.Item key={index} label={to} value={to} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Mode</Text>
        <Picker
          selectedValue={mode}
          onValueChange={(itemValue) => setMode(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Mode" value="" />
          {modes.map((m, index) => (
            <Picker.Item key={index} label={m} value={m} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Leave Type</Text>
        <Picker
          selectedValue={leaveType}
          onValueChange={(itemValue) => setLeaveType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Leave Type" value="" />
          {leaveTypes.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Priority</Text>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Priority" value="" />
          {priorities.map((p, index) => (
            <Picker.Item key={index} label={p} value={p} />
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
          <Picker.Item label="Select Return Type" value="" />
          {returnTypes.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Hand Over To</Text>
        <Picker
          selectedValue={handOverToValue}
          onValueChange={(itemValue) => setHandOverToValue(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Hand Over To" value="" />
          {handOverTo.map((to, index) => (
            <Picker.Item key={index} label={to} value={to} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>From Date</Text>
        <TouchableOpacity onPress={showFromDatePicker} style={styles.dateButton}>
          <Text style={styles.dateText}>
            {fromDate ? fromDate : 'Select From Date'}
          </Text>
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
        <TouchableOpacity onPress={showToDatePicker} style={styles.dateButton}>
          <Text style={styles.dateText}>
            {toDate ? toDate : 'Select To Date'}
          </Text>
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
          {reasons.map((r, index) => (
            <Picker.Item key={index} label={r} value={r} />
          ))}
        </Picker>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Remark</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Remark"
          multiline
          numberOfLines={3}
          value={remark}
          onChangeText={(text) => setRemark(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Leave Approval Image</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Text style={styles.buttonText}>Upload Document</Text>
        </TouchableOpacity>
        {documentUri && <Text style={styles.documentName}>{documentUri}</Text>}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveLeaveRequest}>
        <Text style={styles.buttonText}>Save Request</Text>
      </TouchableOpacity>
    </ScrollView>
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
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
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
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
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
  documentName: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
});

export default LeaveEntryScreen;
