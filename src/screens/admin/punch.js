
import React, { useState } from 'react';
import './gesture-handler';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/FontAwesome";
import PersonalDetails from './src/screens/career/personalDetails';
import AcademicDetails from './src/screens/career/academicDetails';
import WorkExperience from './src/screens/career/experience';
import FamilyDetails from './src/screens/career/familyDetails';
import Other from './src/screens/career/other';
import Uploads from './src/screens/career/uploads';
import DeclarationComponent from './src/screens/career/declaration';
import Login from './src/screens/career/login';
import SignUp from './src/screens/career/signup';
import Home from './src/screens/admin/home';
import Profile from './src/screens/admin/profile';
import Leave from './src/screens/admin/leave';
import Penalty from './src/screens/admin/penalty';
import Muster from './src/screens/admin/muster';
import Permission from './src/screens/admin/permission';
import Punch from './src/screens/admin/punch';
import LeaveEntryScreen from './src/component/leaveentry';
import Outpass from './src/screens/admin/outpass';
import OutpassEntryScreen from './src/component/oupassEntry';
import AdminLogin from './src/screens/admin/adminLogin';




const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();


const CustomDrawerContent = ({ navigation }) => {
  const [selectedSection, setSelectedSection] = useState('Admin');

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setSelectedSection('Admin')} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Admin</Text>
      </TouchableOpacity>
      {selectedSection === 'Admin' && (
        <>
        
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.drawerItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Leave/On-Duty Entry')}>
            <Text style={styles.drawerItem}>Leave/On-Duty Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Outpass')}>
            <Text style={styles.drawerItem}>Outpass</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={() => setSelectedSection('Report')} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Report</Text>
      </TouchableOpacity>
      {selectedSection === 'Report' && (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('Penalty-Report')}>
            <Text style={styles.drawerItem}>Penalty Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Muster-Report')}>
            <Text style={styles.drawerItem}>Muster Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Permission-Report')}>
            <Text style={styles.drawerItem}>Permission Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Punch-Report')}>
            <Text style={styles.drawerItem}>Punch Report</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};


function DrawerScreen() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
   
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Outpass" component={Outpass}/>
      <Drawer.Screen name="Leave/On-Duty Entry" component={Leave} />
     
    </Drawer.Navigator>
  );
}


function TabTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 10, // Adjust the font size as needed
          fontWeight: 'bold',
          color: '#333', // Add sky blue color
        },
        tabBarTabStyle: {width: 20},

        tabBarIndicatorStyle: {
          backgroundColor: '#000', // Set indicator color to sky blue
        },
      }}>

    <Tab.Screen
  name="PersonalDetails"
  component={PersonalDetails}
  options={{
    title: () => (
      <Icon name="user-circle-o" size={24} color="black" />
    ),
  }}
/>
      <Tab.Screen
        name="AcademicDetails"
        component={AcademicDetails}
        options={{
          title:()=>(
            <Icon name='university' size={24} color="black"/>
          ),
          
        }}
      />
     
      <Tab.Screen
        name="WorkExperience"
        component={WorkExperience}
        options={{
          title:()=>(
            <Icon name='server' size={24} color="black"/>
          ),
          
        }}
      />
      <Tab.Screen
        name="FamilyDetails"
        component={FamilyDetails}
        options={{
          title:()=>(
            <Icon name='group' size={24} color="black"/>
          ),
          
        }}
      />
       
      
       <Tab.Screen
        name="Other"
        component={Other}
        options={{
          title:()=>(
            <Icon name='cube' size={24} color="black"/>
          ),
          
        }}
      />
       <Tab.Screen
        name="uploads"
        component={Uploads}
        options={{
          title:()=>(
            <Icon name='file-photo-o' size={24} color="black"/>
          ),
          
        }}
      />
       <Tab.Screen
        name="Declaration"
        component={DeclarationComponent}
        options={{
          title:()=>(
            <Icon name='handshake-o' size={24} color="black"/>
          ),
          
        }}
      />
    </Tab.Navigator>
    
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title:'Login', headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignUp}
          options={{title: 'signup', headerShown: false}}
        />
        <Stack.Screen name="Application Form" component={TabTab} />
        <Stack.Screen name="Admin" component={DrawerScreen}/>
        <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
          options={{title:'Login', headerShown: false }}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App
const styles = StyleSheet.create({
  sectionHeader: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: 'green',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerItem: {
    padding: 10,
    paddingLeft: 20,
    fontSize: 16,
  },
});

// keytool -genkeypair -v -storetype PKCS12 -keystore signedapk.keystore -alias signedapk -keyalg RSA -keysize 2048 -validity 10000