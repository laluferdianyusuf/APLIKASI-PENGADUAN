import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { theme } from "../themes/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Icon from "react-native-vector-icons/Feather";

const uri = "http://192.168.1.3:5000";

export default function HistoryScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComplaint = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const request = await axios.get(`${uri}/case/done/admin/id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = request.data;
      if (response.status) {
        setData(response.data.complaint.reverse());
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  useEffect(() => {
    setFilteredComplaints(data);
  }, [data]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = data.filter((complaint) => {
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
      setFilteredComplaints(data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaint();
    setRefreshing(false);
  };

  const navigateToDetail = (complaintId) => {
    navigation.navigate("HistoryDetailScreen", { complaintId });
  };

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text>Error loading data</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* <SearchBar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ marginBottom: 10, borderRadius: 20, backgroundColor: "white" }}
      /> */}
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Array.isArray(filteredComplaints) && filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
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
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => navigateToDetail(complaint.id)}
                >
                  <Text style={styles.detailButtonText}>
                    Lihat Detail Kasus
                  </Text>
                  <Icon
                    name="arrow-right"
                    size={16}
                    color={theme.colors.purple400}
                    style={styles.detailButtonIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.center}>
            <Text>No complaints available</Text>
          </View>
        )}
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
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detailButtonText: {
    fontSize: 12,
    color: theme.colors.purple400,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  detailButtonIcon: {
    marginLeft: 4,
  },
});
