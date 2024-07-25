import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { theme } from "../themes/theme";

const uri = "http://192.168.1.3:5000";

export default function HistoryDetailScreen({ route }) {
  const [complaint, setComplaint] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { complaintId } = route.params;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComplaintDetail = useCallback(async () => {
    try {
      const response = await axios.get(`${uri}/case/${complaintId}`);
      if (response.data.status) {
        setComplaint(response.data.data.complaint);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    fetchComplaintDetail();
  }, [fetchComplaintDetail]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchComplaintDetail();
    setIsRefreshing(false);
  }, [fetchComplaintDetail]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Error loading data</Text>
        </View>
      </SafeAreaView>
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
            <Text style={styles.status}>{complaint.status}</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tanggal:</Text>
              <Text style={styles.value}>
                {complaint.createdAt.split("T")[0]}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{complaint.name}</Text>
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
                {complaint.caseViolence === "physical"
                  ? "Fisik"
                  : complaint.caseViolence === "sexual"
                  ? "Sexual"
                  : complaint.caseViolence === "psychology"
                  ? "Psikologi"
                  : "Ekonomi"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>
                {complaint.caseViolence === "physical"
                  ? complaint.physical
                  : complaint.caseViolence === "sexual"
                  ? complaint.sexual
                  : complaint.caseViolence === "psychology"
                  ? complaint.psychology
                  : complaint.economy}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Chronology:</Text>
              <Text style={styles.value}>{complaint.chronology}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
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
  },
});
