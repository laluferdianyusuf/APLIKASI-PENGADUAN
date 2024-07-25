import React from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function News() {
  return (
    <View className="flex ">
      <View className="flex-row py-3 w-[90%] gap-3">
        <TouchableOpacity className="gap-3 bg-gray-100 rounded-2xl flex flex-col justify-center items-center p-10 ">
          <Image source={require("../../assets/aduanku.png")} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et,
            deserunt?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="gap-3 bg-gray-100 rounded-2xl flex flex-col justify-center items-center p-10">
          <Image source={require("../../assets/aduanku.png")} />
          <Text>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity className="gap-3 bg-gray-100 rounded-2xl flex flex-col justify-center items-center p-10">
          <Image source={require("../../assets/aduanku.png")} />
          <Text>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity className="gap-3 bg-gray-100 rounded-2xl flex flex-col justify-center items-center p-10">
          <Image source={require("../../assets/aduanku.png")} />
          <Text>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity className="gap-3 bg-gray-100 rounded-2xl flex flex-col justify-center items-center p-10">
          <Image source={require("../../assets/aduanku.png")} />
          <Text>Pengaduan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
