import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [profileDetails, setProfileDetails] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
    }
  }, [token]);

  useEffect(() => {
    if (profileDetails.EmployeeId) {
      console.log('EmployeeId:', profileDetails.EmployeeId); // Ensure it is not undefined
    } else {
      console.error('EmployeeId is not defined');
    }
  }, [profileDetails]);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('EmployeeId');
      if (!storedToken) {
        console.log(
          'User is not authenticated. Redirecting to login screen...',
        );
        // Navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchUserDetails = async token => {
    try {
      const response = await axios.get(
        'http://hrm.daivel.in:3000/api/v2/pro/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setProfileDetails(response.data.data[0]);
      } else {
        console.error('Failed to fetch profile details');
      }
    } catch (error) {
      console.error('Error fetching profile details:', error.message);
    }
  };

  const formatDate = dateString => {
    return moment.utc(dateString).format('DD/MM/YYYY');
  };

  const handleImagePress = () => {
    const newImageUri = `http://hrm.daivel.in:3000/api/v2/pro/pic/${profileDetails.EmployeeId}?t=${new Date().getTime()}`;
    console.log('Image URI:', newImageUri); // Log the URI
    setImageUri(newImageUri);
    setModalVisible(true);
  };

  const employeeId = profileDetails.EmployeeId || ''; // Ensure it’s a valid string

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={{
                uri: `http://hrm.daivel.in:3000/api/v2/pro/pic/${employeeId}?t=${new Date().getTime()}`,
              }}
              style={styles.profileImage}
              onError={error =>
                console.error('Image loading error:', error.nativeEvent.error)
              }
              onLoad={() => console.log('Image loaded successfully')}
              onLoadEnd={() => console.log('Image load ended')}
              onLoadStart={() => console.log('Image load started')}
              onProgress={event =>
                console.log('Image load progress:', event.nativeEvent.loaded)
              }
            />
          </TouchableOpacity>

          <Text style={styles.profileName}>
            {profileDetails.Name || 'User Name'}
          </Text>
          <Text style={styles.profileDesignation}>
            {profileDetails.DesignationName || 'Designation'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Biometric Code:</Text>
            <Text style={styles.infoText}>
              {profileDetails.BiometricCode || ''}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Date of Birth:</Text>
            <TextInput
              style={styles.input}
              value={
                profileDetails.DateofBirth
                  ? formatDate(profileDetails.DateofBirth)
                  : ''
              }
              editable={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Date of Joining:</Text>
            <TextInput
              style={styles.input}
              value={
                profileDetails.DateofJoining
                  ? formatDate(profileDetails.DateofJoining)
                  : ''
              }
              editable={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Employee Name:</Text>
            <Text style={styles.infoText}>
              {profileDetails.Name || ''} /{' '}
              {profileDetails.DesignationName || ''}
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

        {/* Full-View Image Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.fullSizeImage}
                  resizeMode="contain"
                  onError={error => console.error('Modal image loading error:', error.nativeEvent.error)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090920', // Premium light gray background
  },
  scrollView: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#090920', // Dark Navy
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
    width: 150, // Increased size
    height: 150, // Increased size
    borderRadius: 75, // Adjusted for new size
    borderWidth: 8, // Increased border width
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileDesignation: {
    fontSize: 20,
    color: '#fff', // Light Gray
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
    borderLeftColor: '#FF8E8F', // Blue accent
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
    color: '#666',
    marginBottom: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for the modal
  },
  modalContent: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ensures the image fits within the modal
  },
  modalCloseButton: {
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Profile;
