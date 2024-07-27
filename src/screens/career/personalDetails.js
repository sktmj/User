import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const PersonalDetails = () => {
  const [personalDetails, setPersonalDetails] = useState({
    AppName: '',
    FatherName: '',
    DOB: '',
    Gender: '',
    BloodGrp: '',
    Martialstatus: '',
    MarriageDate: '',
    Religion: '',
    MobileNo: '',
    CasteId: '',
    Nativity: '',
    ResAddress1: '',
    ResCountryId: '',
    ResStateId: '',
    ResDistrictId: '',
    ResTalukId: '',
    ResCityId: '',
    ResPincode: '',
    ResPhoneNo: '',
    PerAddress1: '',
    PerCountryId: '',
    PerStateId: '',
    PerDistrictId: '',
    PerTalukId: '',
    PerCityId: '',
    PerPincode: '',
    PerPhoneNo: '',
    LandMark: '',
    EmailId: '',
    PANNo: '',
    AadharNo: '',
  });
  const Navigation = useNavigation();
  const [showMarriageDateInput, setShowMarriageDateInput] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);
  const [mobileValid, setMobileValid] = useState(true);
  const [religion, setReligion] = useState([]);
  const [caste, setCaste] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedCaste, setSelectedCaste] = useState('');
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [presentCountries, setPresentCountries] = useState([]);
  const [presentStates, setPresentStates] = useState([]);
  const [presentDistricts, setPresentDistricts] = useState([]);
  const [presentTaluks, setPresentTaluks] = useState([]);
  const [presentCities, setPresentCities] = useState([]);
  const [selectedPresentCountry, setSelectedPresentCountry] = useState('');
  const [selectedPresentState, setSelectedPresentState] = useState('');
  const [selectedPresentDistrict, setSelectedPresentDistrict] = useState('');
  const [selectedPresentTaluk, setSelectedPresentTaluk] = useState('');
  const [selectedPresentCity, setSelectedPresentCity] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isDOBDatePickerVisible, setDOBDatePickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isMarriageDatePickerVisible, setMarriageDatePickerVisibility] =
    useState(false);
  useEffect(() => {
    checkAuthentication();
    fetchCountries();
    fetchReligion();
    fetchPresentCountries();
  }, []);
  useEffect(() => {
    setShowMarriageDateInput(
      personalDetails.Martialstatus === 'M' ||
        personalDetails.MarriageDate !== '',
    );
  }, [personalDetails.Martialstatus, personalDetails.MarriageDate]);

  useEffect(() => {
    setSelectedCountry(personalDetails.ResCountryId);
    setSelectedState(personalDetails.ResStateId);
    setSelectedDistrict(personalDetails.ResDistrictId);
    setSelectedTaluk(personalDetails.ResTalukId);
    setSelectedCity(personalDetails.ResCityId);
  }, [personalDetails]);

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  useEffect(() => {
    if (personalDetails.DOB) {
      calculateAge(personalDetails.DOB); // Call calculateAge when personalDetails.DOB changes
    }
  }, [personalDetails.DOB]);
  useEffect(() => {
    if (selectedDistrict) {
      fetchTaluksByDistrict(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedPresentDistrict) {
      fetchPresentTaluksByDistrict(selectedPresentDistrict);
    }
  }, [selectedPresentDistrict]);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('AppId');
      if (!token) {
        console.log(
          'User is not authenticated. Redirecting to login screen...',
        );
        Navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(token);
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const storedToken = token;
      const response = await axios.get(
        'http://hrm.daivel.in:3000/api/v1/prsl/getPrsl',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      if (response.data.success) {
        console.log('User details retrieved successfully:', response.data.data);
        const userData = response.data.data[0];

        // Format the DOB to YYYY-MM-DD
        if (userData.DOB) {
          userData.DOB = new Date(userData.DOB).toISOString().split('T')[0];
        }
        if (userData.MarriageDate) {
          userData.MarriageDate = new Date(userData.MarriageDate)
            .toISOString()
            .split('T')[0];
        }
        // Ensure correct field name for PANNo
        if (userData.PANNo) {
          userData.PANNo = userData.PANNo; // Ensure correct field name used
        }
        // Update state with retrieved user details
        setPersonalDetails(prevDetails => ({
          ...prevDetails,
          ...userData, // Update all fields from userData
        }));

        // Set other state variables as needed (selectedCountry, selectedState, etc.)
        // setSelectedCountry(userData.ResCountryId);
        // setSelectedState(userData.ResStateId);
        // setSelectedDistrict(userData.ResDistrictId);
        // setSelectedTaluk(userData.ResTalukId);
        // setSelectedCity(userData.ResCityId);
      } else {
        console.error('User details retrieval failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const token = 'your_generated_token_here';
      setToken(token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    Navigation.navigate('Login');
  };

  /////////////////////////////////////////
  const fetchCountries = () => {
    axios
      .get('http://hrm.daivel.in:3000/api/v1/prsl/getAllCountries')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => console.error('Error fetching countries:', error));
  };

  const fetchStatesByCountry = countryId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/states/${countryId}`)
      .then(response => {
        setStates(response.data); // Assuming the response.data is an array of state objects
      })
      .catch(error => console.error('Error fetching states:', error));
  };
  const fetchDistrictsByState = stateId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/districts/${stateId}`)
      .then(response => {
        setDistricts(response.data); // Assuming the response.data is an array of district objects
      })
      .catch(error => console.error('Error fetching districts:', error));
  };
  const fetchTaluksByDistrict = districtId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/taluk/${districtId}`)
      .then(response => {
        const formattedTaluks = response.data.map(taluk => ({
          TalukId: taluk.TalukId,
          TalukName: taluk.TalukName,
        }));
        setTaluks(formattedTaluks); // Assuming the response.data is an array of taluk objects
      })
      .catch(error => console.error('Error fetching Taluks:', error));
  };

  const fetchCitiesByTaluk = talukId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/city/${talukId}`)
      .then(response => {
        setCities(response.data); // Assuming the response.data is an array of city objects
      })
      .catch(error => console.error('Error fetching Cities:', error));
  };
  //////////////////////////////////////////////////
  const fetchPresentCountries = () => {
    console.log(setPresentCountries, 'dfdfdfdf');
    axios
      .get('http://hrm.daivel.in:3000/api/v1/prsl/presentCountries')
      .then(response => {
        // Assuming the response.data is an array of country objects
        setPresentCountries(response.data);
      })
      .catch(error =>
        console.error('Error fetching present countries:', error),
      );
  };

  const fetchPresentStatesByCountry = countryId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/PresentState/${countryId}`)
      .then(response => {
        setPresentStates(response.data);
      })
      .catch(error => console.error('Error fetching states:', error));
  };
  const fetchPresentDistrictsByState = stateId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/districts/${stateId}`)
      .then(response => {
        setPresentDistricts(response.data);
      })
      .catch(error => console.error('Error fetching districts:', error));
  };

  const fetchPresentTaluksByDistrict = districtId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/taluk/${districtId}`)
      .then(response => {
        const formattedTaluks = response.data.map(taluk => ({
          TalukId: taluk.TalukId,
          TalukName: taluk.TalukName,
        }));
        setPresentTaluks(formattedTaluks);
      })
      .catch(error => console.error('Error fetching Taluks:', error));
  };

  const fetchPresentCitiesByTaluk = talukId => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/city/${talukId}`)
      .then(response => {
        setPresentCities(response.data);
      })
      .catch(error => console.error('Error fetching Cities:', error));
  };

  const handleChange = (field, value) => {
    console.log(field, value, 'gggggggggggg');
    if (field === 'DOB') {
      calculateAge(value); // Calculate age when date of birth changes
    }
    if (field === 'ResPhoneNo') {
      setPhoneValid(value.length >= 10);
    }

    if (field === 'MobileNo') {
      setMobileValid(value.length >= 10);
    }

    // Update the state after calculating age
    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      [field]: value,
    }));
    // Set showMarriageDateInput based on the selected marital status
    if (field === 'Martialstatus') {
      setShowMarriageDateInput(value === 'M');
    }
  };
  // const handlePickerChange = (field, value) => {
  //   setPersonalDetails((prevDetails) => ({
  //     ...prevDetails,
  //     [field]: value,
  //   }));
  // };
  const showDOBDatePicker = () => {
    setDOBDatePickerVisibility(true);
  };

  const handleConfirmMarriageDate = date => {
    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      MarriageDate: date.toISOString().split('T')[0],
    }));
    hideMarriageDatePicker();
  };

  const handleDateChange = date => {
    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      DOB: date.toISOString().split('T')[0],
    }));
    setDatePickerVisibility(false);
  };

  const handleMarriageDateChange = date => {
    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      MarriageDate: date.toISOString().split('T')[0],
    }));
    setMarriageDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showMarriageDatePicker = () => {
    setMarriageDatePickerVisibility(true);
  };

  const hideMarriageDatePicker = () => {
    setMarriageDatePickerVisibility(false);
  };

  const handleConfirmDOB = date => {
    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      DOB: date.toISOString().split('T')[0],
    }));
    hideDatePicker();
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://hrm.daivel.in:3000/api/v1/prsl/updatePersonalDetails',
        personalDetails, // Send the entire personalDetails object
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        console.log('Personal details updated successfully:', response.data);
        Alert.alert('Success', 'Personal details saved successfully.');
        Navigation.navigate('AcademicDetails');
      } else {
        console.error(
          'Error updating personal details:',
          response.data.message,
        );
        Alert.alert(
          'Error',
          'An error occurred while updating personal details.',
        );
      }
    } catch (error) {
      console.error('Error handling form submission:', error.message);
      Alert.alert(
        'Error',
        'An error occurred while submitting the form. Please try again later.',
      );
    }
  };

  const handlePickerChange = (name, value) => {
    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleConfirm = date => {
    if (date) {
      const selectedDate = new Date(date);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setPersonalDetails(prevDetails => ({
        ...prevDetails,
        DOB: formattedDate,
      }));
      calculateAge(formattedDate); // Call calculateAge after setting DOB
    }
    hideDatePicker();
  };

  const handleConfirmMariageDate = date => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setPersonalDetails(prevDetails => ({
        ...prevDetails,
        MarriageDate: formattedDate, // Correct the field name to "MarriageDate"
      }));
    }
    hideDatePicker();
  };
  const handleConfirmDate = date => {
    const formattedDate = date.toISOString().split('T')[0];
    setPersonalDetails({
      ...personalDetails,
      marriageDate: formattedDate,
    });
    hideDatePicker();
  };
  const calculateAge = dob => {
    if (!dob) {
      setPersonalDetails(prevDetails => ({
        ...prevDetails,
        age: '', // Clear the age if date of birth is not provided
      }));
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    console.log('Calculated ageeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:', age);

    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      age: age.toString(),
    }));
  };
  const fetchReligion = () => {
    axios
      .get('http://hrm.daivel.in:3000/api/v1/prsl/getReligion')
      .then(response => {
        setReligion(response.data);
      })
      .catch(error => console.error('Error fetching Religion:', error));
  };

  const fetchCasteByReligion = religion_gid => {
    axios
      .get(`http://hrm.daivel.in:3000/api/v1/prsl/caste/${religion_gid}`)
      .then(response => {
        setCaste(response.data); // Set the caste state with the fetched caste data
      })
      .catch(error => console.error('Error fetching Castes:', error));
  };

  useEffect(() => {
    if (selectedReligion) {
      fetchCasteByReligion(selectedReligion); // Fetch castes when selected religion changes
    }
  }, [selectedReligion]);

  const handleChangeReligion = (field, value) => {
    if (field === 'Religion') {
      setSelectedReligion(value); // Update selected religion state
      setPersonalDetails(prevDetails => ({
        ...prevDetails,
        Religion: value, // Update only the Religion field in personalDetails state
      }));
    } else if (field === 'CasteId') {
      setSelectedCaste(value); // Update selected caste state
      setPersonalDetails(prevDetails => ({
        ...prevDetails,
        CasteId: value, // Update only the CasteId field in personalDetails state
      }));
    } else {
      setPersonalDetails(prevDetails => ({
        ...prevDetails,
        [field]: value, // Update other fields without affecting religion and caste
      }));
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Personal Details</Text>
      <View style={styles.formRow}>
        <View style={styles.formColumn}>
          <Text style={styles.text}>Name :</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={personalDetails.AppName}
            onChangeText={value => handleChange('AppName', value)}
            placeholderTextColor="#888"
          />
          <Text style={styles.text}>FATHER'S NAME:</Text>
          <TextInput
            style={styles.input}
            placeholder="Father Name"
            value={personalDetails.FatherName}
            onChangeText={value => handleChange('FatherName', value)}
            placeholderTextColor="#888"
          />
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Date of Birth:</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.input}> {personalDetails.DOB || 'Select Date of Birth'} </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDOB}
              onCancel={hideDatePicker}
            />
          </View>

          <Text style={styles.text}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={personalDetails.age} // Display the age value from personalDetails state
            editable={false}
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>GANDER:</Text>

          <Picker style={styles.input}
            selectedValue={personalDetails.Gender}
            onValueChange={itemValue => handleChange('Gender', itemValue)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="M" />
            <Picker.Item label="Female" value="F" />
            <Picker.Item label="Others" value="O" />
          </Picker>
        </View>

        <Text style={styles.text}>BLOOD GROUP :</Text>
        <TextInput
          style={styles.input}
          placeholder="BloodGroup"
          value={personalDetails.BloodGrp}
          onChangeText={Text => handleChange('BloodGrp', Text)}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>Marital Status:</Text>
        <Picker
          selectedValue={personalDetails.Martialstatus}
          onValueChange={value => handlePickerChange('Martialstatus', value)}
          style={styles.input}>
          <Picker.Item label="Select Marital Status" value="" />
          <Picker.Item label="Single" value="S" />
          <Picker.Item label="Married" value="M" />
          <Picker.Item label="Daivorce" value="D" />
        </Picker>
      </View>
      {showMarriageDateInput && (
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Marriage Date:</Text>
          <TouchableOpacity
            onPress={showMarriageDatePicker}
            >
            <Text style={styles.input}>
              {personalDetails.MarriageDate || 'Select Marriage Date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isMarriageDatePickerVisible}
            mode="date"
            date={
              personalDetails.MarriageDate
                ? new Date(personalDetails.MarriageDate)
                : new Date()
            }
            onConfirm={handleMarriageDateChange}
            onCancel={hideMarriageDatePicker}
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.text}>SELECT RELIGION :</Text>
        <Picker style={styles.input}
          selectedValue={selectedReligion}
          onValueChange={itemValue => {
            setSelectedReligion(itemValue);
            setSelectedCaste('');
            fetchCasteByReligion(itemValue);
            setPersonalDetails({...personalDetails, Religion: itemValue});
          }}>
          <Picker.Item label="Select Religion" value="" />
          {religion.map((religion, index) => (
            <Picker.Item
              key={`${religion.religion_gid}_${index}`}
              label={religion.religion_name}
              value={religion.religion_gid}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.text}>SELECT CASTE :</Text>
        <Picker
          selectedValue={selectedCaste}
          onValueChange={itemValue => {
            setSelectedCaste(itemValue);
            setPersonalDetails({
              ...personalDetails,
              CasteId: itemValue,
            }); // Update personal details state
          }}
          enabled={caste.length > 0} // Disable picker if caste data is not fetched
        >
          <Picker.Item style={styles.text}  label="Select Caste" value="" />
          {caste.map(
            (
              casteItem,
              index, // Corrected variable name from city to casteItem
            ) => (
              <Picker.Item  style={styles.input}
                key={`${casteItem.caste_gid}_${index}`}
                label={casteItem.caste_name} // Corrected property name to caste_name
                value={casteItem.caste_gid} // Corrected property name to caste_gid
              />
            ),
          )}
        </Picker>
      </View>
      <Text style={styles.text}>NATIVE :</Text>
      <TextInput
        style={styles.input}
        placeholder="Native"
        value={personalDetails.Nativity}
        onChangeText={value => handleChange('Nativity', value)}
        placeholderTextColor="#888"
      />
      {/* Render other personal details text inputs */}

      {/* Residential Address */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Residential Address</Text>
        <Text style={styles.text}>ADDRESS:</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={personalDetails.ResAddress1}
          onChangeText={value => handleChange('ResAddress1', value)}
          placeholderTextColor="#888"
        />
        <Text style={styles.text}>SELECT COUNTRY :</Text>
        <Picker
          selectedValue={selectedCountry}
          onValueChange={itemValue => {
            setSelectedCountry(itemValue);
            fetchStatesByCountry(itemValue);
            setPersonalDetails({...personalDetails, ResCountryId: itemValue});
          }}>
          <Picker.Item style={styles.text}  label="Select Country" value="" />
          {countries.map(country => (
            <Picker.Item style={styles.input}
              key={country.country_gid}
              label={country.country_name}
              value={country.country_gid}
            />
          ))}
        </Picker>

        {/* Repeat this pattern for other address fields */}
        {/* For brevity, I'll just show one */}

        <View style={styles.inputContainer}>
          <Text style={styles.text}>SELECT STATE :</Text>
          <Picker
            selectedValue={selectedState}
            onValueChange={itemValue => {
              setSelectedState(itemValue);
              setSelectedDistrict('');
              setSelectedTaluk('');
              setSelectedCity('');
              fetchDistrictsByState(itemValue);
              setPersonalDetails({...personalDetails, ResStateId: itemValue});
            }}>
            <Picker.Item style={styles.text} label="Select State" value="" />
            {states.map((state, index) => (
              <Picker.Item style={styles.input}
                key={`${state.state_gid}_${index}`}
                label={state.state_name}
                value={state.state_gid}
              />
            ))}
          </Picker>

          <Text style={styles.text}>SELECT DISTRICT :</Text>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={itemValue => {
              setSelectedDistrict(itemValue);
              fetchTaluksByDistrict(itemValue); // Fetch taluks based on selected district
              setPersonalDetails({
                ...personalDetails,
                ResDistrictId: itemValue,
              }); // Update personal details state
            }}>
            <Picker.Item style={styles.text} label="Select District" value="" />
            {districts.map((district, index) => (
              <Picker.Item style={styles.input}
                key={`${district.DistrictId}_${index}`}
                label={district.Districtname}
                value={`${district.DistrictId}`}
              />
            ))}
          </Picker>

          <Text style={styles.text}>SELECT TALUK :</Text>
          <Picker
            selectedValue={selectedTaluk}
            onValueChange={itemValue => {
              setSelectedTaluk(itemValue);
              fetchCitiesByTaluk(itemValue); // Call fetchCitiesByTaluk when selected taluk changes
              setPersonalDetails({
                ...personalDetails,
                ResTalukId: itemValue,
              }); // Update personal details state
            }}>
            <Picker.Item style={styles.text} label="Select Taluk" value="" />
            {taluks.map((taluk, index) => (
              <Picker.Item style={styles.input}
                key={`${taluk.TalukId}_${index}`}
                label={taluk.TalukName}
                value={taluk.TalukId}
              />
            ))}
          </Picker>

          <Text style={styles.text}>SELECT CITY :</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={itemValue => {
              setSelectedCity(itemValue);
              setPersonalDetails({
                ...personalDetails,
                ResCityId: itemValue,
              }); // Update personal details state
            }}
            enabled={cities.length > 0} // Disable picker if cities are not fetched
          >
            <Picker.Item style={styles.text} label="Select City" value="" />
            {cities.map((city, index) => (
              <Picker.Item style={styles.input}
                key={`${city.city_gid}_${index}`}
                label={city.city_name}
                value={city.city_gid}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>PINCODE:</Text>
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          keyboardType="numeric"
          value={personalDetails.ResPincode}
          onChangeText={value => handleChange('ResPincode', value)}
          placeholderTextColor="#888"
        />
        <Text style={styles.text}>PHONE NO :</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone No"
          keyboardType="phone-pad"
          value={personalDetails.ResPhoneNo}
          onChangeText={value => handleChange('ResPhoneNo', value)}
          placeholderTextColor="#888"
        />
        {!phoneValid && (
          <Text style={styles.warningText}>
            Phone number must have at least 10 digits
          </Text>
        )}
      </View>

      {/* Present Address */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Present Address</Text>
        {/* <View style={styles.switchContainer}>
          {/* <Text style={styles.switchLabel}>Same as Residential Address</Text> */}
        {/* <Switch
            value={personalDetails.SameAsPresentAddress}
            onValueChange={(value) =>
              handleChange("SameAsPresentAddress", value)
            }
          /> */}
        {/* </View> */}
        {!personalDetails.SameAsPresentAddress && (
          <View>
            <Text style={styles.text}>ADDRESS :</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={personalDetails.PerAddress1}
              onChangeText={value => handleChange('PerAddress1', value)}
              placeholderTextColor="#888"
            />
            <Text style={styles.text}>SELECT COUNTRY:</Text>
            <Picker
              selectedValue={selectedPresentCountry}
              onValueChange={itemValue => {
                setSelectedPresentCountry(itemValue); // Update selected country state
                fetchPresentStatesByCountry(itemValue); // Fetch states based on selected country
                setPersonalDetails({
                  ...personalDetails,
                  PerCountryId: itemValue,
                });
              }}>
              <Picker.Item style={styles.text} label="Select Country" value="" />
              {presentCountries.map((country, index) => (
                <Picker.Item style={styles.input}
                  key={`${country.country_gid}_${index}`}
                  label={country.country_name}
                  value={country.country_gid}
                />
              ))}
            </Picker>
            {/* Repeat this pattern for other address fields */}
            {/* For brevity, I'll just show one */}

            <View style={styles.inputContainer}>
              <Text style={styles.text}>SELECT STATE:</Text>
              <Picker
                selectedValue={selectedPresentState}
                onValueChange={itemValue => {
                  setSelectedPresentState(itemValue); // Update selected country state
                  fetchPresentDistrictsByState(itemValue); // Fetch states based on selected country
                  setPersonalDetails({
                    ...personalDetails,
                    PerStateId: itemValue,
                  });
                }}>
                <Picker.Item style={styles.text}  label="Select State" value="" />
                {presentStates.map((state, index) => (
                  <Picker.Item style={styles.input}
                    key={`${state.state_gid}_${index}`}
                    label={state.state_name}
                    value={state.state_gid}
                  />
                ))}
              </Picker>

              <Text style={styles.text}>SELECT DISTRICT :</Text>
              <Picker
                selectedValue={selectedPresentDistrict}
                onValueChange={itemValue => {
                  setSelectedPresentDistrict(itemValue); // Update selected country state
                  fetchPresentTaluksByDistrict(itemValue); // Fetch states based on selected country
                  setPersonalDetails({
                    ...personalDetails,
                    PerDistrictId: itemValue,
                  });
                }}>
                <Picker.Item style={styles.text} label="Select District" value="" />
                {presentDistricts.map((district, index) => (
                  <Picker.Item style={styles.input}
                    key={`${district.DistrictId}_${index}`}
                    label={district.Districtname}
                    value={`${district.DistrictId}`}
                  />
                ))}
              </Picker>

              <Text style={styles.text}>SELECT TALUK:</Text>
              <Picker
                selectedValue={selectedPresentTaluk}
                onValueChange={itemValue => {
                  setSelectedPresentTaluk(itemValue); // Update selected country state
                  fetchPresentCitiesByTaluk(itemValue); // Fetch states based on selected country
                  setPersonalDetails({
                    ...personalDetails,
                    PerTalukId: itemValue,
                  });
                }}>
                <Picker.Item style={styles.text} label="Select Taluk" value="" />
                {presentTaluks.map((taluk, index) => (
                  <Picker.Item style={styles.input}
                    key={`${taluk.TalukId}_${index}`}
                    label={taluk.TalukName}
                    value={taluk.TalukId}
                  />
                ))}
              </Picker>

              <Text style={styles.text}>SELECT CITY :</Text>
              <Picker
                selectedValue={selectedPresentCity}
                onValueChange={itemValue => {
                  setSelectedPresentCity(itemValue);
                  setPersonalDetails({
                    ...personalDetails,
                    PerCityId: itemValue,
                  });
                }}
                enabled={presentCities.length > 0} // Disable picker if cities are not fetched
              >
                <Picker.Item style={styles.text} label="Select City" value="" />
                {presentCities.map((city, index) => (
                  <Picker.Item style={styles.input}
                    key={`${city.city_gid}_${index}`}
                    label={city.city_name}
                    value={city.city_gid}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.text}>PINCODE:</Text>
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="numeric"
              value={personalDetails.PerPincode}
              onChangeText={value => handleChange('PerPincode', value)}
              placeholderTextColor="#888"
            />
            <Text style={styles.text}>PHONE NO :</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone No"
              keyboardType="numeric"
              value={personalDetails.PerPhoneNo}
              onChangeText={value => handleChange('PerPhoneNo', value)}
              placeholderTextColor="#888"
            />
          </View>
        )}
      </View>

      {/* Other Details */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Other Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>LAND MARK :</Text>
          <TextInput
            style={styles.input}
            placeholder="Land Mark"
            value={personalDetails.LandMark}
            onChangeText={value => handleChange('LandMark', value)}
            placeholderTextColor="#888"
          />
          <Text style={styles.text}>MOBILE NO:</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile No"
            keyboardType="numeric"
            value={personalDetails.MobileNo}
            onChangeText={value => handleChange('MobileNo', value)}
            placeholderTextColor="#888"
          />
          {!mobileValid && (
            <Text style={styles.warningText}>
              Mobile number must have at least 10 digits
            </Text>
          )}

          <Text style={styles.text}>ALTERNATE NO:</Text>
          <TextInput
            style={styles.input}
            placeholder="ALTERNATE NO"
            value={personalDetails.PassportNo}
            onChangeText={value => handleChange('PassportNo', value)}
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
          <Text style={styles.text}>EMAIL :</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={personalDetails.EmailId}
            onChangeText={value => handleChange('EmailId', value)}
            placeholderTextColor="#888"
          />
          <Text style={styles.text}>PAN NO :</Text>
          <TextInput
            style={styles.input}
            placeholder="Pan No"
            value={personalDetails.PANNo}
            onChangeText={value => handleChange('PANNo', value)}
            placeholderTextColor="#888"
            keyboardType="numeric"
          />

          <Text style={styles.text}>AADHAR NO:</Text>
          <TextInput
            style={styles.input}
            placeholder="Aadhar No"
            keyboardType="numeric"
            value={personalDetails.AadharNo}
            onChangeText={value => handleChange('AadharNo', value)}
           
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save and Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 12, // Add this to position the calendar icon
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    color:"black"
  },
  button: {
    backgroundColor: '#059A5F',
    paddingVertical: 12,
    paddingHorizontal: 16, // Adjusted for better visibility
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase',
  },
});

export default PersonalDetails;
