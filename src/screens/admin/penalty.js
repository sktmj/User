import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
      const response = await axios.get(`http://hrm.daivel.in:3000/api/v2/pen/others/${EmployeeId}`, {
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
      const response = await axios.get(`http://hrm.daivel.in:3000/api/v2/pen/summery/${EmployeeId}`, {
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
      const response = await axios.get(`http://hrm.daivel.in:3000/api/v2/pen/penalty/${EmployeeId}`, {
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
            formattedInTime = moment.utc(item.InTime).format('HH:mm');
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Penalty Report</Text>
        </View>
        <View style={styles.filters}>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => showDatePicker('from')} style={styles.dateInput}>
              <Icon name="calendar" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.dateText}>{fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'From Date'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showDatePicker('to')} style={styles.dateInput}>
              <Icon name="calendar" size={20} color="#fff" style={styles.icon} />
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
          <Text style={styles.reportLabel}>
            Report from {fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'N/A'} to {toDate ? moment(toDate).format('DD/MM/YYYY') : 'N/A'}
          </Text>
          <Text style={styles.employeeName}>{employeeName}</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.textTable} />
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
    shadowOffset: { width: 0, height: 2 },
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
  textTable:{
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 10,
  }
});

export default Penalty;
