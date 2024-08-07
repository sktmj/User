import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminLogin() {
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const Navigation = useNavigation();


  
  const handleLogin = async () => {
    try {
      const response = await fetch("http://hrm.daivel.in:3000/api/v2/auth/Admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserName: UserName }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error logging in: ${response.statusText} - ${errorDetails}`);
      }
      const responseData = await response.json();

      if (responseData.token && responseData.EmployeeId && responseData.FactoryId) {
        await AsyncStorage.setItem("token", responseData.token);
        await AsyncStorage.setItem("EmployeeId", JSON.stringify(responseData.EmployeeId)); // Stringify EmployeeId
        await AsyncStorage.setItem("UserId", JSON.stringify(responseData.UserId));
        await AsyncStorage.setItem("FactoryId", JSON.stringify(responseData.FactoryId));
        console.log("Token and EmployeeId stored:", responseData.token, responseData.EmployeeId,responseData.UserId,responseData.FactoryId);
        Alert.alert('Welcome back....!')
        Navigation.navigate("Admin");
      } else {
        console.error("Token or EmployeeId not received");
        Alert.alert("Login failed", "Token or EmployeeId not received");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Login error", error.message);
    }
  };


  const handleCarrier = () => {
    Navigation.navigate("Login");
  }
  


  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.carrier} onPress={handleCarrier}>
          <Text style={styles.carrierText}>Career</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.admin} >
          <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        <Image source={require('../../assets/daivel1.png')} style={styles.image} />
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="EC.NO"
            value={UserName}
            onChangeText={setUserName}
            keyboardType="numeric"
            autoCapitalize="none"
            placeholderTextColor="#888" 
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888" 
          />
        </View>
       
         
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090920",
    paddingHorizontal: 20,
  },
  topContainer: {
    width: '100%',
    position: 'absolute',
    top: 20, // Adjust as needed
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#333', // Text color
  },
  loginButton: {
    backgroundColor: '#059A5F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerLink: {
    color: 'white',
    fontSize: 16,
  },
  admin: {
    paddingVertical: 10,
    backgroundColor: '#059A5F',
    borderRadius: 8,
    width: 100,
    marginLeft: 10
  },
  adminText: {
    color: 'white',
    fontSize: 16,
    paddingLeft: 20
  },
  carrier: {
    paddingVertical: 10,
    backgroundColor: "#059A5F",
    borderRadius: 8,
    width: 100,
    marginLeft: 10
  },
  carrierText: {
    color: 'white',
    fontSize: 16,
    paddingLeft: 20
  },
  image: {
    width: 300,
    height:75,
    marginBottom: 20,
  },
});
