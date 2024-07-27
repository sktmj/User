import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  return (
    <SafeAreaView contentContainerStyle={styles.container}>
    <ScrollView >
  <Image source={require('../../assets/mini.jpg')} style={styles.profileImage} />
      
      {/* source={{ uri: 'https://example.com/your-profile-image.jpg' }} */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Biometric Code :</Text>
        <Text style={styles.infoText}>1615</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Date of Birth :</Text>
        <TextInput
          style={styles.input}
          value="12/11/1999"
          editable={false}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Date of Joining :</Text>
        <TextInput
          style={styles.input}
          value="18/03/2024"
          editable={false}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Employee Name :</Text>
        <Text style={styles.infoText}>AJAY BANU T / JUNIOR SOFTWARE DEVELOPER</Text>
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.inputWithIcon}
          value="9496852007"
          editable={false}
        />
        <Icon name="phone" size={24} style={styles.icon} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Father/Guardian Name :</Text>
        <TextInput
          style={styles.input}
          value="Chandra Banu"
          editable={false}
        />

      </View>

      <View style={styles.infoContainer}>
        <TextInput
          style={styles.inputWithIcon}
          value="9496852007"
          editable={false}
        />
        <Icon name="phone" size={24} style={styles.icon} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Spouse Name :</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Spouse Name"
        />
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.inputWithIcon}
          value="9496852007"
          editable={false}
        />
        <Icon name="phone" size={24} style={styles.icon} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Mother Name :</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Mother Name"
        />
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.inputWithIcon}
          value="9496852007"
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