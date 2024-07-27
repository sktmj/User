import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';

const WorkExperience = () => {
    const Navigation = useNavigation();
  const [experiences, setExperiences] = useState([]);
  const [isFresher, setIsFresher] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [experienceField, setExperienceField] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const [WorkCompany, setWorkCompany] = useState('');
  const [workRelieveReason, setWorkRelieveReason] = useState('');
  const [epfNoVisible, setEpfNoVisible] = useState(false);
  const [regExpExNoVisible, setRegExpExNoVisible] = useState(false);
  const [licenseNoVisible, setLicenseNoVisible] = useState(false);
  const [EPFNO, setEPFNO] = useState('');
  const [UANNO, setUANNO] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [SalesExp, setSalesExp] = useState('');
  const [HealthIssue, setHealthIssue] = useState('');
  const [IsDriving, setIsDriving] = useState('');
  const [LicenseNo, setLicenseNo] = useState('');
  const [IsCompWrkHere, setIsCompWrkHere] = useState('');
  const [CarLicense, setCarLicense] = useState(false);
  const [IsPF, setIsPF] = useState('');
  const [IsRegEmpEx, setIsRegEmpEx] = useState('');
  const [RegExpExNo, setRegExpExNo] = useState('');
  const [licensePic, setLicensePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (token) {
      fetchDesignationOptions();
      fetchExperienceDetails();
      fetchUserDetails();
    }
  }, [token]);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('AppId');
      if (!storedToken) {
        console.log(
          'User is not authenticated. Redirecting to login screen...',
        );
        navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setIsLoggedIn(true);
        setToken(storedToken.trim()); // Ensure token is trimmed of any extra characters
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const handleCheckboxToggle = fieldName => {
    switch (fieldName) {
      case 'IsPF':
        setIsPF(!IsPF);
        break;
      case 'IsRegEmpEx':
        setIsRegEmpEx(!IsRegEmpEx);
        break;
      case 'IsDriving':
        setIsDriving(!IsDriving);
        break;
      case 'CarLicense':
        setCarLicense(!CarLicense);
        break;
      case 'IsCompWrkHere':
        setIsCompWrkHere(!IsCompWrkHere);
        break;
      default:
        break;
    }
  };

  const fetchDesignationOptions = async () => {
    try {
      const response = await axios.get(
        'http://hrm.daivel.in:3000/api/v1/expc/designation',
      );
      setDesignationOptions(response.data);
    } catch (error) {
      console.error('Error fetching Designations: ', error.message);
    }
  };

  const fetchExperienceDetails = async () => {
    try {
      const response = await axios.get(
        'http://hrm.daivel.in:3000/api/v1/expc/getExperience',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const fetchedExperience = response.data.data.map(experience => ({
          ExpId: experience.ExpId,
          CompName: experience.CompName,
          Designation: experience.Designation,
          RefPerson: experience.RefPerson,
          RelieveReason: experience.RelieveReason,
          PhoneNo: experience.PhoneNo,
          FrmMnth: experience.FrmMnth,
          FrmYr: experience.FrmYr,
          ToMnth: experience.ToMnth,
          ToYr: experience.ToYr,
          InitSalary: experience.InitSalary
            ? String(experience.InitSalary)
            : '',
          LastSalary: experience.LastSalary
            ? String(experience.LastSalary)
            : '',
          LastCompany: experience.LastCompany ? 'Y' : 'N',
        }));
        setExperienceField(fetchedExperience);
      } else {
        console.error(
          'Failed to fetch experience details:',
          response.data.message,
        );
      }
    } catch (error) {
      console.error('Error fetching Experience details:', error.message);
      console.error('Error details:', error.response);
     
    }
  };

  const handleExperienceField = () => {
    setExperienceField([
      ...experienceField,
      {
        ExpId: null,
        CompName: '',
        Designation: '',
        LastSalary: '',
        RelieveReason: '',
        RefPerson: '',
        PhoneNo: '',
        FrmMnth: '',
        FrmYr: '',
        ToMnth: '',
        ToYr: '',
        InitSalary: '',
        LastCompany: false,
      },
    ]);
    setFormChanged(true);
  };

  const handleRemoveExperienceField = async index => {
    const fields = [...experienceField];
    const removedField = fields.splice(index, 1)[0];
    setExperienceField(fields);
    setFormChanged(true);

    if (removedField.ExpId) {
      try {
        const response = await axios.delete(
          `http://hrm.daivel.in:3000/api/v1/expc/deleteExperience/${removedField.ExpId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          console.log(
            `Experience with ID ${removedField.ExpId} deleted successfully`,
          );
          Alert.alert('Success', 'Experience deleted successfully');
        } else {
          console.error('Failed to delete experience:', response.data.message);
          Alert.alert('Error', 'Failed to delete experience');
        }
      } catch (error) {
        console.error('Error deleting experience:', error.message);
        Alert.alert('Error', 'Failed to delete experience');
      }
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const fields = [...experienceField];
    fields[index][field] = value;
    setExperienceField(fields);
    setFormChanged(true);
  };

  const handleUpdateExperience = async index => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const experience = experienceField[index];
      const response = await axios.put(
        'http://hrm.daivel.in:3000/api/v1/expc/updateExpc',
        {
          ExpId: experience.ExpId,
          CompName: experience.CompName,
          Designation: experience.selectedDesignation,
          LastSalary: experience.LastSalary,
          RelieveReason: experience.RelieveReason,
          RefPerson: experience.RefPerson,
          PhoneNo: experience.PhoneNo,
          FrmMnth: experience.FrmMnth,
          FrmYr: experience.FrmYr,
          ToMnth: experience.ToMnth,
          ToYr: experience.ToYr,
          InitSalary: experience.InitSalary,
          LastCompany: experience.LastCompany ? 'Y' : 'N',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        Alert.alert('Success', 'Experience updated successfully');
        setFormChanged(false);
      } else {
        console.error('Failed to update experience:', response.data.message);
        Alert.alert('Error', 'Failed to update experience');
      }
    } catch (error) {
      console.error('Error updating experience:', error.message);
      Alert.alert('Error', 'Failed to update experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        'http://hrm.daivel.in:3000/api/v1/expc/getExceDetails',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Use the token from the state
          },
        },
      );
      if (response.data.success) {
        console.log('User details retrieved successfully:', response.data.data);
        // Populate the input fields with the retrieved data
        // Assuming the data is an array with one object
        const userData = response.data.data[0];
        setWorkCompany(userData.WorkCompany);
        setWorkRelieveReason(userData.RelieveReason);
        setEPFNO(userData.EPFNO);
        setUANNO(userData.UANNo);
        setRegExpExNo(userData.RegExpExNo);
        setIsRegEmpEx(userData.IsRegEmpEx);
        setSalesExp(userData.SalesExp);
        setHealthIssue(userData.HealthIssue);
        setIsDriving(userData.IsDriving);
        setLicenseNo(userData.LicenseNo);
        setIsPF(userData.IsPF);
        setIsCompWrkHere(userData.IsCompWrkHere);
        setCarLicense(userData.CarLicense);
      } else {
        console.error('User details retrieval failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      // Handle multiple experiences
      const experiencePromises = experienceField.map(async experience => {
        if (!experience.ExpId) {
          // Add new experience
          return axios.post(
            'http://hrm.daivel.in:3000/api/v1/expc/experienceee',
            {...experience},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } else {
          // Update existing experience
          return axios.put(
            'http://hrm.daivel.in:3000/api/v1/expc/updateExpc',
            {...experience},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
      });

      // Wait for all experience operations to complete
      await Promise.all(experiencePromises);

      // Now handle the total experience update
      const WorkExperienceResponse = await axios.put(
        'http://hrm.daivel.in:3000/api/v1/expc/total',
        {
          WorkCompany,
          RelieveReason: workRelieveReason,
          EPFNO,
          UANNO,
          RegExpExNo: RegExpExNo,
          SalesExp,
          HealthIssue,
          IsDriving: IsDriving ? 'Y' : 'N',
          LicenseNo,
          IsCompWrkHere: IsCompWrkHere ? 'Y' : '',
          IsPF: IsPF ? 'Y' : 'N',
          IsRegEmpEx: IsRegEmpEx ? 'Y' : 'N',
          CarLicense: CarLicense ? 'Y' : 'N',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (WorkExperienceResponse.data.success) {
        console.log('Work experience updated successfully');
        Alert.alert(
          'Success',
          'Experiences and work experience added successfully',
        );
        Navigation.navigate("FamilyDetails")
        setFormChanged(false);
      } else {
        throw new Error(
          WorkExperienceResponse.data.message ||
            'Failed to add work experience',
        );
      }
    } catch (error) {
      console.error('Error adding experiences:', error.message);
      Alert.alert('Error', 'Failed to add experiences');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChooseDocument = async setDocumentState => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res && res.length > 0) {
        const source = res[0].uri;
        setDocumentState(source);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('DocumentPicker Error:', err.message);
        Alert.alert('Error', 'Failed to choose document');
      }
    }
  };

  const handleUpload = async (type, fileUri, endpoint) => {
    if (!fileUri) {
      Alert.alert('Error', `Please select a ${type} to upload.`);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(type, {
        uri: fileUri,
        type: 'image/jpeg',
        name: `${type}.jpg`,
      });

      const response = await axios.post(
        `http://hrm.daivel.in:3000/api/v1/expc/licdoc`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        console.log(`${type} uploaded successfully`);
        Alert.alert('Success', `${type} uploaded successfully`);
      } else {
        console.error('Upload failed:', response.data.message);
        Alert.alert('Error', 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error.message);
      Alert.alert('Error', 'Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Are you a fresher?</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setIsFresher(!isFresher)}>
          <Text style={styles.checkboxText}>{isFresher ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
      </View>
      {!isFresher && (
        <View>
          {experienceField.map((experience, index) => (
            <View key={index} style={styles.experienceContainer}>
              <Text style={styles.heading}>Experience {index + 1}</Text>
              <Text style={styles.text}>Organization</Text>
              <TextInput
                placeholder="Company Name"
                style={styles.input}
                value={experience.CompName}
                onChangeText={value =>
                  handleExperienceChange(index, 'CompName', value)
                }
              />
              <Text style={styles.text}>Select Designation:</Text>

              <Picker
               style={styles.text}
                selectedValue={experience.selectedDesignation}
                onValueChange={value =>
                  handleExperienceChange(index, 'selectedDesignation', value)
                }>
                <Picker.Item style={styles.text} label="Select Designation" value={null} />
                {designationOptions.map(option => (
                  <Picker.Item style={styles.input}
                    key={option.DesignationId.toString()}
                    label={option.DesignationName}
                    value={option.DesignationId}
                  />
                ))}
              </Picker>

              <View style={styles.dateContainer}>
                <Text style={styles.text}>From:</Text>
                <Text style={styles.text}>   Month-</Text> 
                <Picker
                  selectedValue={experience.FrmMnth}
                  style={styles.datePicker}
                  onValueChange={value =>
                    handleExperienceChange(index, 'FrmMnth', value)
                  }>
                  {Array.from({length: 12}, (_, i) => (
                    <Picker.Item 
                      key={i}
                      label={(i + 1).toString()}
                      value={(i + 1).toString()}
                    />
                  ))}
                </Picker>
                <Text style={styles.text}>   Year-</Text>
                <Picker
                  selectedValue={experience.FrmYr}
                  style={styles.datePicker}
                  onValueChange={value =>
                    handleExperienceChange(index, 'FrmYr', value)
                  }>
                  {Array.from({length: 30}, (_, i) => (
                    <Picker.Item
                      key={i}
                      label={(2000 + i).toString()}
                      value={(2000 + i).toString()}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.text}>To:</Text>
                <Text style={styles.text}>   Month-</Text>
                <Picker
                  selectedValue={experience.ToMnth}
                  style={styles.datePicker}
                  onValueChange={value =>
                    handleExperienceChange(index, 'ToMnth', value)
                  }>
                  {Array.from({length: 12}, (_, i) => (
                    <Picker.Item
                      key={i}
                      label={(i + 1).toString()}
                      value={(i + 1).toString()}
                    />
                  ))}
                </Picker>
                <Text style={styles.text}>   Year-</Text>
                <Picker
                  selectedValue={experience.ToYr}
                  style={styles.datePicker}
                  onValueChange={value =>
                    handleExperienceChange(index, 'ToYr', value)
                  }>
                  {Array.from({length: 30}, (_, i) => (
                    <Picker.Item
                      key={i}
                      label={(2000 + i).toString()}
                      value={(2000 + i).toString()}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={styles.text}>Initial Salary :</Text>
              <TextInput
                placeholder="Initial Salary"
                style={styles.input}
                keyboardType="numeric"
                value={experience.InitSalary}
                onChangeText={value =>
                  handleExperienceChange(index, 'InitSalary', value)
                }
              />
              <Text style={styles.text}>Last Salary :</Text>
              <TextInput
                placeholder="Last Salary"
                style={styles.input}
                keyboardType="numeric"
                value={experience.LastSalary}
                onChangeText={value =>
                  handleExperienceChange(index, 'LastSalary', value)
                }
              />

              <Text style={styles.text}>Reason for Leaving:</Text>
              <TextInput
                placeholder="Reason for Leaving"
                style={styles.input}
                value={experience.RelieveReason}
                onChangeText={value =>
                  handleExperienceChange(index, 'RelieveReason', value)
                }
              />
              <Text style={styles.text}>Reference Person:</Text>
              <TextInput
                placeholder="Reference Person"
                style={styles.input}
                value={experience.RefPerson}
                onChangeText={value =>
                  handleExperienceChange(index, 'RefPerson', value)
                }
              />
              <Text style={styles.text}>Reference Number:</Text>
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                keyboardType="numeric"
                value={experience.PhoneNo}
                onChangeText={value =>
                  handleExperienceChange(index, 'PhoneNo', value)
                }
              />

              <View style={styles.checkboxContainer}>
                <Text style={styles.checkboxLabel}>Last Company?</Text>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    handleExperienceChange(
                      index,
                      'LastCompany',
                      !experience.LastCompany,
                    )
                  }>
                  <Text style={styles.checkboxText}>
                    {experience.LastCompany ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.removeButton}
                  title="Remove"
                  onPress={() => handleRemoveExperienceField(index)}
                  color="red">
                  <Text style={styles.removeButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateButton}
                  title="Update"
                  onPress={() => handleUpdateExperience(index)}
                  disabled={isSubmitting}>
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            onPress={handleExperienceField}
            style={styles.addButton}>
            <Icon name="plus" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Experience</Text>
          </TouchableOpacity>
        </View>
      )}

      {isSubmitting && <ActivityIndicator size="large" color="#0000ff" />}

      <View>
        {/* <Text style={styles.heading}>Current Working Company</Text> */}
        <Text style={styles.text}>current working company :</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Working Company"
          value={WorkCompany}
          onChangeText={setWorkCompany}
        />
        <Text style={styles.text}>reason for relieving :</Text>
        <TextInput
          style={styles.input}
          placeholder="Reason for Relieving"
          value={workRelieveReason}
          onChangeText={setWorkRelieveReason}
        />

        {/* Checkbox for EPNNO */}
        <View style={styles.checkboxGroup}>
          <Text style={styles.text}>Is driving a car?</Text>
          <TouchableOpacity onPress={() => handleCheckboxToggle('IsDriving')}>
            <Icon
              name={IsDriving ? 'check-square-o' : 'square-o'}
              size={20}
              color={IsDriving ? 'green' : 'black'}
            />
          </TouchableOpacity>
        </View>
        {IsDriving && (
          <View style={styles.inputContainer}>
            <Text style={styles.text}>License Number:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={LicenseNo}
              onChangeText={text => setLicenseNo(text)}
              placeholder="Enter License Number"
            />
          </View>
        )}
        <Text style={styles.text}>UAN NO</Text>
        <TextInput style={styles.input} value={UANNO} onChangeText={setUANNO} />

        <View style={styles.checkboxGroup}>
          <Text style={styles.text}>do you have reg?</Text>
          <TouchableOpacity onPress={() => handleCheckboxToggle('IsRegEmpEx')}>
            <Icon
              name={IsRegEmpEx ? 'check-square-o' : 'square-o'}
              size={20}
              color={IsRegEmpEx ? 'green' : 'black'}
            />
          </TouchableOpacity>
        </View>
        {IsRegEmpEx && (
          <View style={styles.inputContainer}>
            <Text style={styles.text}>reg Number:</Text>
            <TextInput
              style={styles.input}
              value={RegExpExNo}
              onChangeText={text => setRegExpExNo(text)}
              placeholder="Enter Registration Number"
              keyboardType="numeric"
            />
          </View>
        )}
        <Text style={styles.text}>Textile / Jewellery Experience :</Text>
        <TextInput
          style={styles.input}
          value={SalesExp}
          onChangeText={setSalesExp}
        />
        <Text style={styles.text}>Any Health Issue :</Text>
        <TextInput
          style={styles.input}
          placeholder="Any Health Issue"
          value={HealthIssue}
          onChangeText={setHealthIssue}
        />

        {/* Checkbox for LicenseNo */}
        <View style={styles.checkboxGroup}>
          <Text style={styles.text}>do you Drive bike?</Text>
          <TouchableOpacity onPress={() => handleCheckboxToggle('IsDriving')}>
            <Icon
              name={IsDriving ? 'check-square-o' : 'square-o'}
              size={20}
              color={IsDriving ? 'green' : 'black'}
            />
          </TouchableOpacity>
        </View>
        {IsDriving && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={LicenseNo}
              onChangeText={text => setLicenseNo(text)}
              placeholder="Enter License Number"
              keyboardType="numeric"
            />
          </View>
        )}

        <View>
          {/* Checkbox for IsCompWrkHere */}
          {/* <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setCarLicense(!CarLicense)}>
            <Icon
              name={CarLicense ? 'check-square-o' : 'square-o'}
              size={20}
              color="black"
            />
            <Text style={styles.text}> Ready To Work In All Branches?</Text>
          </TouchableOpacity> */}
        </View>
        {/* Checkbox for IsCompWrkHere */}

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkboxTouchable}
            onPress={() => handleCheckboxToggle('IsCompWrkHere')}>
            <Icon
              name={IsCompWrkHere ? 'check-square-o' : 'square-o'}
              size={20}
              color={IsCompWrkHere ? 'green' : 'black'}
            />
            <Text style={styles.text}>Do you work with all braches</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkboxTouchable}
            onPress={() => handleCheckboxToggle('CarLicense')}>
            <Icon
              name={CarLicense ? 'check-square-o' : 'square-o'}
              size={20}
              color={CarLicense ? 'green' : 'black'}
            />
            <Text style={styles.text}>Car License</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>License Pic</Text>
          <View style={styles.fileInputContainer}>
            <Button
              title="Choose License"
              onPress={() => handleChooseDocument(setLicensePic)}
              disabled={loading}
            />
            <Button
              title="Upload License"
              onPress={() =>
                handleUpload('CarLicenseDoc', licensePic, 'licdoc')
              }
              disabled={!licensePic || loading}
            />
          </View>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {licensePic && (
            <View style={styles.imageContainer}>
              <Text  style={styles.text}  >Selected Document:</Text>
              <Text style={styles.fileName}>{licensePic}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save and Proceed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    color:"black"
  },
  submitButton: {
    backgroundColor: '#059A5F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color:"black"
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  datePicker: {
    flex: 1,
    height: 80,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    marginLeft: 8,
    padding: 8,
    color:"black"
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginRight: 8,
    color:"black"
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  checkbox: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    color:"black"
  },
  checkboxText: {
    fontSize: 16,
     color:"black"
  },
  experienceContainer: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    marginBottom: 12,
    color:"black"
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E6F7E',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#28a745', // Green color for update button
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#1E6F7E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  addButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  image: {width: 200, height: 200, marginTop: 10},
  imageContainer: {alignItems: 'center', marginTop: 10},

  fileName: {marginTop: 10, fontSize: 16, color: '#555'},
});

export default WorkExperience;
