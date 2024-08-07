import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Bank = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      await checkAuthentication();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (token) {
      fetchBankDetails(token);
    }
  }, [token]);

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
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchBankDetails = async (token) => {
    try {
      const EmployeeId = await AsyncStorage.getItem('EmployeeId');
      if (!EmployeeId) {
        throw new Error('EmployeeId is not available');
      }

      const response = await axios.get(`http://hrm.daivel.in:3000/api/v2/info/bank/${EmployeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.length > 0) {
        setBankDetails(response.data[0]);
      } else {
        setError('No bank details found.');
      }
    } catch (error) {
      console.error('Error fetching bank details:', error.message);
      setError('Failed to fetch bank details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00796B" style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {bankDetails ? (
        <View style={styles.card}>
          <Text style={styles.title}>Bank Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Aadhar No:</Text>
            <Text style={styles.value}>{bankDetails.AadharNo || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Account No:</Text>
            <Text style={styles.value}>{bankDetails.AccountNo || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>IFSC Code:</Text>
            <Text style={styles.value}>{bankDetails.IFSCCode || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Bank Name:</Text>
            <Text style={styles.value}>{bankDetails.BankName || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Branch Name:</Text>
            <Text style={styles.value}>{bankDetails.Branchname || 'N/A'}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>No bank details available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#d0f2e2',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEDED',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    borderColor: '#004D40',
    borderWidth: 1,
    width: '90%', // Adjust width as needed
    maxWidth: 380, // Set a maximum width if necessary
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#004D40',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    width: '40%',
    color: '#00796B',
    fontSize: 16,
  },
  value: {
    width: '60%',
    color: '#004D40',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 18,
  },
  noDataText: {
    color: '#004D40',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});

export default Bank;
