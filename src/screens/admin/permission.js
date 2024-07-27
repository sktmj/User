// screens/PenaltyScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, Row, Rows } from 'react-native-table-component';




const Permission = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateMode, setDateMode] = useState('from'); // 'from' or 'to'
  const [reportType, setReportType] = useState('dailywise');
  const [employeeId, setEmployeeId] = useState('');

  const showDatePicker = (mode) => {
    setDateMode(mode);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (dateMode === 'from') {
      setFromDate(date);
    } else {
      setToDate(date);
    }
    hideDatePicker();
  };

  const handleSubmit = () => {
    // Implement your submit logic here
    console.log('Submitted');
  };

  const tableHead = ['Date', 'in time', 'out time', ];
  const tableData = [
    [ '12/07/2024',  '09:10', '10'],
    [ '12/07/2024',  '09:15', '15'],
    [ '12/07/2024', '09:05', '5'],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Permission Report</Text>
      </View>
      <View style={styles.filters}>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity onPress={() => showDatePicker('from')} style={styles.dateInput}>
            <Icon name="calendar" size={20} color="#666" style={styles.icon} />
            <Text style={styles.dateText}>{fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'From Date'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showDatePicker('to')} style={styles.dateInput}>
            <Icon name="calendar" size={20} color="#666" style={styles.icon} />
            <Text style={styles.dateText}>{toDate ? moment(toDate).format('DD/MM/YYYY') : 'To Date'}</Text>
          </TouchableOpacity>
        </View>
       
        <TextInput
          style={styles.input}
          placeholder="Employee ID"
          value={employeeId}
          onChangeText={setEmployeeId}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <View style={styles.tableContainer}>
        <Text style={styles.reportText}>
          Report from {fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'N/A'} to {toDate ? moment(toDate).format('DD/MM/YYYY') : 'N/A'}
        </Text>
        <Text style={styles.reportText}>
         employee : Ajay :1615
        </Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filters: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 1,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
    flex: 0.48,
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 20,
  },
  reportText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#666',
  },
  head: {
    height: 89,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
});

export default Permission;
