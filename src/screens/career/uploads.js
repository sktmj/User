import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Uploads = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [mobilePicture, setMobilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('AppId');
      if (!storedToken) {
        console.log('User is not authenticated. Redirecting to login screen...');
        navigation.navigate('Login');
      } else {
        console.log('User is authenticated.');
        setToken(storedToken.trim());
      }
    } catch (error) {
      console.error('Error checking authentication:', error.message);
    }
  };

  const handleChooseFile = async setImageState => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      if (res && res.length > 0) {
        const source = res[0].uri;
        setImageState(source);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled image selection');
      } else {
        console.error('DocumentPicker Error:', err.message);
        Alert.alert('Error', 'Failed to choose image');
      }
    }
  };

  const handleChooseDocument = async setDocumentState => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
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
      const fileName = type === 'Resume' ? 'ResumeFileName' : type; // Use 'ResumeFileName' for resume uploads
      const fileType = type === 'Resume' ? 'application/pdf' : 'image/jpeg'; // Set the correct file type
      formData.append(fileName, {
        uri: fileUri,
        type: fileType,
        name: `${fileName}.pdf`,
      });

      const response = await axios.post(
        `http://hrm.daivel.in:3000/api/v1/uploads/${endpoint}`,
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
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Profile Picture</Text>
        <View style={styles.fileInputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChooseFile(setProfilePicture)}
            disabled={loading}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginLeft: 10 }]}
            onPress={() => handleUpload('Pic', profilePicture, 'profilepic')}
            disabled={!profilePicture || loading}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {profilePicture && (
          <View style={styles.imageContainer}>
            <Text style={styles.text}>Selected Image:</Text>
            <Image
              source={{ uri: profilePicture }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Mobile Picture</Text>
        <View style={styles.fileInputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChooseFile(setMobilePicture)}
            disabled={loading}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginLeft: 10 }]}
            onPress={() => handleUpload('MobilePic', mobilePicture, 'mobilepic')}
            disabled={!mobilePicture || loading}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {mobilePicture && (
          <View style={styles.imageContainer}>
            <Text  style={styles.text}>Selected Image:</Text>
            <Image
              source={{ uri: mobilePicture }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Resume</Text>
        <View style={styles.fileInputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChooseDocument(setResume)}
            disabled={loading}>
            <Text style={styles.buttonText}>Choose Document</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginLeft: 10 }]}
            onPress={() => handleUpload('Resume', resume, 'resume')}
            disabled={!resume || loading}>
            <Text style={styles.buttonText}>Upload Document</Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {resume && (
          <View style={styles.fileInfoContainer}>
            <Text  style={styles.text} >Selected Document: {resume}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  fileInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  fileInfoContainer: {
    marginTop: 10,
  }, text: {
    fontSize: 15,
    fontWeight: 'bold',
    color:"black"
  },
});

export default Uploads;
