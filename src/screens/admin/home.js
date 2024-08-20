import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

// Function to get the current month and year in YYYY-MM format
const getCurrentMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

// Function to get month names
const getMonthNames = () => {
  return [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];
};

const Home = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [tableHead] = useState(["#", "Date", "InTime", "OutTime"]);
  const [tableData, setTableData] = useState([]);
  const [entryHead] = useState(["#", "Date", "InTime", "OutTime"]);
  const [entryData, setEntryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth()); // Default to current month
  const [EmployeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      await checkAuthentication();
    };
    initialize();
  }, []);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('EmployeeId');
      if (!storedToken) {
        console.log('User is not authenticated. Redirecting to login screen...');
        navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken);
        setEmployeeId(storedToken); // Assuming EmployeeId is stored in the token
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && EmployeeId) {
      fetchAttendanceData();
    }
  }, [selectedMonth, isLoggedIn, EmployeeId]);

  const fetchAttendanceData = async () => {
    setLoading(true);

    // Split selectedMonth into year and month
    const [year, month] = selectedMonth.split('-');
    
    // Calculate startDate (29th of the previous month)
    const prevMonth = month === '01' ? '12' : (parseInt(month, 10) - 1).toString().padStart(2, '0');
    const prevYear = month === '01' ? (parseInt(year, 10) - 1).toString() : year;
    const startDate = new Date(prevYear, prevMonth - 1, 29);
    
    // Calculate endDate (28th of the selected month)
    const endDate = new Date(year, month - 1, 28);
  
    // Format dates as YYYY-MM-DD
    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
  
    try {
      const response = await axios.get(`http://hrm.daivel.in:3000/api/v2/hm/home/${EmployeeId}`, {
        params: { StDate: formattedStartDate, EndDate: formattedEndDate },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = response.data;
  
      if (Array.isArray(data) && data.length > 0) {
        const totalPresent = data.reduce((acc, item) => acc + (item.Present || 0), 0);
        const totalAbsent = data.reduce((acc, item) => acc + (item.Absent || 0), 0);
        const totalLeave = data.reduce((acc, item) => acc + (item.Leave || 0), 0);
        const totalOnDuty = data.reduce((acc, item) => acc + (item.OnDuty || 0), 0);
        const totalWeekOff = data.reduce((acc, item) => acc + (item.WeekOff || 0), 0);
        const totalHoliday = data.reduce((acc, item) => acc + (item.Holiday || 0), 0);
  
        setChartData([
          { name: 'Present', population: totalPresent, color: '#FF6384', legendFontColor: '#fff', legendFontSize: 15 },
          { name: 'Absent', population: totalAbsent, color: '#36A2EB', legendFontColor: '#fff', legendFontSize: 15 },
          { name: 'Leave', population: totalLeave, color: '#FFCE56', legendFontColor: '#fff', legendFontSize: 15 },
          { name: 'OnDuty', population: totalOnDuty, color: '#4BC0C0', legendFontColor: '#fff', legendFontSize: 15 },
          { name: 'WeekOff', population: totalWeekOff, color: '#9966FF', legendFontColor: '#fff', legendFontSize: 15 },
          { name: 'Holiday', population: totalHoliday, color: '#FF9F40', legendFontColor: '#fff', legendFontSize: 15 },
        ]);
  
        const formattedTableData = data.map((item, index) => ([
          `${index + 1}`,
          item.Date || 'N/A',
          item.InTime || 'N/A',
          item.OutTime || 'N/A'
        ]));
        setTableData(formattedTableData);
        setEntryData(formattedTableData);
      } else {
        setChartData([]);
        setTableData([]);
        setEntryData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate month options for the picker with month names
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    const year = today.getFullYear();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    
    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, '0');
      const label = getMonthNames().find(m => m.value === month).label;
      const value = `${year}-${month}`;
      options.push({ label: label, value: value });
    }
    return options;
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handlePieSegmentClick = (data) => {
    setSelectedSegment(data);
  };

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Month</Text>
              <Picker
                selectedValue={selectedMonth}
                style={styles.picker}
                onValueChange={handleMonthChange}
              >
                {generateMonthOptions().map(option => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <>
              <View style={{ alignItems: 'center' }}>
                <PieChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#090920',
                    backgroundGradientFrom: '#090920',
                    backgroundGradientTo: '#090920',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForLabels: {
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: '#fff',
                    },
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[10, 10]}
                  absolute
                  onPress={(data) => handlePieSegmentClick(data)}
                />
                {selectedSegment && (
                  <View style={styles.segmentInfo}>
                    <Text style={styles.segmentText}>Name: {selectedSegment.name}</Text>
                    <Text style={styles.segmentText}>Value: {selectedSegment.population}</Text>
                  </View>
                )}
              </View>

              <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Attendance Overview</Text>
                <Table borderStyle={styles.borderStyle}>
                  <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                  <Rows data={tableData} textStyle={styles.text} />
                </Table>
              </View>

              <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Entry Data</Text>
                <Table borderStyle={styles.borderStyle}>
                  <Row data={entryHead} style={styles.head} textStyle={styles.text} />
                  <Rows data={entryData} textStyle={styles.text} />
                </Table>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#090920', // Background color
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#090920', // Heading color
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 20,
    width: '100%',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Table title color
  },
  borderStyle: {
    borderWidth: 2,
    borderColor: '#ccc', // Border color
  },
  head: {
    height: 40,
    backgroundColor: '#1a1a1a', // Table header color
  },
  text: {
    margin: 6,
    color: '#fff', // Table text color
  },
  segmentInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1a1a1a', // Segment info background color
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 16,
    color: '#fff', // Segment text color
    marginBottom: 5,
  },
});

export default Home;
