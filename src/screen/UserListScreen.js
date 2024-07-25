import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const navigation = useNavigation();
  const uri = "http://192.168.1.3:5000";

  useEffect(() => {
    const getCurrentUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const userResponse = await axios.get(`${uri}/current/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCurrentUserId(userResponse.data.data.user.id);
          setCurrentUserRole(userResponse.data.data.user.role);
          const listResponse = await axios.get(`${uri}/list/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          let fetchedUsers = listResponse.data.data.user;

          if (["Admin", "superadmin"].includes(currentUserRole)) {
            fetchedUsers = fetchedUsers.filter(
              (user) => !["Admin", "superadmin"].includes(user.role)
            );
          } else {
            fetchedUsers = fetchedUsers.filter((user) => user.role === "Admin");
          }

          if (currentUserId) {
            fetchedUsers = fetchedUsers.filter(
              (user) => user.id !== currentUserId
            );
          }

          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUserDetails();
  }, [currentUserRole, currentUserId]);

  const handleUserPress = (chatWithId) => {
    navigation.navigate("ConsultationScreen", {
      userId: currentUserId,
      chatWithId,
    });
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item.id)}
    >
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 10,
  },
  userName: {
    fontSize: 18,
  },
});

export default UserListScreen;
