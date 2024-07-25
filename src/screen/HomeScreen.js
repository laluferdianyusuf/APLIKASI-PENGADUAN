import React, { useState, useCallback, useEffect } from "react";
import { View, SafeAreaView, ScrollView, RefreshControl } from "react-native";
import CardComponent from "../components/CardComponent";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const uri = "http://192.168.1.3:5000";

export default function HomeScreen() {
  const [complaints, setComplaints] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({});

  const validatedUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const currentUserRequest = await axios.get(`${uri}/current/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const currentUserResponse = currentUserRequest.data;

        if (currentUserResponse.status) {
          setLogin(true);
          setUser(currentUserResponse.data.user);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const complaintsRequest = await axios.get(`${uri}/list/case`);
      const complaintsResponse = complaintsRequest.data;

      if (complaintsResponse.status) {
        const allComplaints = complaintsResponse.data.complaint;

        setComplaints(allComplaints.length);

        const maleCount = allComplaints.filter(
          (complaint) => complaint.gender === "laki - laki"
        ).length;
        const femaleCount = allComplaints.filter(
          (complaint) => complaint.gender === "perempuan"
        ).length;

        setMaleCount(maleCount);
        setFemaleCount(femaleCount);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    validatedUser();

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <SafeAreaView style={{ backgroundColor: "rgb(94, 125, 189)" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View className="flex justify-center items-center relative">
          <View className="my-8"></View>
          <CardComponent
            complaints={complaints}
            maleCount={maleCount}
            femaleCount={femaleCount}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            login={login}
            user={user}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
