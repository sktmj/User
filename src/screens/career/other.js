
import {
    View,
    Text,
    ScrollView,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import Icon from "react-native-vector-icons/FontAwesome";
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import { Picker } from "@react-native-picker/picker";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const Other = () => {
    const Navigation = useNavigation();
    const [CurrentSalary, setCurrentSalary] = useState("");
    const [expectSalary, setExpectSalary] = useState("");
    const [knowCompany, setKnowCompany] = useState("");
    const [isCompWrkHere, setIsCompWrkHere] = useState(false);
    const [refPerName, setRefPerName] = useState("");
    const [refPerAdd, setRefPerAdd] = useState("");
    const [refPerPhNo, setRefPerPhNo] = useState("");
    const [familyReason, setFamilyReason] = useState(false);
    const [earnMoney, setEarnMoney] = useState(false);
    const [gainExp, setGainExp] = useState(false);
    const [socialSts, setSocialSts] = useState(false);
    const [betterLife, setBetterLife] = useState(false);
    const [wrkInt, setWrkInt] = useState(false);
    const [compBrand, setCompBrand] = useState(false);
    const [othReason, setOthReason] = useState(false);
    const [expDOJ, setExpDOJ] = useState("");
    const [isAccNeed, setIsAccNeed] = useState(false);
    const [sectionTrns, setSectionTrns] = useState(false);
    const [jobApplied, setJobApplied] = useState("");
    const [factoryId, setFactoryId] = useState("");
    const [LocationOptions, setLocationOptions] = useState([]);
    const [nearByName1, setNearByName1] = useState("");
    const [nearByAdd1, setNearByAdd1] = useState("");
    const [nearByPin1, setNearByPin1] = useState("");
    const [nearByPhNo1, setNearByPhNo1] = useState("");
    const [nearByName2, setNearByName2] = useState("");
    const [nearByAdd2, setNearByAdd2] = useState("");
    const [nearByPin2, setNearByPin2] = useState("");
    const [nearByPhNo2, setNearByPhNo2] = useState("");
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedTaluk, setSelectedTaluk] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [presentCountries, setPresentCountries] = useState([]);
    const [presentStates, setPresentStates] = useState([]);
    const [presentDistricts, setPresentDistricts] = useState([]);
    const [presentTaluks, setPresentTaluks] = useState([]);
    const [presentCities, setPresentCities] = useState([]);
    const [selectedPresentCountry, setSelectedPresentCountry] = useState("");
    const [selectedPresentState, setSelectedPresentState] = useState("");
    const [selectedPresentDistrict, setSelectedPresentDistrict] = useState("");
    const [selectedPresentTaluk, setSelectedPresentTaluk] = useState("");
    const [selectedPresentCity, setSelectedPresentCity] = useState("");
    const [showRefPersonDetails, setShowRefPersonDetails] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
      checkAuthentication();
     
    }, []);
    useEffect(() => {
      if (token) {
        fetchPersonalDetails(); // Fetch user details when token is available
        fetchLocation();
        fetchCountries();
        fetchPresentCountries();
      }
    }, [token]);
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
        const storedToken = await AsyncStorage.getItem("AppId");
        if (!storedToken) {
          console.log("User is not authenticated. Redirecting to login screen...");
          navigation.navigate("Login");
        } else {
          console.log("User is authenticated.");
          setIsLoggedIn(true);
          setToken(storedToken.trim()); // Ensure token is trimmed of any extra characters
        }
      } catch (error) {
        console.error("Error checking authentication:", error.message);
      }
    };
    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          "http://hrm.daivel.in:3000/api/v1/other/location"
        );
        setLocationOptions(response.data);
      } catch (error) {
        console.error("Error fetching location: ", error.message);
      }
    };
    ////////////////////////////////////////////////////////
    const fetchCountries = () => {
      axios
        .get("http://hrm.daivel.in:3000/api/v1/prsl/getAllCountries")
        .then((response) => {
          setCountries(response.data);
        })
        .catch((error) => console.error("Error fetching countries:", error));
    };
  
    const fetchStatesByCountry = (countryId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/states/${countryId}`)
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => console.error("Error fetching states:", error));
    };
  
    const fetchDistrictsByState = (stateId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/districts/${stateId}`)
        .then((response) => {
          setDistricts(response.data);
        })
        .catch((error) => console.error("Error fetching districts:", error));
    };
  
    const fetchTaluksByDistrict = (districtId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/taluk/${districtId}`)
        .then((response) => {
          const formattedTaluks = response.data.map((taluk) => ({
            TalukId: taluk.TalukId,
            TalukName: taluk.TalukName,
          }));
          setTaluks(formattedTaluks);
        })
        .catch((error) => console.error("Error fetching Taluks:", error));
    };
  
    const fetchCitiesByTaluk = (talukId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/city/${talukId}`)
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => console.error("Error fetching Cities:", error));
    };
  
    ///////////////////////////////////////////////////////
    const fetchPresentCountries = () => {
      console.log(setPresentCountries, "dfdfdfdf");
      axios
        .get("http://hrm.daivel.in:3000/api/v1/prsl/presentCountries")
        .then((response) => {
          // Assuming the response.data is an array of country objects
          setPresentCountries(response.data);
        })
        .catch((error) =>
          console.error("Error fetching present countries:", error)
        );
    };
  
    const fetchPresentStatesByCountry = (countryId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/PresentState/${countryId}`)
        .then((response) => {
          setPresentStates(response.data);
        })
        .catch((error) => console.error("Error fetching states:", error));
    };
    const fetchPresentDistrictsByState = (stateId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/districts/${stateId}`)
        .then((response) => {
          setPresentDistricts(response.data);
        })
        .catch((error) => console.error("Error fetching districts:", error));
    };
  
    const fetchPresentTaluksByDistrict = (districtId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/taluk/${districtId}`)
        .then((response) => {
          const formattedTaluks = response.data.map((taluk) => ({
            TalukId: taluk.TalukId,
            TalukName: taluk.TalukName,
          }));
          setPresentTaluks(formattedTaluks);
        })
        .catch((error) => console.error("Error fetching Taluks:", error));
    };
  
    const fetchPresentCitiesByTaluk = (talukId) => {
      axios
        .get(`http://hrm.daivel.in:3000/api/v1/prsl/city/${talukId}`)
        .then((response) => {
          setPresentCities(response.data);
        })
        .catch((error) => console.error("Error fetching Cities:", error));
    };
    ////////////////////////////////////////////////////////
    const handleDateConfirm = (date) => {
      const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      setExpDOJ(formattedDate);
      setDatePickerVisibility(false);
    };
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
    
    
    const handleSubmit = async () => {
    
      try {
        const response = await axios.post(
          "http://hrm.daivel.in:3000/api/v1/other/others",
          {
            CurrentSalary: CurrentSalary,
            ExpectSalary: expectSalary,
            KnowCompany: knowCompany,
            IsCompWrkHere: isCompWrkHere ? "Y" : "N",
            RefPerName: refPerName,
            RefPerAdd: refPerAdd,
            RefPerPhNo: refPerPhNo,
            FamilyReason: familyReason ? "Y" : "N",
            EarnMoney: earnMoney ? "Y" : "N",
            GainExp: gainExp ? "Y" : "N",
            SocialSts: socialSts ? "Y" : "N",
            BetterLife: betterLife ? "Y" : "N",
            WrkInt: wrkInt ? "Y" : "N",
            CompBrand: compBrand ? "Y" : "N",
            OthReason: othReason ? "Y" : "N",
            ExpDOJ: expDOJ,
            IsAccNeed: isAccNeed ? "Y" : "N",
            SectionTrns: sectionTrns ? "Y" : "N",
            JobApplied: jobApplied,
            FactoryId: factoryId,
            NearByName1: nearByName1,
            NearByAdd1: nearByAdd1,
            NearByCity1: selectedCity,
            NearByDistrict1: selectedDistrict,
            NearByState1: selectedState,
            NearByCntry1: selectedCountry,
            NearByPin1: nearByPin1,
            NearByPhNo1: nearByPhNo1,
            NearByTaluk1: selectedTaluk,
            NearByName2: nearByName2,
            NearByAdd2: nearByAdd2,
            NearByCity2: selectedPresentCity,
            NearByDistrict2: selectedPresentDistrict,
            NearByState2: selectedPresentState,
            NearByCntry2: selectedPresentCountry,
            NearByPin2: nearByPin2,
            NearByPhNo2: nearByPhNo2,
            NearByTaluk2: selectedPresentTaluk,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          Alert.alert("Success", "Other fields added successfully");
          Navigation.navigate("uploads")
          console.log(response.data);
          // Navigate to next screen or perform any other action
        } else {
          Alert.alert("Error", "Failed to add other fields");
        }
      } catch (error) {
        console.error("Error:", error.message);
        Alert.alert("Error", "Failed to add data");
      }
    };
    
  
    
    const fetchPersonalDetails = async () => {
      try {
        const response = await axios.get(
          "http://hrm.daivel.in:3000/api/v1/other/getOthers",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          console.log("User others details retrieved successfully:", response.data.data);
          const userData = response.data.data[0];
          setCurrentSalary(userData.CurrentSalary ? userData.CurrentSalary.toString() : "");
        setExpectSalary(userData.ExpectSalary ? userData.ExpectSalary.toString() : "");
          setKnowCompany(userData.KnowCompany || "");
          setIsCompWrkHere(userData.IsCompWrkHere || false);
          setRefPerName(userData.RefPerName || "");
          setRefPerAdd(userData.RefPerAdd || "");
          setRefPerPhNo(userData.RefPerPhNo || "");
          setFamilyReason(userData.FamilyReason || false);
          setEarnMoney(userData.EarnMoney || false);
          setGainExp(userData.GainExp || false);
          setSocialSts(userData.SocialSts || false)
          setExpDOJ(userData.ExpDOJ || "");
          setIsAccNeed(userData.IsAccNeed || false);
          setSectionTrns(userData.SectionTrns || false);
          setJobApplied(userData.JobApplied || "");
          setFactoryId(userData.FactoryId || "");
          setNearByName1(userData.NearByName1 || "");
          setNearByAdd1(userData.NearByAdd1 || "");
          setSelectedCity(userData.NearByCity1 || "");
          setSelectedDistrict(userData.NearByDistrict1 || "");
          setSelectedState(userData.NearByState1 || "");
          setSelectedCountry(userData.NearByCntry1 || "");
          setNearByPin1(userData.NearByPin1 || "");
          setNearByPhNo1(userData.NearByPhNo1 || "");
          setSelectedTaluk(userData.NearByTaluk1 || "");
          setNearByName2(userData.NearByName2 || "");
          setNearByAdd2(userData.NearByAdd2 || "");
          setSelectedPresentCity(userData.NearByCity2 || "");
          setSelectedPresentDistrict(userData.NearByDistrict2 || "");
          setSelectedPresentState(userData.NearByState2 || "");
          setSelectedPresentCountry(userData.NearByCntry2 || "");
          setNearByPin2(userData.NearByPin2 || "");
          setNearByPhNo2(userData.NearByPhNo2 || "");
          setSelectedPresentTaluk(userData.NearByTaluk2 || "");
        } else {
          console.error("User details retrieval failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };
    
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Others Details</Text>
        <View style={styles.formRow}>
          <View style={styles.formColumn}>
          <Text style={styles.text}>Current Salary :</Text>
          <TextInput
    style={styles.input}
    placeholder="Current Salary"
    keyboardType="numeric"
    value={CurrentSalary}
    onChangeText={setCurrentSalary}
  />
         <Text style={styles.text}>Expectation Salary :</Text>
        <TextInput
        style={styles.input}
          placeholder="Expectation Salary"
          value={expectSalary}
          keyboardType="numeric"
          onChangeText={setExpectSalary}
        />
        <Text style={styles.text}>How did you know about our company :</Text>
            <TextInput
              style={styles.input}
              placeholder="How did you know about our company"
              value={knowCompany}
              onChangeText={setKnowCompany}
            />
  
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsCompWrkHere(!isCompWrkHere)}
            >
              <Icon
                name={isCompWrkHere ? "check-square-o" : "square-o"}
                size={20}
                color="black"
              />
              
              <Text style={styles.text}>Any Friends/Relative Working Here? </Text>
            </TouchableOpacity>
            {/* Only show Job Reference Person Details section if the checkbox is checked */}
            {isCompWrkHere && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Job Reference Person Details
                </Text>
                <Text style={styles.text}>Name : </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={refPerName}
                  onChangeText={setRefPerName}
                />
                <Text style={styles.text}>Address : </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={refPerAdd}
                  onChangeText={setRefPerAdd}
                />
                   <Text style={styles.text}>Phone No : </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone No"
                  keyboardType="numeric"
                  value={refPerPhNo}
                  onChangeText={setRefPerPhNo}
                />
              </View>
            )}
         <Text style={styles.sectionTitle}>Reasons for Joining</Text>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Family Reason</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setFamilyReason(!familyReason)}
              >
                <Icon
                  name={familyReason ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 10, marginTop: 10 }} />
            <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Earn Money</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setEarnMoney(!earnMoney)}
              >
                <Icon
                  name={earnMoney ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 10, marginTop: 10 }} />
            <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Gain Experience</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setGainExp(!gainExp)}
              >
                <Icon
                  name={gainExp ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 10, marginTop: 10 }} />
            <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Social Status</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSocialSts(!socialSts)}
              >
                <Icon
                  name={socialSts ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 10, marginTop: 10 }} />
            <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Better Life</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setBetterLife(!betterLife)}
              >
                <Icon
                  name={betterLife ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 10, marginTop: 10 }} />
            <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Company Brand</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setCompBrand(!compBrand)}
              >
                <Icon
                  name={compBrand ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 10, marginTop: 10 }} />
            <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Other Reason</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setOthReason(!othReason)}
              >
                <Icon
                  name={othReason ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
        
        
            <View style={styles.inputGroup}>
            <Text style={styles.text}>Expected Date of Joining:</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.input}>{expDOJ}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />
          </View>
  
          <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Is Accomadation Needed?</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsAccNeed(!isAccNeed)}
              >
                <Icon
                  name={isAccNeed ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
             
  
              {/* Add some margin between checkboxes */}
              <View style={{ marginLeft: 10, marginTop: 30 }} />
              <View style={styles.checkboxContainer}>
              <Text style={styles.text}>Accepts Section Transfer?</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSectionTrns(!sectionTrns)}
              >
                <Icon
                  name={sectionTrns ? "check-square-o" : "square-o"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
             
  
          
            </View>
            {/* <Text style={{ marginLeft: 10,  fontSize: 16 }}>
     Job Applied For:
    </Text> */}
            <View style={{ marginTop: 30 }}>
            <Text style={styles.text}> Job Applied For   : </Text>
              <TextInput
                style={styles.input}
                value={jobApplied}
                onChangeText={setJobApplied}
              />
  
  <Text style={styles.text}> select location   : </Text>
              <Picker
                selectedValue={factoryId}
                onValueChange={(itemValue, itemIndex) => setFactoryId(itemValue)}
              >
                <Picker.Item style={styles.input}label="Select Location" value="" />
                {LocationOptions.map((option, index) => (
                  <Picker.Item style={styles.input}
                    key={`${option.FactoryId}_${index}`}
                    label={option.FactoryName}
                    value={option.FactoryId}
                  />
                ))}
              </Picker>
  
              <Text style={styles.sectionTitle}>
                Any Two Persons Details(Except Relatives)
              </Text>
              <Text style={styles.text}> Name  : </Text>
              <TextInput
                style={styles.input}
                placeholder="Name:"
                value={nearByName1}
                onChangeText={setNearByName1}
              />
               <Text style={styles.text}>Address : </Text>
              <TextInput
                style={styles.input}
                placeholder="Address:"
                value={nearByAdd1}
                onChangeText={setNearByAdd1}
              />
             <Text style={styles.text}>select country: </Text>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={(itemValue) => {
                  setSelectedCountry(itemValue);
                  setSelectedState("");
                  setSelectedDistrict("");
                  setSelectedTaluk("");
                  setSelectedCity("");
                  fetchStatesByCountry(itemValue);
                }}
              >
                <Picker.Item style={styles.text} label="Select Country" value="" />
                {countries.map((country, index) => (
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
              <Text style={styles.text}>select state: </Text>
                <Picker
                  selectedValue={selectedState}
                  onValueChange={(itemValue) => {
                    setSelectedState(itemValue);
                    setSelectedDistrict("");
                    setSelectedTaluk("");
                    setSelectedCity("");
                    fetchDistrictsByState(itemValue);
                  }}
                >
                  <Picker.Item style={styles.text} label="Select State" value="" />
                  {states.map((state, index) => (
                    <Picker.Item style={styles.input}
                      key={`${state.state_gid}_${index}`}
                      label={state.state_name}
                      value={state.state_gid}
                    />
                  ))}
                </Picker>
  
                <Text style={styles.text}>select district: </Text>
                <Picker
                  selectedValue={selectedDistrict}
                  onValueChange={(itemValue) => {
                    setSelectedDistrict(itemValue);
                    fetchTaluksByDistrict(itemValue); // Fetch taluks based on selected district
                  }}
                >
                  <Picker.Item style={styles.text} label="Select District" value="" />
                  {districts.map((district, index) => (
                    <Picker.Item style={styles.input}
                      key={`${district.DistrictId}_${index}`}
                      label={district.Districtname}
                      value={`${district.DistrictId}`}
                    />
                  ))}
                </Picker>
                <View style={styles.inputContainer}>
                <Text style={styles.text}>select taluk: </Text>
                  <Picker
                    selectedValue={selectedTaluk}
                    onValueChange={(itemValue) => {
                      setSelectedTaluk(itemValue);
                      fetchCitiesByTaluk(itemValue); // Call fetchCitiesByTaluk when selected taluk changes
                    }}
                  >
                    <Picker.Item style={styles.text} label="Select Taluk" value="" />
                    {taluks.map((taluk, index) => (
                      <Picker.Item style={styles.input}
                        key={`${taluk.TalukId}_${index}`}
                        label={taluk.TalukName}
                        value={taluk.TalukId}
                      />
                    ))}
                  </Picker>
  
                     <Text style={styles.text}>select city: </Text>
                  <Picker
                    selectedValue={selectedCity}
                    onValueChange={(itemValue) => {
                      setSelectedCity(itemValue);
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
                <Text style={styles.text}>pin code: </Text>
              <TextInput
                style={styles.input}
                placeholder="Pin:"
                keyboardType="numeric"
                value={nearByPin1}
                onChangeText={setNearByPin1}
              />
    <Text style={styles.text}>phone no: </Text>
              <TextInput
                style={styles.input}
                placeholder="Ph No:"
                keyboardType="numeric"
                value={nearByPhNo1}
                onChangeText={setNearByPhNo1}
              />
              </View>
              {/* Second Person's Details */}
              <Text style={styles.sectionTitle}>Second Person's Details</Text>
              {/* Country */}
              <Text style={styles.text}>select country: </Text>
              <Picker
                selectedValue={selectedPresentCountry}
                onValueChange={(itemValue) => {
                  setSelectedPresentCountry(itemValue); // Update selected country state
                  fetchPresentStatesByCountry(itemValue); // Fetch states based on selected country
                }}
              >
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
              <Text style={styles.text}>select state: </Text>
                <Picker
                  selectedValue={selectedPresentState}
                  onValueChange={(itemValue) => {
                    setSelectedPresentState(itemValue); // Update selected country state
                    fetchPresentDistrictsByState(itemValue); // Fetch states based on selected country
                  }}
                >
                  <Picker.Item  style={styles.text} label="Select State" value="" />
                  {presentStates.map((state, index) => (
                    <Picker.Item style={styles.input}
                      key={`${state.state_gid}_${index}`}
                      label={state.state_name}
                      value={state.state_gid}
                    />
                  ))}
                </Picker>
  
                <Text style={styles.text}>select district: </Text>
                <Picker
                  selectedValue={selectedPresentDistrict}
                  onValueChange={(itemValue) => {
                    setSelectedPresentDistrict(itemValue); // Update selected country state
                    fetchPresentTaluksByDistrict(itemValue); // Fetch states based on selected country
                  }}
                >
                  <Picker.Item style={styles.text} label="Select District" value="" />
                  {presentDistricts.map((district, index) => (
                    <Picker.Item style={styles.input}
                      key={`${district.DistrictId}_${index}`}
                      label={district.Districtname}
                      value={`${district.DistrictId}`}
                    />
                  ))}
                </Picker>
                <View style={styles.inputContainer}>
                <Text style={styles.text}>select taluk: </Text>
                  <Picker
                    selectedValue={selectedPresentTaluk}
                    onValueChange={(itemValue) => {
                      setSelectedPresentTaluk(itemValue); // Update selected country state
                      fetchPresentCitiesByTaluk(itemValue); // Fetch states based on selected country
                    }}
                  >
                    <Picker.Item style={styles.text} label="Select Taluk" value="" />
                    {presentTaluks.map((taluk, index) => (
                      <Picker.Item style={styles.input}
                        key={`${taluk.TalukId}_${index}`}
                        label={taluk.TalukName}
                        value={taluk.TalukId}
                      />
                    ))}
                  </Picker>
  
                  <Text style={styles.text}>select city: </Text>
                  <Picker
                    selectedValue={selectedPresentCity}
                    onValueChange={(itemValue) => {
                      setSelectedPresentCity(itemValue);
                    }}
                    enabled={presentCities.length > 0} // Disable picker if cities are not fetched
                  >
                    <Picker.Item style={styles.text}  label="Select City" value="" />
                    {presentCities.map((city, index) => (
                      <Picker.Item style={styles.input}
                        key={`${city.city_gid}_${index}`}
                        label={city.city_name}
                        value={city.city_gid}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <Text style={styles.text}>pin code: </Text>
              <TextInput
                style={styles.input}
                placeholder="Pin:"
                keyboardType="numeric"
                value={nearByPin2}
                onChangeText={setNearByPin2}
              />
    <Text style={styles.text}>phone no: </Text>
              <TextInput
                style={styles.input}
                placeholder="Ph No:"
                keyboardType="numeric"
                value={nearByPhNo2}
                onChangeText={setNearByPhNo2}
              />
  
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    formRow: {
      flexDirection: "row",
      marginBottom: 20,
    },
    formColumn: {
      flex: 1,
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
      backgroundColor:"#059A5F",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    checkboxText: {
      marginLeft: 8,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 10,
      color:"black"
    },
    calendarIcon: {
      position: "absolute",
      right: 15,
      top: "50%",
      transform: [{ translateY: -12 }],
    },
    text: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
      textTransform: "uppercase",
    }
  });
  
  export default Other;