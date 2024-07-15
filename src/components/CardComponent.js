import React from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import News from "../components/content/News";
import {
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
} from "react-native-heroicons/solid";

export default function CardComponent() {
  const navigation = useNavigation();
  const handleLink = () => {
    navigation.navigate("ComplaintScreen");
  };

  return (
    <SafeAreaView className="flex bg-gray-200 justify-center items-center mt-36 w-full rounded-t-[36px] ">
      <View className="w-[90%] h-20 bg-gray-100 rounded-[30px] absolute z-10 top-[-35px] shadow-lg"></View>
      <View className="flex-row gap-3 mb-4 w-full justify-center mt-10">
        <TouchableOpacity
          className="w-[45%] bg-gray-100 gap-3 rounded-2xl flex justify-center items-center py-10"
          onPress={handleLink}
        >
          <ClipboardDocumentListIcon color="rgb(94, 125, 189)" size={65} />
          <Text>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[45%] bg-gray-100 gap-3 rounded-2xl flex justify-center items-center py-10">
          <ClipboardDocumentListIcon color="rgb(94, 125, 189)" size={65} />
          <Text>Perkosa</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row gap-3 mb-4 w-full justify-center">
        <TouchableOpacity className="w-[45%] bg-gray-100 gap-3 rounded-2xl flex justify-center items-center py-10">
          <ArrowTrendingUpIcon color="rgb(94, 125, 189)" size={65} />
          <Text>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[45%] bg-gray-100 gap-3 rounded-2xl flex justify-center items-center py-10">
          <ClipboardDocumentListIcon color="rgb(94, 125, 189)" size={65} />
          <Text>Pengaduan</Text>
        </TouchableOpacity>
      </View>

      <Text className="font-bold text-[18px]">Berita</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <News />
      </ScrollView>
    </SafeAreaView>
  );
}
