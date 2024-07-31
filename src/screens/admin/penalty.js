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

  const tableHead = [ 'Date', 'Intime', 'Late Mins', 'Amount'];

  const formatTableData = (data) => {
    return data.map((item) => {
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
            style={styles.input}
            onValueChange={(itemValue) => setReportType(itemValue)}
          >
            <Picker.Item label="Dailywise" value="dailywise" />
            <Picker.Item label="Summary" value="summary" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          <TextInput
            style={styles.input}
            value={employeeName}
            editable={false}
          />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
        <View style={styles.tableContainer}>
          <Text style={styles.text}>
            Report from {fromDate ? moment(fromDate).format('DD/MM/YYYY') : 'N/A'} to {toDate ? moment(toDate).format('DD/MM/YYYY') : 'N/A'}
          </Text>
          <Text style={styles.text}>
            Employee: {employeeName} 
          </Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={formatTableData(data)} textStyle={styles.text} />
          </Table>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    width: '48%',
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
     color: '#666'
  },
  tableContainer: {
    marginBottom: 20,
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    textAlign: 'center',
     color: '#666'
  },
});

export default Penalty;
