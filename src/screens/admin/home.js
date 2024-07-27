// HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { Table, Row, Rows } from 'react-native-table-component';

// Get device width for chart responsiveness
const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const [tableHead] = useState(["#", "Date", "InTime", "OutTime"]);
  const [tableData] = useState([
    ['1', '12/5/2024', '9:00', '18:30'],
    // Add more rows as needed
  ]);
  const [entryHead] = useState(["#", "Date", "InTime", "OutTime"]);
  const [entryData] = useState([
    ['1', '12/5/2024', '9:00', '18:30'],
    // Add more rows as needed
  ]);

  // Data for the pie chart
  const chartData = [
    {
      name: 'Attendance',
      population: 60,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Leave',
      population: 20,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Weekoff',
      population: 20,
      color: '#FFCE56',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // Optional
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Target</Text>
            <Picker style={styles.picker}>
              <Picker.Item label="Attendance" value="default" />
              <Picker.Item label="Target" value="default" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Attendance</Text>
            <Picker style={styles.picker}>
              <Picker.Item label="May-2024" value="default" />
              <Picker.Item label="June-2024" value="default" />
              <Picker.Item label="July-2024" value="default2" />
            </Picker>
          </View>
        </View>

        <PieChart
          data={chartData}
          width={screenWidth - 40} // Adjust as needed
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
        />

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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5fcff',
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
    color: '#333',
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
  },
  borderStyle: {
    borderWidth: 2,
    borderColor: '#c8e1ff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
  },
});

export default Home;
