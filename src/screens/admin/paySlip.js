import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const Payslip = ({ navigation }) => {
  const [EmployeeId, setEmployeeId] = useState('');
  const [token, setToken] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [payslipData, setPayslipData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);
  
  useEffect(() => {
    if (token && EmployeeId && selectedMonth && selectedYear) {
      fetchPayslipData();
    }
  }, [token, EmployeeId, selectedMonth, selectedYear]);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('EmployeeId');
      const storedFactoryId = await AsyncStorage.getItem('FactoryId');

      if (!storedToken || !storedFactoryId) {
        navigation.navigate('Login');
      } else {
        setToken(storedToken);
        setEmployeeId(storedToken);
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchPayslipData = async () => {
    if (!EmployeeId) {
      Alert.alert('Error', 'Employee ID is required');
      return;
    }
  
    try {
      const startOfMonth = moment(`${selectedYear}-${selectedMonth}-01`, 'YYYY-MM-DD');
      const fromDate = startOfMonth.clone().subtract(1, 'month').endOf('month').date(29).format('YYYY-MM-DD');
      const toDate = startOfMonth.clone().date(28).format('YYYY-MM-DD');
  
      const response = await axios.get(`http://hrm.daivel.in:3000/api/v2/pay/payslip/${EmployeeId}`, {
        params: { FromDate: fromDate, ToDate: toDate },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const formattedData = response.data.map((item) => ({
        ...item,
        BasicPay: formatCurrency(item.BasicPay),
        FixedSalary: formatCurrency(item.FixedSalary),
        HRA: formatCurrency(item.HRA),
        DA: formatCurrency(item.DA),
        Incentive: formatCurrency(item.Incentive),
        Penalty: formatCurrency(item.Penalty),
        TDS: item.TDS.map((tds) => formatCurrency(tds)),
        ESI: formatCurrency(item.ESI),
        NetSalary: formatCurrency(item.NetSalary),
        OTPrice: formatCurrency(item.OTPrice),
        Leave: formatCurrency(item.Leave),
        Lossofpay: formatCurrency(item.Lossofpay),
        SecDeposit: formatCurrency(item.SecDeposit),
        Wastage: formatCurrency(item.Wastage),
        Advance: formatCurrency(item.Advance),
        LWF: formatCurrency(item.LWF),
        BankName: (item.BankName),
        AccountNo: (item.AccountNo),
        PFNo: (item.PFNo),
        ESINo: (item.ESINo),
        DateofJoining: (item.DateofJoining),
        Present: (item.Present),
        Leave: (item.Leave),
        TotDays: (item.TotDays)
      }));
  
      setPayslipData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching payslip data:', err);
      setError('Failed to fetch payslip data');
    }
  };
  
  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };
  
  const formatCurrency = (value) => Number(value).toFixed(2);

  const months = moment.months();
  const years = Array.from({ length: 10 }, (_, i) => moment().year() - i);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Payslip</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Month:</Text>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
          >
            {months.map((month, index) => (
              <Picker.Item key={index} label={month} value={index + 1} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Year:</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
        {/* <TouchableOpacity style={styles.button} onPress={fetchPayslipData}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity> */}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {payslipData && (
        <View style={styles.detailsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Employee Information</Text>
            {renderInfoRow('Name', payslipData[0]?.Name)}
            {renderInfoRow('ECNO', payslipData[0]?.BioMetricCode)}
            {renderInfoRow('Department', payslipData[0]?.DesignationName)}
            {renderInfoRow('Date Of Joining', formatDate(payslipData[0]?.DateofJoining))}
            {renderInfoRow('Bank', payslipData[0]?.BankName)}
            {renderInfoRow('Acc NO', payslipData[0]?.AccountNo)}
            {renderInfoRow('PF NO', payslipData[0]?.PFNo)}
            {renderInfoRow('ESI NO', payslipData[0]?.ESINo)}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Attendance Details</Text>
            {renderInfoRow('Month Days', payslipData[0]?.TotDays)}
            {renderInfoRow('Present', payslipData[0]?.Present)}
            {renderInfoRow('Leave', payslipData[0]?.Leave)}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Earnings</Text>
            {renderDetailRow('Fixed Salary', payslipData[0]?.FixedSalary)}
            {renderDetailRow('Basic Salary', payslipData[0]?.BasicPay)}
            {renderDetailRow('HRA', payslipData[0]?.HRA)}
            {renderDetailRow('DA', payslipData[0]?.DA)}
            {renderDetailRow('Incentive', payslipData[0]?.Incentive)}
            {renderDetailRow('OverTime', payslipData[0]?.OTPrice)}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Deductions</Text>
            {renderDeductionRow('Tax', payslipData[0]?.TDS.reduce((acc, cur) => acc + Number(cur), 0))}
            {renderDeductionRow('ESI', payslipData[0]?.ESI)}
            {renderDeductionRow('EPF', payslipData[0]?.EPF)}
            {renderDeductionRow('Penalty', payslipData[0]?.Penalty)}
            {renderDeductionRow('Advance', payslipData[0]?.Advance)}
            {renderDeductionRow('TDS', payslipData[0]?.TDS)}
            {renderDeductionRow('LWF', payslipData[0]?.LWF)}
            {renderDeductionRow('Deposit', payslipData[0]?.SecDeposit)}
            {renderDeductionRow('Wastage', payslipData[0]?.Wastage)}
            {renderDeductionRow('Lost of Pay', payslipData[0]?.Lossofpay)}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Final Calculation</Text>
            {renderFinalRow('Net Salary', payslipData[0]?.NetSalary)}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// Helper components for rendering rows
const renderInfoRow = (label, value) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || 'N/A'}</Text>
  </View>
);

const renderDetailRow = (label, value) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>₹{value || '0.00'}</Text>
  </View>
);

const renderDeductionRow = (label, value) => (
  <View style={styles.deductionRow}>
    <Text style={styles.deductionLabel}>{label}:</Text>
    <Text style={styles.deductionValue}>₹{value || '0.00'}</Text>
  </View>
);

const renderFinalRow = (label, value) => (
  <View style={styles.finalRow}>
    <Text style={styles.finalLabel}>{label}:</Text>
    <Text style={styles.finalValue}>₹{value || '0.00'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d0f2e2',
  },
  header: {
    padding: 16,
    backgroundColor: '#00796B',
    borderBottomWidth: 4,
    borderBottomColor: '#004D40',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    marginVertical: 16,
  },
  pickerContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    color: '#00796B',
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#00796B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    borderColor: '#004D40',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#004D40',
    paddingBottom: 8,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
   
  },
  infoLabel: {
    fontWeight: '600',
    width: '40%',
    color: '#00796B',
  },
  infoValue: {
    width: '60%',
    color:"black",
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    width: '50%',
    color: '#00796B',
  },
  detailValue: {
    width: '50%',
    textAlign: 'right',
    color: 'black',
  },
  deductionRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  deductionLabel: {
    fontWeight: '600',
    width: '50%',
    color: '#D32F2F',
  },
  deductionValue: {
    width: '50%',
    textAlign: 'right',
    color: '#D32F2F',
  },
  finalRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  finalLabel: {
    fontWeight: '600',
    width: '50%',
    color: '#00796B',
  },
  finalValue: {
    width: '50%',
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796B',
  },
});

export default Payslip;
