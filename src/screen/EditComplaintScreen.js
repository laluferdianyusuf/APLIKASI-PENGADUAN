import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../themes/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const uri = "http://192.168.1.3:5000";

export default function EditComplaintScreen() {
  const [values, setValues] = useState(Array(19).fill(""));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdown12, setDropdown12] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (id) {
          const response = await axios.get(`${uri}/case/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const complaintData = response.data.data.complaint;

          setValues([
            complaintData.name,
            complaintData.born,
            complaintData.nik,
            complaintData.address,
            complaintData.phoneNumber,
            complaintData.education,
            complaintData.parentName,
            complaintData.parentJob,
            complaintData.parentAddress,
            complaintData.parentNumber,
            complaintData.caseType,
            complaintData.caseViolence,
            complaintData.physical,
            complaintData.sexual,
            complaintData.psychology,
            complaintData.economy,
            complaintData.chronology,
          ]);
          setGender(complaintData.gender);
          setEducation(complaintData.education);
          setDropdown12(complaintData.caseType);
          setSelectedOption(complaintData.caseViolence);
        }
      } catch (error) {
        console.error("Error fetching complaint data:", error);
      }
    };

    fetchComplaintData();
  }, [id]);

  const handleChangeText = (index, text) => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);
  };

  const handleNext = () => {
    if (currentIndex === 0) {
      const isFilled = values.slice(0, 2).every((value) => value.trim() !== "");
      const isFilledSc = values
        .slice(3, 6)
        .every((value) => value.trim() !== "");

      if (!isFilled || !isFilledSc || !gender || !education) {
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
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const complaintPayload = {
        name: values[0],
        born: values[1],
        gender: gender,
        nik: values[3],
        address: values[4],
        phoneNumber: values[5],
        education: education,
        parentName: values[7],
        parentJob: values[8],
        parentAddress: values[9],
        parentNumber: values[10],
        caseType: dropdown12,
        caseViolence: selectedOption,
        physical: selectedOption === "physical" ? values[13] : "",
        sexual: selectedOption === "sexual" ? values[14] : "",
        psychology: selectedOption === "psychology" ? values[15] : "",
        economy: selectedOption === "economy" ? values[16] : "",
        chronology: values[17],
      };

      const response = await axios.put(
        `${uri}/update/${id}`,
        complaintPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responsePayload = response.data;
      setLoading(false);
      if (responsePayload.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: responsePayload.message,
        });

        navigation.goBack();
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: responsePayload.message,
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "There was an error updating the complaint. " +
          (error.response ? error.response.data.message : error.message),
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
            {values.slice(0, 2).map((value, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index, text)}
                  placeholder={
                    ["Nama Lengkap", "Tempat / Tanggal Lahir"][index]
                  }
                  placeholderTextColor="rgb(158, 182, 230)"
                />
              </View>
            ))}
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label="Jenis Kelamin"
                  value=""
                  style={{ color: theme.colors.purple400Transparent }}
                />
                <Picker.Item label="Laki - laki" value="laki - laki" />
                <Picker.Item label="Perempuan" value="perempuan" />
              </Picker>
            </View>
            {values.slice(2, 5).map((value, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index + 3, text)}
                  placeholder={
                    [
                      "Nomor Induk Kependudukan (NIK)",
                      "Alamat",
                      "Nomor Telepon",
                      6,
                    ][index]
                  }
                  placeholderTextColor="rgb(158, 182, 230)"
                />
              </View>
            ))}
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={education}
                onValueChange={(itemValue) => setEducation(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label="Pendidikan"
                  value=""
                  style={{ color: theme.colors.purple400Transparent }}
                />
                <Picker.Item label="TK" value="TK" />
                <Picker.Item label="SD" value="SD" />
                <Picker.Item label="SMP" value="SMP" />
                <Picker.Item label="SMA" value="SMA" />
                <Picker.Item
                  label="Perguruan Tinggi"
                  value="Perguruan Tinggi"
                />
              </Picker>
            </View>
          </>
        )}
        {currentIndex === 1 && (
          <>
            <Text style={styles.header}>Data Orang Tua</Text>
            <Text style={styles.subHeader}>Masukkan data orang tua anda</Text>
            {values.slice(6, 10).map((value, index) => (
              <View key={index + 7} style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={(text) => handleChangeText(index + 7, text)}
                  placeholder={
                    [
                      "Nama Orang Tua",
                      "Pekerjaan Orang Tua",
                      "Alamat Orang Tua",
                      "Nomor Telepon Orang Tua",
                    ][index]
                  }
                  placeholderTextColor="rgb(158, 182, 230)"
                />
              </View>
            ))}
          </>
        )}
        {currentIndex === 2 && (
          <>
            <Text style={styles.header}>Kasus Pengaduan</Text>
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
                  label="Jenis Kekerasan"
                  value=""
                  style={{ color: theme.colors.purple400Transparent }}
                />
                <Picker.Item label="Fisik" value="physical" />
                <Picker.Item label="Seksual" value="sexual" />
                <Picker.Item label="Psikologis" value="psychology" />
                <Picker.Item label="Ekonomi" value="economy" />
              </Picker>
            </View>
            {selectedOption && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={
                    values[
                      {
                        physical: 12,
                        sexual: 13,
                        psychology: 14,
                        economy: 15,
                      }[selectedOption]
                    ]
                  }
                  onChangeText={(text) => handleChangeText(13, text)}
                  placeholder={
                    {
                      physical: "Keterangan Kekerasan Fisik",
                      sexual: "Keterangan Kekerasan Seksual",
                      psychology: "Keterangan Kekerasan Psikologis",
                      economy: "Keterangan Kekerasan Ekonomi",
                    }[selectedOption]
                  }
                  placeholderTextColor="rgb(158, 182, 230)"
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={values[16]}
                onChangeText={(text) => handleChangeText(17, text)}
                placeholder="Kronologi Kasus"
                placeholderTextColor="rgb(158, 182, 230)"
                multiline
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
    // borderRadius: 10,
    padding: 12,
    paddingHorizontal: 15,
    color: "rgb(94, 125, 189)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    // elevation: 2,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 5,
  },
});
