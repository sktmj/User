import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';  // Import moment for date formatting

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [profileDetails, setProfileDetails] = useState({});

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
      if (!storedToken) {
        console.log('User is not authenticated. Redirecting to login screen...');
        Navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken); // Assuming you need to use EmployeeId as token or for display purposes.
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get('http://hrm.daivel.in:3000/api/v2/pro/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setProfileDetails(response.data.data[0]);
      } else {
        console.error('Failed to fetch profile details');
      }
    } catch (error) {
      console.error('Error fetching profile details:', error.message);
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Image source={require('../../assets/mini.jpg')} style={styles.profileImage} />
          <Text style={styles.profileName}>{profileDetails.Name || 'User Name'}</Text>
          <Text style={styles.profileDesignation}>{profileDetails.DesignationName || 'Designation'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Biometric Code:</Text>
            <Text style={styles.infoText}>{profileDetails.BiometricCode || ''}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Date of Birth:</Text>
            <TextInput
              style={styles.input}
              value={profileDetails.DateofBirth ? formatDate(profileDetails.DateofBirth) : ''}
              editable={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Date of Joining:</Text>
            <TextInput
              style={styles.input}
              value={profileDetails.DateofJoining ? formatDate(profileDetails.DateofJoining) : ''}
              editable={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Employee Name:</Text>
            <Text style={styles.infoText}>
              {profileDetails.Name || ''} / {profileDetails.DesignationName || ''}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Mobile No:</Text>
            <View style={styles.infoCardWithIcon}>
              <TextInput
                style={styles.input}
                value={profileDetails.MobileNo || ''}
                editable={false}
              />
              <Icon name="phone" size={24} style={styles.icon} />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Father/Guardian Name:</Text>
            <TextInput
              style={styles.input}
              value={profileDetails.FatherName || ''}
              editable={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Alternate Mobile No:</Text>
            <View style={styles.infoCardWithIcon}>
              <TextInput
                style={styles.input}
                value={profileDetails.alternatemobileno || ''}
                editable={false}
              />
              <Icon name="phone" size={24} style={styles.icon} />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Spouse Name:</Text>
            <TextInput
              style={styles.input}
              value={profileDetails.SpouseName || ''}
              editable={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Spouse Mobile No:</Text>
            <View style={styles.infoCardWithIcon}>
              <TextInput
                style={styles.input}
                value={profileDetails.SpouseMobileNo || ''}
                editable={false}
              />
              <Icon name="phone" size={24} style={styles.icon} />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Mother Name:</Text>
            <TextInput
              style={styles.input}
              value={profileDetails.MotherName || ''}
              editable={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Mother Mobile No:</Text>
            <View style={styles.infoCardWithIcon}>
              <TextInput
                style={styles.input}
                value={profileDetails.MotherMobileNo || ''}
                editable={false}
              />
              <Icon name="phone" size={24} style={styles.icon} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0f2e2', // Light gray background
  },
  scrollView: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#00796B',  // Bright Blue
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileDesignation: {
    fontSize: 28,
    color: '#fff', // Bright Yellow
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#FF5722', // Orange accent
  },
  infoCardWithIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color:    '#666',
    marginBottom: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#FF5722', // Orange accent
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input:{
    color:"black"
  }
});

export default Profile;
