import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ComplaintForm() {
  const [values, setValues] = useState(Array(18).fill(""));
  const [currentIndex, setCurrentIndex] = useState(0);

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
    setValues(Array(18).fill(""));
    setCurrentIndex(0);
  };

  return (
    <SafeAreaView className="flex bg-indigo-900 rounded-t-2xl">
      <View className="items-center ">
        <TouchableOpacity className="mt-[-20px] w-[20%] bg-white h-[5px] rounded-full"></TouchableOpacity>
      </View>
      <View className="mb-5 flex items-center ">
        <Text className="font-extrabold text-white text-[16px] ">
          Form Pengaduan
        </Text>
      </View>
      <View className="px-3 bg-gray-100">
        {currentIndex === 0 && (
          <>
            <Text className="">Form Bagian 1</Text>
            {values.slice(0, 7).map((value, index) => (
              <View>
                <Text>Input {index + 1} </Text>
                <TextInput
                  className="bg-white rounded-lg py-4 text-white px-5 my-4"
                  key={index}
                  value={value}
                  onChangeText={(text) => handleChangeText(index, text)}
                  placeholder={`Input ${index + 1}`}
                  placeholderTextColor="grey"
                />
              </View>
            ))}
          </>
        )}
        {currentIndex === 1 && (
          <>
            <Text>Form Bagian 2</Text>
            {values.slice(7, 11).map((value, index) => (
              <TextInput
                key={index + 7}
                className="bg-white rounded-lg py-4 text-white px-5 my-4"
                value={value}
                onChangeText={(text) => handleChangeText(index + 7, text)}
                placeholder={`Input ${index + 8}`}
                placeholderTextColor="rgb(94, 125, 189)"
              />
            ))}
          </>
        )}
        {currentIndex === 2 && (
          <>
            <Text>Form Bagian 3</Text>
            {values.slice(11).map((value, index) => (
              <TextInput
                key={index + 11}
                className="bg-white rounded-lg py-4 text-white px-5 my-4"
                value={value}
                onChangeText={(text) => handleChangeText(index + 11, text)}
                placeholder={`Input ${index + 12}`}
                placeholderTextColor="rgb(94, 125, 189)"
              />
            ))}
          </>
        )}

        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity
              className="bg-indigo-900 rounded-xl p-3 flex items-center"
              onPress={handlePrevious}
            >
              <Text className="text-white font-bold">Previous</Text>
            </TouchableOpacity>
          )}
          {currentIndex < 2 ? (
            <TouchableOpacity
              className="bg-indigo-900 rounded-xl p-3 flex items-center"
              onPress={handleNext}
            >
              <Text className="text-white font-bold">Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-indigo-900 rounded-xl p-3 flex items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-bold">Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // flex: 1,
    // alignItems: "center",
    backgroundColor: "red",
    marginTop: 10,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  textInput: {
    backgroundColor: "#fff",
    borderColor: "rgb(94, 125, 189)",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
    color: "rgb(94, 125, 189)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
