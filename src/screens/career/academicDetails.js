import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AcademicDetails = () => {
  const Navigation = useNavigation();
  const [qualifications, setQualifications] = useState([]);
  const [qualificationFields, setQualificationFields] = useState([]);
  const [courseFields, setCourseFields] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (token) {
      fetchQualificationDetails();
      fetchCourseDetails();
      fetchQualifications();
    }
  }, [token]);

  const checkAuthentication = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("AppId");
      if (!storedToken) {
        console.log(
          "User is not authenticated. Redirecting to login screen..."
        );
        Navigation.navigate("Login");
      } else {
        console.log("User is authenticated.");
        setIsLoggedIn(true);
        setToken(storedToken.trim()); // Ensure token is trimmed of any extra characters
      }
    } catch (error) {
      console.error("Error checking authentication:", error.message);
    }
  };

  const fetchQualificationDetails = async () => {
    try {
      const response = await axios.get("http://hrm.daivel.in:3000/api/v1/Qlf/getQlf", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token from the state
        },
      });
      if (response.data.success) {
        console.log(
          "Qualifications retrieved successfully:",
          response.data.data
        );
        const fetchedQualifications = response.data.data.map((qual) => ({
          AppQualId: qual.AppQualId, // Include AppQualId
          selectedQualification: qual.QualId,
          colName: qual.ColName,
          yearPass: qual.YearPass,
          percentage: qual.Percentage ? String(qual.Percentage) : "",
          degree: qual.Degree,
          lastDegree: qual.LastDegree === "Y",
          location: qual.Location,
        }));
        setQualificationFields(fetchedQualifications);
      } else {
        console.error("Qualification retrieval failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching qualification details:", error.message);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        "http://hrm.daivel.in:3000/api/v1/Qlf/getCourse",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the token from the state
          },
        }
      );
      if (response.data.success) {
        console.log("Courses retrieved successfully:", response.data.data);
        const fetchedCourses = response.data.data.map((course) => ({
          CourseId: course.CourseId, // Include CourseId
          course: course.Course,
          institute: course.Institute,
          studYear: course.StudYear,
          coursePercentage: course.CrsPercentage
            ? String(course.CrsPercentage)
            : "",
        }));
        setCourseFields(fetchedCourses);
      } else {
        console.error("Course retrieval failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching course details:", error.message);
    }
  };

  const fetchQualifications = async () => {
    try {
      const response = await fetch(
        "http://hrm.daivel.in:3000/api/v1/Qlf/qualification"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch qualifications");
      }
      const data = await response.json();
      setQualifications(data);
    } catch (error) {
      console.error("Error fetching qualifications:", error.message);
      Alert.alert("Error", "Failed to fetch qualifications");
    }
  };

  const handleAddQualificationField = () => {
    setQualificationFields([
      ...qualificationFields,
      {
        AppQualId: null, // Initialize with null
        selectedQualification: null,
        colName: "",
        yearPass: "",
        percentage: "",
        degree: "",
        lastDegree: false,
        location: "",
      },
    ]);
    setFormChanged(true);
  };

  const handleRemoveQualificationField = async (index) => {
    const fields = [...qualificationFields];
    const removedField = fields.splice(index, 1)[0]; // Remove the field and get the removed item
    setQualificationFields(fields);
    setFormChanged(true);

    // Check if the removed field was already present in the database
    if (removedField.AppQualId) {
      try {
        const response = await axios.delete(
          `http://hrm.daivel.in:3000/api/v1/Qlf/deleteQual/${removedField.AppQualId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          console.log(
            `Qualification with ID ${removedField.AppQualId} deleted successfully`
          );
          Alert.alert("Success", "Qualification deleted successfully");
        } else {
          console.error(
            "Failed to delete qualification:",
            response.data.message
          );
          Alert.alert("Error", "Failed to delete qualification");
        }
      } catch (error) {
        console.error("Error deleting qualification:", error.message);
        Alert.alert("Error", "Failed to delete qualification");
      }
    }
  };

  const handleAddCourseField = () => {
    setCourseFields([
      ...courseFields,
      {
        CourseId: null, // Initialize with null
        course: "",
        institute: "",
        studYear: "",
        coursePercentage: "",
      },
    ]);
    setFormChanged(true);
  };

  const handleRemoveCourseField = async (index) => {
    const fields = [...courseFields];
    const removedField = fields.splice(index, 1)[0]; // Remove the field and get the removed item
    setCourseFields(fields);
    setFormChanged(true);

    // Check if the removed field was already present in the database
    if (removedField.CourseId) {
      try {
        const response = await axios.delete(
          `http://hrm.daivel.in:3000/api/v1/Qlf/deletecourse/${removedField.CourseId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          console.log(
            `Course with ID ${removedField.CourseId} deleted successfully`
          );
          Alert.alert("Success", "Course deleted successfully");
        } else {
          console.error("Failed to delete Course:", response.data.message);
          Alert.alert("Error", "Failed to delete Course");
        }
      } catch (error) {
        console.error("Error deleting Course:", error.message);
        Alert.alert("Error", "Failed to delete Course");
      }
    }
  };

  const handleQualificationChange = (index, field, value) => {
    const fields = [...qualificationFields];
    fields[index][field] = value;
    setQualificationFields(fields);
    setFormChanged(true);
  };

  const handleCourseChange = (index, field, value) => {
    const fields = [...courseFields];
    fields[index][field] = value;
    setCourseFields(fields);
    setFormChanged(true);
  };

  const handleUpdateCourse = async (index) => {
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    setIsSubmitting(true);
    try {
      const course = courseFields[index];
      const response = await axios.put(
        "http://hrm.daivel.in:3000/api/v1/Qlf/updateAppCourse",
        {
          CourseId: course.CourseId, // Include CourseId
          Course: course.course,
          Institute: course.institute,
          CrsPercentage: parseFloat(course.coursePercentage),
          StudYear: course.studYear,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update Course");
      }

      Alert.alert("Success", "Course updated successfully");
      setFormChanged(false); // Reset form change tracking
    } catch (error) {
      console.error("Error updating Course:", error.message);
      Alert.alert("Error", "Failed to update Course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQualification = async (index) => {
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    setIsSubmitting(true);
    try {
      const qualification = qualificationFields[index];
      const response = await axios.put(
        "http://hrm.daivel.in:3000/api/v1/Qlf/updateAppQualification",
        {
          AppQualId: qualification.AppQualId,
          QualId: qualification.selectedQualification,
          ColName: qualification.colName,
          YearPass: qualification.yearPass,
          Percentage: parseFloat(qualification.percentage),
          Degree: qualification.degree,
          LastDegree: qualification.lastDegree ? "Y" : "N",
          Location: qualification.location,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update Qualification"
        );
      }

      Alert.alert("Success", "Qualification updated successfully");
      setFormChanged(false); // Reset form change tracking
    } catch (error) {
      console.error("Error updating qualification:", error.message);
      Alert.alert("Error", "Failed to update qualification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddQualificationAndCourse = async () => {
    setIsSubmitting(true);
    try {
      // Update or insert qualifications
      for (let i = 0; i < qualificationFields.length; i++) {
        const qualification = qualificationFields[i];
        if (qualification.AppQualId) {
          // Update existing qualification
          await axios.put(
            "http://hrm.daivel.in:3000/api/v1/Qlf/updateAppQualification",
            {
              AppQualId: qualification.AppQualId,
              QualId: qualification.selectedQualification,
              ColName: qualification.colName,
              YearPass: qualification.yearPass,
              Percentage: parseFloat(qualification.percentage),
              Degree: qualification.degree,
              LastDegree: qualification.lastDegree ? "Y" : "N",
              Location: qualification.location,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // Insert new qualification
          const response = await axios.post(
            "http://hrm.daivel.in:3000/api/v1/Qlf/InsertQlCT",
            {
              QualId: qualification.selectedQualification,
              ColName: qualification.colName,
              YearPass: qualification.yearPass,
              Percentage: parseFloat(qualification.percentage),
              Degree: qualification.degree,
              LastDegree: qualification.lastDegree ? "Y" : "N",
              Location: qualification.location,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Update state with new AppQualId
          qualificationFields[i].AppQualId = response.data.AppQualId;
        }
      }

      // Update or insert courses
      for (let i = 0; i < courseFields.length; i++) {
        const course = courseFields[i];
        if (course.CourseId) {
          // Update existing course
          await axios.put(
            "http://hrm.daivel.in:3000/api/v1/Qlf/updateAppCourse",
            {
              CourseId: course.CourseId,
              Course: course.course,
              Institute: course.institute,
              CrsPercentage: parseFloat(course.coursePercentage),
              StudYear: course.studYear,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // Insert new course
          const response = await axios.post(
            "http://hrm.daivel.in:3000/api/v1/Qlf/courses",
            {
              Course: course.course,
              Institute: course.institute,
              CrsPercentage: parseFloat(course.coursePercentage),
              StudYear: course.studYear,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Update state with new CourseId
          courseFields[i].CourseId = response.data.CourseId;
        }
      }

      Alert.alert(
        "Success",
        "Qualifications and Courses submitted successfully"
      );
      Navigation.navigate("WorkExperience")
      setFormChanged(false); // Reset form change tracking
    } catch (error) {
      console.error("Error adding/updating qualifications and courses:", error);
      Alert.alert("Error", "Failed to submit qualifications and courses");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    await handleAddQualificationAndCourse();
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    ); 
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {isLoggedIn ? (
        <View>
          <Text style={styles.header}>Qualification Details</Text>
          {qualificationFields.map((qualification, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>Qualification:</Text>
              <Picker
                style={styles.picker}
                selectedValue={qualification.selectedQualification}
                onValueChange={(value) =>
                  handleQualificationChange(
                    index,
                    "selectedQualification",
                    value
                  )
                }
              >
                <Picker.Item style={styles.label}  label="Select Qualification" value={null} />
                {qualifications.map((qual) => (
                  <Picker.Item style={styles.input} 
                    key={qual.QualificationId}
                    label={qual.QualificationName}
                    value={qual.QualificationId}
                  />
                ))}
              </Picker>

              <Text style={styles.label}>Degree:</Text>
              <TextInput
                style={styles.input}
                value={qualification.degree}
                placeholderTextColor="#888"
                onChangeText={(value) =>
                  handleQualificationChange(index, "degree", value)
                }
              />
              <Text style={styles.label}>College/School name:</Text>
              <TextInput
                style={styles.input}
                value={qualification.colName}
                placeholderTextColor="#888"
                onChangeText={(value) =>
                  handleQualificationChange(index, "colName", value)
                }
              />

              <Text style={styles.label}>Year of Passing:</Text>
              <TextInput
                style={styles.input}
                value={qualification.yearPass}
                placeholderTextColor="#888"
                keyboardType="numeric"
                onChangeText={(value) =>
                  handleQualificationChange(index, "yearPass", value)
                }
              />

              <Text style={styles.label}>Percentage:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={qualification.percentage}
                onChangeText={(value) =>
                  handleQualificationChange(index, "percentage", value)
                }
              />


              <Text style={styles.label}>Location:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                value={qualification.location}
                onChangeText={(value) =>
                  handleQualificationChange(index, "location", value)
                }
              /> 
              
              <Text style={styles.label}>Is this your last degree?</Text>
              <Picker
                style={styles.input}
                selectedValue={qualification.lastDegree ? "Y" : "N"}
                onValueChange={(value) =>
                  handleQualificationChange(index, "lastDegree", value === "Y")
                }
              >
                <Picker.Item label="Yes" value="Y" />
                <Picker.Item label="No" value="N" />
              </Picker>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.removeButton]}
                  onPress={() => handleRemoveQualificationField(index)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={() => handleUpdateQualification(index)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddQualificationField}
            disabled={isSubmitting}
          >
  
            <Text style={styles.addButtonText}>Add Qualification</Text>
          </TouchableOpacity>

          <Text style={styles.header}>Course Details</Text>
          {courseFields.map((course, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>Course:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                value={course.course}
                onChangeText={(value) =>
                  handleCourseChange(index, "course", value)
                }
              />

              <Text style={styles.label}>Institute:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                value={course.institute}
                onChangeText={(value) =>
                  handleCourseChange(index, "institute", value)
                }
              />

              <Text style={styles.label}>Study Year:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                value={course.studYear}
                keyboardType="numeric"
                onChangeText={(value) =>
                  handleCourseChange(index, "studYear", value)
                }
              />

              <Text style={styles.label}>Percentage:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={course.coursePercentage}
                onChangeText={(value) =>
                  handleCourseChange(index, "coursePercentage", value)
                }
              />
              <View style={styles.buttonsContainer}>
                {/* Update course button */}

                {/* Remove course button */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveCourseField(index)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => handleUpdateCourse(index)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add course button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCourseField}
            disabled={isSubmitting}
          >
           
            <Text style={styles.addButtonText}>Add Course</Text>
          </TouchableOpacity>

          {/* Submit button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddQualificationAndCourse}
            disabled={isSubmitting || !formChanged} // Disable if already submitting or no changes
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
     backgroundColor: '#f5f5f5'
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E6F7E",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,

},
addButtonText: {
  color: '#FFF',
  marginLeft: 8,
  fontSize: 16,
},
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color:"black"
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
     color:"black"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    color:"black"
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#1E6F7E",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#059A5F",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff", // White text color for all buttons
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AcademicDetails;