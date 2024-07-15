import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../themes/theme";
import { useNavigation } from "@react-navigation/native";

export default function ComplaintScreen() {
  const [values, setValues] = useState(Array(18).fill(""));
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handleChangeText = (index, text) => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);
  };

  const handleNext = () => {
    if (currentIndex < values.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Data yang akan disimpan:", values);
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Success",
      textBody: "Your complaint has been submitted successfully.",
    });
    navigation.navigate("NavigatorScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Laporkan Pengaduan Anda</Text>

        {currentIndex === 0 && (
          <>
            {values.slice(0, 7).map((value, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index, text)}
                  placeholder={`Input ${index + 1}`}
                  placeholderTextColor="rgba(158, 182, 230, .5)"
                />
              </View>
            ))}
          </>
        )}
        {currentIndex === 1 && (
          <>
            {values.slice(7, 11).map((value, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index + 7, text)}
                  placeholder={`Input ${index + 8}`}
                  placeholderTextColor="rgba(158, 182, 230, .5)"
                />
              </View>
            ))}
          </>
        )}
        {currentIndex === 2 && (
          <>
            {values.slice(11).map((value, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index + 11, text)}
                  placeholder={`Input ${index + 12}`}
                  placeholderTextColor="rgba(158, 182, 230, .5)"
                />
              </View>
            ))}
          </>
        )}

        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.button} onPress={handlePrevious}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          )}
          {currentIndex < 2 ? (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.purple400,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: theme.colors.purple400,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: "rgb(94, 125, 189)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "rgb(94, 125, 189)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 5,
  },
});
