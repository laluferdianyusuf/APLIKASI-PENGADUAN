import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { theme } from "../themes/theme";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import { useComplaints } from "../contexts/ComplaintContext";
import Modal from "react-native-modal";

const uri = "http://192.168.1.3:5000";

export default function ProgressScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const { complaintsProgress, updateComplaintProgress } = useComplaints();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const validateLogin = async () => {
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
          setUser(currentUserResponse.data.user);
        } else {
          navigation.navigate("Login");
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error.message);
      navigation.navigate("Login");
    }
  };

  const fetchComplaint = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const request = await axios.get(`${uri}/case/proccess/admin/id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = request.data;
      if (response.status) {
        updateComplaintProgress(response.data.complaint.reverse());
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    validateLogin();
    fetchComplaint();
  }, []);

  useEffect(() => {
    setFilteredComplaints(complaintsProgress);
  }, [complaintsProgress]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = complaintsProgress.filter((complaint) => {
        return (
          complaint.name.toLowerCase().includes(lowerCaseQuery) ||
          (complaint.createdAt &&
            complaint.createdAt.split("T")[0].includes(lowerCaseQuery)) ||
          complaint.chronology.toLowerCase().includes(lowerCaseQuery) ||
          complaint.status.toLowerCase().includes(lowerCaseQuery)
        );
      });
      setFilteredComplaints(filtered);
    } else {
      setFilteredComplaints(complaintsProgress);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaint();
    setRefreshing(false);
  };

  const handleUpdateDoneComplaint = async (id) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${uri}/admin/done/complaint/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        await fetchComplaint();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: response.data.message,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: response.data.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDoneComplaint = (id) => {
    setSelectedComplaintId(id);
    setIsModalVisible(true);
  };

  const handleModalConfirm = () => {
    setIsModalVisible(false);
    if (selectedComplaintId) {
      handleUpdateDoneComplaint(selectedComplaintId);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedComplaintId(null);
  };

  if (loading)
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      </ScrollView>
    );

  if (error)
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../assets/error.png")}
            style={styles.imageDone}
          />
          <Text>Error loading data</Text>
        </View>
      </ScrollView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Array.isArray(complaintsProgress) &&
          complaintsProgress.map((complaint) => (
            <View key={complaint.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{complaint.name}</Text>
                <Text style={styles.status}>{complaint.status}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.date}>{`Tanggal: ${
                  complaint.createdAt.split("T")[0]
                }`}</Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.description}
                >
                  {complaint.chronology}
                </Text>
              </View>
              {(user.role === "Admin" || user.role === "superadmin") && (
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => confirmDoneComplaint(complaint.id)}
                >
                  <Text style={styles.detailButtonText}>Kasus Selesai</Text>
                  <Icon
                    name="check"
                    size={16}
                    color={theme.colors.purple400}
                    style={styles.detailButtonIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
      </ScrollView>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Konfirmasi</Text>
          <Text style={styles.modalText}>
            Apakah Anda yakin kasus ini sudah selesai?
          </Text>
          <Image
            source={require("../assets/done.png")}
            style={styles.imageDone}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalConfirm}
            >
              <Text style={styles.modalButtonText}>Ya</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={handleModalCancel}
            >
              <Text style={styles.modalButtonText}>Tidak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgb(229 231 235)",
  },
  scrollView: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgb(243 244 246)",
  },
  cardHeader: {
    padding: 16,
    backgroundColor: "rgb(243 244 246)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 10,
    color: "#666",
    textTransform: "capitalize",
  },
  cardBody: {
    padding: 16,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  detailButton: {
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    marginRight: 10,
  },
  detailButtonText: {
    fontSize: 12,
    color: theme.colors.purple400,
    fontWeight: "bold",
  },
  detailButtonIcon: {
    marginLeft: 4,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  modalButton: {
    width: "50%",
    padding: 10,
    backgroundColor: theme.colors.purple400,
    borderRadius: 5,
  },
  modalButtonCancel: {
    backgroundColor: "gray",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageDone: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
});
