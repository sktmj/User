import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Ionicons';
import {Table, Row, Rows} from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const Permission = ({navigation}) => {
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
        `http://hrm.daivel.in:3000/api/v2/per/permission/${EmployeeId}`,
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

  const tableHead = ['Date', 'InTime', 'OutTime'];

  const formatTableData = data => {
    return data.map(item => {
      let formattedFromTime = 'Invalid Time';
      let formattedToTime = 'Invalid Time';
      let formattedDte = 'Invalid Date';

      // Formatting the date
      if (item.Dte) {
        try {
          formattedDte = moment(item.Dte).format('DD/MM/YYYY');
        } catch (error) {
          console.error('Error formatting Dte:', error);
        }
      }

      // Formatting the FromTime
      if (item.FromTime) {
        try {
          formattedFromTime = moment.utc(item.FromTime).format('HH:mm');
        } catch (error) {
          console.error('Error formatting FromTime:', error);
        }
      }

      // Formatting the ToTime
      if (item.ToTime) {
        try {
          formattedToTime = moment.utc(item.ToTime).format('HH:mm');
        } catch (error) {
          console.error('Error formatting ToTime:', error);
        }
      }

      return [formattedDte, formattedFromTime, formattedToTime];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Permission Report</Text>
        </View>
        <View style={styles.filters}>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              onPress={() => showDatePicker('from')}
              style={styles.dateInput}>
              <Icon
                name="calendar"
                size={20}
                color="#fff"
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
                color="#fff"
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
          <Text style={styles.reportLabel}>
            Report from{' '}
            {fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'N/A'} to{' '}
            {toDate ? moment(toDate).format('DD/MM/YYYY') : 'N/A'}
          </Text>

          <View style={styles.employeeContainer}>
            <Text style={styles.employeeName}>Employee:{employeeName}</Text>
          </View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
            <Row
              data={tableHead}
              style={styles.head}
              textStyle={styles.textTable}
            />
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
    backgroundColor: '#d0f2e2', // Light cyan background
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#004D40', // Darker teal color
  },
  headerText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  filters: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    elevation: 4, // Slightly lighter shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#004D40',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#00796B', // Medium teal
  },
  dateText: {
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 12,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#00796B', // Teal color for the button
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Add subtle shadow
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    elevation: 4,
  },
  reportLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  head: {
    backgroundColor: '#004D40',
  },
  text: {
    color: 'black',
    textAlign: 'center',
    paddingVertical: 10,
  },
  textTable: {
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default Permission;
