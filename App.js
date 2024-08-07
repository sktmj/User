
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
import Profile from './src/screens/admin/profile';
import Leave from './src/screens/admin/leave';
import Penalty from './src/screens/admin/penalty';
import Muster from './src/screens/admin/muster';
import Permission from './src/screens/admin/permission';
import Outpass from './src/screens/admin/outpass';
import AdminLogin from './src/screens/admin/adminLogin';
import Punch from './src/screens/admin/punch';
import Leaveentry from './src/component/leaveentry';
import Payslip from './src/screens/admin/paySlip';
import bank from './src/screens/admin/bank';




const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();


const CustomDrawerContent = ({ navigation }) => {
  const [selectedSection, setSelectedSection] = useState('Admin');

  return (
    <View style={{ flex: 1 }}>
  <TouchableOpacity
    onPress={() => setSelectedSection('Admin')}
    style={styles.sectionHeader}
  >
    <Text style={styles.sectionHeaderText}>Admin</Text>
  </TouchableOpacity>
  {selectedSection === 'Admin' && (
    <>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text style={[styles.drawerItem, styles.drawerItemLast]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Leave Entry')}>
        <Text style={styles.drawerItem}>Leave/On-Duty Entry</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Outpass')}>
        <Text style={styles.drawerItem}>Outpass</Text>
      </TouchableOpacity>
    </>
  )}
  <TouchableOpacity
    onPress={() => setSelectedSection('Report')}
    style={styles.sectionHeader}
  >
    <Text style={styles.sectionHeaderText}>Report</Text>
  </TouchableOpacity>
  {selectedSection === 'Report' && (
    <>
      <TouchableOpacity onPress={() => navigation.navigate('Penalty')}>
        <Text style={[styles.drawerItem, styles.drawerItemLast]}>Penalty Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Muster')}>
        <Text style={styles.drawerItem}>Muster Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Permission')}>
        <Text style={styles.drawerItem}>Permission Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Punch')}>
        <Text style={styles.drawerItem}>Punch Report</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Payslip')}>
        <Text style={styles.drawerItem}>Payslip Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Bank')}>
        <Text style={styles.drawerItem}>Bank Info</Text>
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
      <Drawer.Screen name="Leave Entry" component={Leaveentry} />
      <Drawer.Screen name="Muster" component={Muster}/>
      <Drawer.Screen name="Permission" component={Permission}/>
      <Drawer.Screen name="Penalty" component={Penalty}/>
      <Drawer.Screen name="Punch" component={Punch}/>
      <Drawer.Screen name="Payslip" component={Payslip}/>
      <Drawer.Screen name="Bank" component={bank}/>
      
     
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
          name="AdminLogin"
          component={AdminLogin}
          options={{title:'Login', headerShown: false }}
        />
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
        
        <Stack.Screen name="Leaveentry" component={Leaveentry}/>
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App
const styles = StyleSheet.create({
  sectionHeader: {
    padding: 15,
    backgroundColor: '#d0f2e2',
    borderBottomWidth: 2,
    borderBottomColor: '#a29bfe', // Slightly darker shade for better contrast
    borderRadius: 5, // Rounded corners
    marginBottom: 5, // Space between sections
    shadowColor: '#000', // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow effect
  },
  sectionHeaderText: {
    fontSize: 20, // Slightly larger font size
    fontWeight: 'bold',
    color: 'black', // Darker text color for better readability
  },
  drawerItem: {
    padding: 15,
    paddingLeft: 25,
    fontSize: 16,
    color: 'black', // Lighter color for item text
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Subtle line to separate items
  },
  drawerItemLast: {
    borderBottomWidth: 0, // Remove border for last item
  },
});

// keytool -genkeypair -v -storetype PKCS12 -keystore signedapk.keystore -alias signedapk -keyalg RSA -keysize 2048 -validity 10000