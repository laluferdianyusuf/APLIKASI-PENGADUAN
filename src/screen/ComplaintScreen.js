import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Complaint from "../components/content/Complaint";
import { useComplaints } from "../contexts/ComplaintContext";

const uri = "http://192.168.1.3:5000";

const ComplaintScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { complaints, updateComplaints } = useComplaints();

  const fetchComplaintsAndUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) throw new Error("No token found");

      const currentUserRequest = await axios.get(`${uri}/current/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userPayload = currentUserRequest.data;
      if (userPayload.status) {
        setUser(userPayload.data.user);
        const dataComplaint = await axios.get(`${uri}/case/wait/admin/id`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataPayload = dataComplaint.data;
        if (dataPayload.status) {
          updateComplaints(dataPayload.data.complaint.reverse());
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsLoading(false);
    }
  }, [updateComplaints]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaintsAndUser();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchComplaintsAndUser();
  }, [fetchComplaintsAndUser]);

  if (isLoading) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../assets/error.png")}
            style={{ width: 200, height: 200 }}
          />
          <Text>Harus login terlebih dahulu</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {complaints.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/empty-folder.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text>No complaints available</Text>
          </View>
        ) : (
          <Complaint complaints={complaints} user={user} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComplaintScreen;
