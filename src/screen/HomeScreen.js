import React from "react";
import { View, SafeAreaView, ScrollView, Image, Text } from "react-native";
import CardComponent from "../components/CardComponent";

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView
        className=""
        style={{ backgroundColor: "rgb(94, 125, 189)" }}
      >
        <ScrollView
          className=""
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex justify-center items-center relative">
            <View className="my-8">
              <Image source={require("../assets/favicon.png")} />
            </View>
            <CardComponent />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
