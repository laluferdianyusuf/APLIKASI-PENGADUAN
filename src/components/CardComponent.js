import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import News from "../components/content/News";
import {
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  BarsArrowUpIcon,
  ClockIcon,
  ChartBarSquareIcon,
  ChatBubbleLeftRightIcon,
} from "react-native-heroicons/solid";
import IconFa5 from "react-native-vector-icons/FontAwesome5";
import { theme } from "../themes/theme";
import MyMap from "./content/Maps";
import MapView, { Marker } from "react-native-maps";

export default function CardComponent({
  complaints,
  maleCount,
  femaleCount,
  onRefresh,
  refreshing,
  login,
  user,
}) {
  const navigation = useNavigation();
  const complaintForm = async () => {
    if (login) {
      navigation.navigate("ComplaintScreen");
    } else {
      navigation.navigate("LoginUserScreen");
    }
  };
  const complaintHistory = async () => {
    if (login) {
      navigation.navigate("HistoryScreen");
    } else {
      navigation.navigate("LoginUserScreen");
    }
  };
  const complaintProgress = async () => {
    if (login) {
      navigation.navigate("ProgressScreen");
    } else {
      navigation.navigate("LoginUserScreen");
    }
  };

  const complaintChart = async () => {
    navigation.navigate("ComplaintChartScreen");
  };

  const openWhatsApp = () => {
    const phoneNumber = "+6282339431011";
    const url = `whatsapp://send?phone=${phoneNumber}&text=Hello, I need assistance.`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log("WhatsApp is not installed on this device.");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <SafeAreaView className="flex bg-gray-200 justify-center items-center w-full rounded-t-[36px] pb-3">
      <View className="w-[90%] h-[6rem] bg-gray-100 rounded-[30px] absolute z-10 top-[-35px] shadow-lg px-3 py-2">
        <View className="flex flex-row justify-evenly py-3">
          <View className="flex-row items-center gap-2">
            <IconFa5 name="paperclip" size={20} color={theme.colors.warning} />
            <View>
              <Text className="text-[11px] font-bold ">Jumlah Kasus</Text>
              <Text>{complaints}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2 border-l-[1px] border-r-[1px] px-3">
            <IconFa5 name="male" size={20} color={theme.colors.extra} />
            <View>
              <Text className="text-[11px] font-bold">Laki - laki</Text>
              <Text>{maleCount} </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <IconFa5 name="female" size={20} color={theme.colors.alpha} />
            <View>
              <Text className="text-[11px] font-bold">Perempuan</Text>
              <Text>{femaleCount}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-col gap-3 mb-4 w-[90%] justify-center mt-10">
        <View
          className=" bg-gray-100  rounded-2xl flex-row justify-between items-center py-3 px-5"
          style={{
            display:
              user.role === "Admin" || user.role === "superadmin"
                ? "none"
                : "flex",
          }}
        >
          <View className="flex flex-row gap-2 items-center">
            <ClipboardDocumentListIcon color={theme.colors.extra} size={50} />
            <View>
              <Text className="font-bold text-[16px] ">Pengaduan</Text>
              <Text className="text-gray-400">Buat Pengaduan Anda</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 rounded-lg p-1"
            onPress={complaintForm}
          >
            <PlusIcon color="rgb(209 213 219)" size={30} />
          </TouchableOpacity>
        </View>

        <View className=" bg-gray-100 rounded-2xl  flex-row justify-between items-center py-3 px-5">
          <View className="flex flex-row gap-2 items-center">
            <BarsArrowUpIcon color={theme.colors.alpha} size={50} />
            <View>
              <Text className="font-bold text-[16px] ">Progress</Text>
              <Text className="text-gray-400">Progress Pengaduan Anda</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 rounded-lg p-1"
            onPress={complaintProgress}
          >
            <ArrowRightIcon color="rgb(209 213 219)" size={30} />
          </TouchableOpacity>
        </View>

        <View className=" bg-gray-100 rounded-2xl  flex-row justify-between items-center py-3 px-5">
          <View className="flex flex-row gap-2 items-center">
            <ClockIcon color={theme.colors.warning} size={50} />
            <View>
              <Text className="font-bold text-[16px] ">Riwayat</Text>
              <Text className="text-gray-400">Riwayat Pengaduan Anda</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 rounded-lg p-1"
            onPress={complaintHistory}
          >
            <ArrowRightIcon color="rgb(209 213 219)" size={30} />
          </TouchableOpacity>
        </View>

        <View className=" bg-gray-100 rounded-2xl  flex-row justify-between items-center py-3 px-5">
          <View className="flex flex-row gap-2 items-center">
            <ChartBarSquareIcon color={theme.colors.secondary} size={50} />
            <View>
              <Text className="font-bold text-[16px] ">Jumlah Kasus</Text>
              <Text className="text-gray-400">Detail Kasus Yang Ditangani</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 rounded-lg p-1"
            onPress={complaintChart}
          >
            <ArrowRightIcon color="rgb(209 213 219)" size={30} />
          </TouchableOpacity>
        </View>

        <View className=" bg-gray-100 rounded-2xl  flex-row justify-between items-center py-3 px-5">
          <View className="flex flex-row gap-2 items-center">
            <ChatBubbleLeftRightIcon color={theme.colors.success} size={50} />
            <View>
              <Text className="font-bold text-[16px] ">Konsultasi</Text>
              <Text className="text-gray-400">Konsultasi Melalui Whatsapp</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 rounded-lg p-1"
            onPress={openWhatsApp}
          >
            <ArrowRightIcon color="rgb(209 213 219)" size={30} />
          </TouchableOpacity>
        </View>

        <View className=" bg-gray-100 rounded-2xl  flex-row justify-between items-center py-3 px-5">
          <View className="flex flex-row gap-2 items-center">
            <InformationCircleIcon color="rgb(209 213 219)" size={50} />
            <View>
              <Text className="font-bold text-[16px] ">Informasi</Text>
              <Text className="text-gray-400">Informasi Kasus Kekerasan</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 rounded-lg p-1"
            onPress={() => {
              navigation.navigate("InformationScreen");
            }}
          >
            <ArrowRightIcon color="rgb(209 213 219)" size={30} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-gray-100 p-5 rounded-xl w-full flex justify-center items-center mt-5">
        <Text className="text-center font-bold pb-5">Lokasi TP Dotcom</Text>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -8.610682532996437,
              longitude: 116.0955455470225,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
          >
            <Marker
              coordinate={{
                latitude: -8.610682532996437,
                longitude: 116.0955455470225,
              }}
              title={"TP Dotcom"}
              description={"Transformasi Perempuan Dotcom"}
            />
          </MapView>
        </View>
      </View>

      {/* <Text className="font-bold text-[18px]">Berita</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={{ width: "90%" }}
      >
        <News />
      </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    height: 300,
    width: 350,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
