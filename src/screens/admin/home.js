import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth()); // Default to current month
  const [EmployeeId, setEmployeeId] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);

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
        params: {
          StDate: formattedStartDate,
          EndDate: formattedEndDate,
        },
      });

      const data = response.data;

      // Process chart data
      const total = data.reduce((acc, item) => acc + item.Present + item.Absent + item.Leave + item.OnDuty + item.WeekOff + item.Holiday, 0);

      const chartData = [
        { name: 'Present', count: data.reduce((acc, item) => acc + item.Present, 0), color: '#FF6384', legendFontColor: '#fff', legendFontSize: 15  },
        { name: 'Absent', count: data.reduce((acc, item) => acc + item.Absent, 0), color: '#36A2EB', legendFontColor: '#fff', legendFontSize: 15 },
        { name: 'Leave', count: data.reduce((acc, item) => acc + item.Leave, 0), color: '#FFCE56', legendFontColor: '#fff', legendFontSize: 15  },
        { name: 'OnDuty', count: data.reduce((acc, item) => acc + item.OnDuty, 0), color: '#4BC0C0', legendFontColor: '#fff', legendFontSize: 15 },
        { name: 'WeekOff', count: data.reduce((acc, item) => acc + item.WeekOff, 0), color: '#9966FF', legendFontColor: '#fff', legendFontSize: 15  },
        { name: 'Holiday', count: data.reduce((acc, item) => acc + item.Holiday, 0), color: '#FF9F40', legendFontColor: '#fff', legendFontSize: 15 },
      ];

      setChartData(chartData);
      setTableData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error.message);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const formatChartData = () => {
    return chartData.map(item => ({
      name: item.name,
      count: item.count,
      color: item.color,
      legendFontColor: item.legendFontColor,
      legendFontSize: 15,
    }));
  };
  const handlePieSegmentClick = (data) => {
    console.log('Segment clicked:', data);
    setSelectedSegment({
      name: data.name,
      count: data.count,
    });
  };
  

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <View style={styles.container}>
      <Text style={styles.tableTitle}>Dashboard</Text>
        <View style={styles.pickerRow}>
        <View style={styles.pickerWrapper}>
  <Text style={styles.label}>Month</Text>
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={selectedMonth}
      style={styles.picker}
      onValueChange={(itemValue) => handleMonthChange(itemValue)}
    >
      {getMonthNames().map((item) => (
        <Picker.Item key={item.value} label={item.label} value={`${new Date().getFullYear()}-${item.value}`} />
      ))}
    </Picker>
  </View>
</View>
</View>
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <>
            <View style={styles.chartContainer}>
            
            <PieChart
  data={formatChartData()}
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
  accessor="count"
  backgroundColor="transparent"
  paddingLeft="15"
  center={[10, 10]}
  absolute
  onPress={(data) => handlePieSegmentClick(data)}
/>

              {selectedSegment && (
                <View style={styles.segmentInfo}>
                  <Text style={styles.segmentText}>Name: {selectedSegment.name}</Text>
                  <Text style={styles.segmentText}>Value: {selectedSegment.count}</Text>
                </View>
              )}
            </View>
            <ScrollView>
              <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Entry Data</Text>
                <Table borderStyle={styles.borderStyle}>
                  <Row
                    data={['Date', 'InTime', 'OutTime']}
                    style={styles.head}
                    textStyle={styles.text}
                  />
                  <Rows
                    data={tableData.map(item => [
                      item.AttDate,
                      item.InTime,
                      item.OutTime,
                    ])}
                    textStyle={styles.text}
                  />
                </Table>
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#090920',
  },
  pickerRow: {
    marginBottom: 20,
     color:"white"
  },
  pickerContainer: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    width: '100%', // Adjust width as needed
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  pickerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
    backgroundColor: '#059A5F',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  segmentInfo: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: 'red',
  },
  segmentText: {
    fontSize: 16,
    color: 'white',
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: '#090920',
    borderRadius: 8,
    padding: 10,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"white"
  },
  head: {
    height: 40,
    backgroundColor: '#059A5F',
  },
  text: {
    margin: 6,
    fontSize: 14,
    color:"white"
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
  },
});

export default Home;
