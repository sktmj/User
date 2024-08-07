import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const Leave = ({ navigation }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateMode, setDateMode] = useState('from');
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
        console.log(
          'User is not authenticated. Redirecting to login screen...',
        );
        navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken);
        setTokenFactoryId(storedFactoryId);
        setEmployeeId(storedToken);
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchUserDetails = async token => {
    try {
      const EmployeeId = await AsyncStorage.getItem('EmployeeId');

      const response = await axios.get(
        `http://hrm.daivel.in:3000/api/v2/lve/employeId/${EmployeeId}`,
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

  const showDatePicker = mode => {
    setDateMode(mode);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    if (dateMode === 'from') {
      setFromDate(date);
    } else {
      setToDate(date);
    }
    hideDatePicker();
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
      const response = await axios.get(
        `http://hrm.daivel.in:3000/api/v2/lve/allLeave/${EmployeeId}`,
        {
          params: {
            FromDate: formattedFromDate,
            ToDate: formattedToDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setData(response.data);
    } catch (error) {
      console.error(
        'Error fetching data:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const tableHead = ['Date', 'InTime', 'OutTime', 'DayType'];

  const formatTableData = data => {
    return data.map(item => {
      let formattedInTime = 'Invalid Time';
      if (item.InTime) {
        try {
          formattedInTime = moment.utc(item.InTime).format('HH:mm');
        } catch (error) {
          console.error('Error formatting InTime:', error);
        }
      }
      return [
        moment(item.AttendanceDate).format('DD'),
        item.InTime,
        item.OutTime,
        item.DayType,
      ];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Leave Report</Text>
          <TouchableOpacity 
            style={styles.newLeaveButton}
            onPress={() => navigation.navigate('Leaveentry')} // Navigate to New Leave Entry screen
          >
            <Icon name="add-circle" size={24} color="#fff" />
            <Text style={styles.newLeaveText}>New Leave Entry</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filters}>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              onPress={() => showDatePicker('from')}
              style={styles.dateInput}>
              <Icon
                name="calendar"
                size={20}
                color="#059A5F"
                style={styles.icon}
              />
              <Text style={styles.dateText}>
                {fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'From Date'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => showDatePicker('to')}
              style={styles.dateInput}>
              <Icon
                name="calendar"
                size={20}
                color="#059A5F"
                style={styles.icon}
              />
              <Text style={styles.dateText}>
                {toDate ? moment(toDate).format('DD/MM/YYYY') : 'To Date'}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={employeeName}
            editable={false}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Generate Report</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.employeeContainer}>
            <Text style={styles.employeeLabel}>
              Report from{' '}
              {fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'N/A'} to{' '}
              {toDate ? moment(toDate).format('DD/MM/YYYY') : 'N/A'}
            </Text>
          </View>
          <View style={styles.employeeContainer}>
            <Text style={styles.employeeLabel}>Employee: {employeeName}</Text>
          </View>
          <Table borderStyle={styles.tableBorder}>
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
        date={
          dateMode === 'from' ? fromDate || new Date() : toDate || new Date()
        }
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
    backgroundColor: '#059A5F', // Updated header color
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    elevation: 4, // Added shadow for depth
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 30,
  },
  newLeaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#20c997',
    borderRadius: 5,
  },
  newLeaveText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  filters: {
    padding: 20,
    backgroundColor: '#fff', // Updated background color
    borderRadius: 10, // Added border radius
    margin: 10,
    elevation: 2, // Added shadow for depth
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
    padding: 12, // Increased padding
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#fff', // Updated background color
    elevation: 1, // Added shadow for depth
  },
  dateText: {
    marginLeft: 10,
    color: '#059A5F', // Updated text color
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'black',
    backgroundColor: '#fff', // Updated background color
    elevation: 1, // Added shadow for depth
  },
  tableContainer: {
    padding: 20,
    backgroundColor: '#fff', // Updated background color
    borderRadius: 10, // Added border radius
    margin: 10,
    elevation: 2, // Added shadow for depth
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#c8e1ff',
    borderRadius: 10, // Added border radius
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    color: 'black',
  },
  button: {
    backgroundColor: '#059A5F',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeContainer: {
    marginBottom: 10,
  },
  employeeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Leave;
