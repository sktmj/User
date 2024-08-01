import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Ensure axios is installed
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const Penalty = ({ navigation }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateMode, setDateMode] = useState('from'); // 'from' or 'to'
  const [reportType, setReportType] = useState('dailywise');
  const [EmployeeId, setEmployeeId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [tokenFactoryId, setTokenFactoryId] = useState(null);
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
    }
  }, [token]);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('EmployeeId');
      const storedFactoryId = await AsyncStorage.getItem('FactoryId');

      if (!storedToken || !storedFactoryId) {
        console.log('User is not authenticated. Redirecting to login screen...');
        navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken); // Assuming you need to use EmployeeId as token or for display purposes.
        setTokenFactoryId(storedFactoryId); // Assuming you need to use FactoryId.
        setEmployeeId(storedToken); // Set the EmployeeId state
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchUserDetails = async token => {
    try {
      const EmployeeId = await AsyncStorage.getItem('EmployeeId');

      const response = await axios.get(
        `http://10.0.2.2:3000/api/v2/lve/employeId/${EmployeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
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

  const handleSubmitOthers = async () => {
    if (!fromDate || !toDate || !EmployeeId) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');

    console.log('FromDate:', formattedFromDate);
    console.log('ToDate:', formattedToDate);
    console.log('EmployeeId:', EmployeeId);

    try {
      const response = await axios.get(`http://10.0.2.2:3000/api/v2/pen/others/${EmployeeId}`, {
        params: {
          FromDate: formattedFromDate,
          ToDate: formattedToDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const handleSubmitSummery = async () => {
    if (!fromDate || !toDate || !EmployeeId) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');

    console.log('FromDate:', formattedFromDate);
    console.log('ToDate:', formattedToDate);
    console.log('EmployeeId:', EmployeeId);

    try {
      const response = await axios.get(`http://10.0.2.2:3000/api/v2/pen/summery/${EmployeeId}`, {
        params: {
          FromDate: formattedFromDate,
          ToDate: formattedToDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !EmployeeId) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');

    console.log('FromDate:', formattedFromDate);
    console.log('ToDate:', formattedToDate);
    console.log('EmployeeId:', EmployeeId);

    try {
      const response = await axios.get(`http://10.0.2.2:3000/api/v2/pen/penalty/${EmployeeId}`, {
        params: {
          FromDate: formattedFromDate,
          ToDate: formattedToDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const tableHead = reportType === 'summary' 
    ? ['Employee Name', 'Late Mins', 'Amount'] 
    : reportType === 'other' 
      ? ['Employee Name', 'Penalty Amount', 'Remarks'] 
      : ['Date', 'InTime', 'Late Mins', 'Amount'];

  const formatTableData = (data) => {
    return data.map((item) => {
      if (reportType === 'summary') {
        return [
          item.EmpName,
          item.LateMins,
          item.Amount,
        ];
      } else if (reportType === 'other') {
        return [
          item.EmpName,
          item.PenaltyAmount,
          item.Remarks,
        ];
      } else {
        let formattedInTime = '';

        if (item.InTime) {
          try {
            // Ensure the InTime is treated as UTC before converting to local time
            formattedInTime = moment.utc(item.InTime).format('HH:mm'); // Convert to local time
          } catch (error) {
            console.error('Error formatting InTime:', error);
            formattedInTime = 'Invalid Time';
          }
        }

        return [
          moment(item.AttDate).format('DD/MM/YYYY'),
          formattedInTime,
          item.LateMins,
          item.Amount,
        ];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerText}>Penalty Report</Text>
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
        <Picker
          selectedValue={reportType}
          style={styles.picker}
          onValueChange={(itemValue) => setReportType(itemValue)}
        >
          <Picker.Item label="Daily Wise" value="dailywise" />
          <Picker.Item label="Summary Wise" value="summary" />
          <Picker.Item label="Others" value="other" />
        </Picker>
        <TextInput
            style={styles.input}
            value={employeeName}
            editable={false}
          />
      <TouchableOpacity 
  style={[styles.button, reportType === 'summary' ? styles.buttonSummary : reportType === 'other' ? styles.buttonOther : styles.buttonDefault]}
  onPress={reportType === 'summary' ? handleSubmitSummery : reportType === 'other' ? handleSubmitOthers : handleSubmit}
>
  <Text style={styles.buttonText}>Generate Report</Text>
</TouchableOpacity>
      </View>
      <View style={styles.tableContainer}>
      <View style={styles.employeeContainer}>
      <Text style={styles.employeeLabel}>
            Report from {fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'N/A'} to {toDate ? moment(toDate).format('DD/MM/YYYY') : 'N/A'}
          </Text>
          </View>
          <View style={styles.employeeContainer}>
  <Text style={styles.employeeLabel}> </Text>
  <Text style={styles.employeeValue}>{employeeName}</Text>
</View>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={formatTableData(data)} textStyle={styles.text} />
        </Table>
      </View>
    </ScrollView>
    <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      date={dateMode === 'from' ? fromDate || new Date() : toDate || new Date()}
    />
  </SafeAreaView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#059A5F',
    
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  filters: {
    padding: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  dateText: {
    marginLeft: 10,
    color: '#666',
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    color:"black"
  },
  tableContainer: {
    padding: 20,
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
   
  },
  text: {
    margin: 6,
     color:"black"
  },
  employeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  employeeLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 5,
  },
  employeeValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#059A5F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Penalty;
