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
import { Picker } from "@react-native-picker/picker";
import { theme } from "../themes/theme";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ComplaintScreen() {
  const [values, setValues] = useState(Array(19).fill(""));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdown12, setDropdown12] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleChangeText = (index, text) => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);
  };

  const handleNext = () => {
    if (currentIndex === 0) {
      const isFilled = values.slice(0, 7).every((value) => value.trim() !== "");
      if (!isFilled) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: "Semua formulir harus diisi.",
        });
        return;
      }
    } else if (currentIndex === 1) {
      const isFilled = values
        .slice(7, 11)
        .every((value) => value.trim() !== "");
      if (!isFilled) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: "Semua formulir harus diisi.",
        });
        return;
      }
    } else if (currentIndex === 2) {
      if (!dropdown12 || !selectedOption) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: "Semua formulir harus diisi.",
        });
        return;
      }
      const isFilled = values[18].trim() !== "";
      if (!isFilled) {
        return Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: "Semua formulir harus diisi.",
        });
      }
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!dropdown12 || !selectedOption) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Semua formulir harus diisi.",
      });
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const complaintPayload = {
        name: values[0],
        born: values[1],
        gender: values[2],
        nik: values[3],
        address: values[4],
        phoneNumber: values[5],
        education: values[6],
        parentName: values[7],
        parentJob: values[8],
        parentAddress: values[9],
        parentNumber: values[10],
        caseType: dropdown12,
        caseViolence: selectedOption,
        chronology: values[17],
        fisik: selectedOption === "fisik" ? values[13] : "",
        sexual: selectedOption === "sexual" ? values[14] : "",
        psikologi: selectedOption === "psikologi" ? values[15] : "",
        ekonomi: selectedOption === "ekonomi" ? values[16] : "",
      };
      console.log("Data yang akan disimpan:", complaintPayload);
      const response = await axios.post(
        "http://192.168.1.4:1000/create",
        complaintPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      if (response.data.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: response.data.message,
        });
        navigation.navigate("NavigatorScreen");
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: response.data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "There was an error submitting the complaint." + error,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {currentIndex === 0 && (
          <>
            <Text style={styles.header}>Identitas Pengadu</Text>
            <Text style={styles.subHeader}>Masukkan identitas anda</Text>
            {values.slice(0, 7).map((value, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index, text)}
                  placeholder={
                    [
                      "Nama Lengkap",
                      "Tempat / Tanggal Lahir",
                      "Jenis Kelamin",
                      "Nomor Induk Kependudukan (NIK)",
                      "Alamat",
                      "Nomor Telepon",
                      "Pendidikan",
                    ][index]
                  }
                  placeholderTextColor="rgba(158, 182, 230, .5)"
                />
              </View>
            ))}
          </>
        )}
        {currentIndex === 1 && (
          <>
            <Text style={styles.header}>Identitas Orangtua / Wali</Text>
            <Text style={styles.subHeader}>
              Masukkan identitas orangtua anda
            </Text>
            {values.slice(7, 11).map((value, index) => (
              <View key={index + 7} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index + 7, text)}
                  placeholder={
                    [
                      "Nama Orangtua",
                      "Pekerjaan Orangtua",
                      "Alamat Orangtua",
                      "Nomor Telepon Orangtua",
                    ][index]
                  }
                  placeholderTextColor="rgba(158, 182, 230, .5)"
                />
              </View>
            ))}
          </>
        )}
        {currentIndex === 2 && (
          <>
            <Text style={styles.header}>Informasi Kasus</Text>
            <Text style={styles.subHeader}>Masukkan detail kasus anda</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={dropdown12}
                onValueChange={(itemValue) => setDropdown12(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label="Jenis Kasus"
                  value=""
                  style={{ color: theme.colors.purple400Transparent }}
                />
                <Picker.Item label="KDRT" value="kdrt" />
                <Picker.Item label="Pemerkosaan" value="pemerkosaan" />
                <Picker.Item label="Pelecehan Sexual" value="pelecehan " />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={selectedOption}
                onValueChange={(itemValue) => setSelectedOption(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label="Bentuk Kekerasan"
                  value=""
                  style={{ color: theme.colors.purple400Transparent }}
                />
                <Picker.Item label="Fisik" value="fisik" />
                <Picker.Item label="Sexual" value="sexual" />
                <Picker.Item label="Psikologi" value="psikologi" />
                <Picker.Item label="Ekonomi" value="ekonomi" />
              </Picker>
            </View>
            {selectedOption && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={
                    values[
                      {
                        physical: 13,
                        sexual: 14,
                        psychology: 15,
                        economy: 16,
                      }[selectedOption]
                    ]
                  }
                  onChangeText={(text) =>
                    handleChangeText(
                      {
                        physical: 13,
                        sexual: 14,
                        psychology: 15,
                        economy: 16,
                      }[selectedOption],
                      text
                    )
                  }
                  placeholder={`Detail ${
                    {
                      fisik: "Fisik",
                      sexual: "Sexual",
                      psikologi: "Psikologi",
                      ekonomi: "Ekonomi",
                    }[selectedOption]
                  }`}
                  placeholderTextColor="rgba(158, 182, 230, .5)"
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={values[17]}
                onChangeText={(text) => handleChangeText(17, text)}
                placeholder="Deskripsi Lengkap"
                placeholderTextColor="rgba(158, 182, 230, .5)"
                multiline
                numberOfLines={4}
              />
            </View>
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
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Submit"}
              </Text>
              <Ionicons
                name={loading ? "time" : "checkmark"}
                size={20}
                color="#fff"
              />
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
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: theme.colors.purple400,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 15,
    color: "rgb(94, 125, 189)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 15,
    color: "rgb(94, 125, 189)",
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
