import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";


const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const[profileDetails,setProfileDetails]=useState([])

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
        console.log(
          'User is not authenticated. Redirecting to login screen...',
        );
        Navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken); // Assuming you need to use EmployeeId as token or for display purposes.
        // Assuming you need to use FactoryId.
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };


  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/v2/pro/profile', {
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
  

  return (
    <SafeAreaView contentContainerStyle={styles.container}>
    <ScrollView>
      <Image source={require('../../assets/mini.jpg')} style={styles.profileImage} />

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Biometric Code :</Text>
        <Text style={styles.input}>{profileDetails.BiometricCode || ''}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Date of Birth :</Text>
        <TextInput
          style={styles.input}
          value={profileDetails.DateofBirth || ''}
          editable={false}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Date of Joining :</Text>
        <TextInput
          style={styles.input}
          value={profileDetails.DateofJoining || ''}
          editable={false}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Employee Name :</Text>
        <Text style={styles.input}>
          {profileDetails.Name || ''} / {profileDetails.DesignationName || ''}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.input}
          value={profileDetails.MobileNo || ''}
          editable={false}
        />
        <Icon name="phone" size={24} style={styles.icon} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Father/Guardian Name :</Text>
        <TextInput
          style={styles.input}
          value={profileDetails.FatherName || ''}
          editable={false}
        />
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.inputWithIcon}
          value={profileDetails.alternatemobileno || ''}
          editable={false}
        />
        <Icon name="phone" size={24} style={styles.icon} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Spouse Name :</Text>
        <TextInput
          style={styles.input}
          value={profileDetails.SpouseName || ''}
          editable={false}
        />
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.inputWithIcon}
          value={profileDetails.SpouseMobileNo || ''}
          editable={false}
        />
        <Icon name="phone" size={24} style={styles.icon} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Mother Name :</Text>
        <TextInput
          style={styles.input}
          value={profileDetails.MotherName || ''}
          editable={false}
        />
      </View>
      <View style={styles.infoContainer}>
        <TextInput
        style={styles.input}
          
          value={profileDetails.MotherMobileNo || ''}
          editable={false}
        />
        <Icon name="phone" size={24} style={styles.icon} />
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 75,
      alignSelf: 'center',
      marginBottom: 16,
    },
    infoContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      backgroundColor: '#f5f5f5',
      color:'black'
    },
    inputWithIcon: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      backgroundColor: '#f5f5f5',
      marginBottom: 8,
    },
    icon: {
      position: 'absolute',
      top: 12,
      right: 12,
      color: '#888',
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default Profile