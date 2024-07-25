import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { theme } from "../themes/theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import Modal from "react-native-modal";

const uri = "http://192.168.1.3:5000";

export default function ComplaintDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [complaint, setComplaint] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    validateLogin();
  }, []);

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
          setDialogVisible(true);
        }
      } else {
        setDialogVisible(true);
      }
    } catch (error) {
      console.error(error.message);
      setDialogVisible(true);
    }
  };

  const fetchComplaintDetail = useCallback(async () => {
    try {
      const response = await axios.get(`${uri}/case/${id}`);
      if (response.data.status) {
        setComplaint(response.data.data.complaint);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaintDetail();
  }, [fetchComplaintDetail]);

  const handleUpdateComplaint = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${uri}/admin/update/complaint/${id}`,
        { status: "Accepted" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: response.data.message,
        });
        navigation.goBack();
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
        textBody: error.response?.data?.message || "Unknown error",
      });
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchComplaintDetail();
    setIsRefreshing(false);
  }, [fetchComplaintDetail]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading complaint details.</Text>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No complaint data available.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{complaint.name}</Text>
            <Text
              style={[
                styles.status,
                { color: getStatusColor(complaint.status) },
              ]}
            >
              {complaint.status}
            </Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tanggal:</Text>
              <Text style={styles.value}>
                {complaint.createdAt.split("T")[0]}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Born:</Text>
              <Text style={styles.value}>{complaint.born}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{complaint.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>NIK:</Text>
              <Text style={styles.value}>{complaint.nik}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{complaint.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{complaint.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Education:</Text>
              <Text style={styles.value}>{complaint.education}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Parent Name:</Text>
              <Text style={styles.value}>{complaint.parentName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Parent Job:</Text>
              <Text style={styles.value}>{complaint.parentJob}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Parent Address:</Text>
              <Text style={styles.value}>{complaint.parentAddress}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Parent Number:</Text>
              <Text style={styles.value}>{complaint.parentNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Case Type:</Text>
              <Text style={styles.value}>{complaint.caseType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Case Violence:</Text>
              <Text style={styles.value}>
                {mapViolenceType(complaint.caseViolence)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Case Description:</Text>
              <Text style={styles.value}>
                {mapViolenceDescription(complaint)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Chronology:</Text>
              <Text style={styles.value}>{complaint.chronology}</Text>
            </View>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.detailButtonText}>Terima Kasus</Text>
              <Icon
                name={`${loading ? "clock" : "check"}`}
                size={16}
                color={"white"}
                style={styles.detailButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Konfirmasi</Text>
          <Text style={styles.modalMessage}>
            Apakah Anda yakin ingin menerima kasus ini?
          </Text>
          <Image
            source={require("../assets/contract.png")}
            style={styles.imageDone}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdateComplaint}
            >
              <Text style={styles.modalButtonText}>Ya</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Tidak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const mapViolenceType = (type) => {
  switch (type) {
    case "physical":
      return "Fisik";
    case "sexual":
      return "Sexual";
    case "psychology":
      return "Psikologi";
    default:
      return "Ekonomi";
  }
};

const mapViolenceDescription = (complaint) => {
  switch (complaint.caseViolence) {
    case "physical":
      return complaint.physical;
    case "sexual":
      return complaint.sexual;
    case "psychology":
      return complaint.psychology;
    default:
      return complaint.economy;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return "#28a745"; // Green
    case "Rejected":
      return "#dc3545"; // Red
    case "Pending":
      return "#ffc107"; // Yellow
    default:
      return "#6c757d"; // Gray
  }
};

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
    backgroundColor: "white",
  },
  cardHeader: {
    padding: 16,
    backgroundColor: "#e8eaf6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  status: {
    fontSize: 14,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  cardBody: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    color: "#6c757d",
    flex: 1,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 2,
    flexWrap: "wrap",
    textAlign: "justify",
  },
  detailButton: {
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.purple400,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detailButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
  detailButtonIcon: {
    marginLeft: 8,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: theme.colors.purple400,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  modalCancelButton: {
    backgroundColor: "#6c757d",
  },
  imageDone: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: "contain",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "#d9534f",
  },
  noDataText: {
    fontSize: 18,
    color: "#6c757d",
  },
});
