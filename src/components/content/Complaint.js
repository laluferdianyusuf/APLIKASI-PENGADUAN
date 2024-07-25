import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { theme } from "../../themes/theme";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../SearchBar";
import Icon from "react-native-vector-icons/Feather";
import { debounce } from "lodash";
import { useComplaints } from "../../contexts/ComplaintContext";

export default function Complaint({ user }) {
  const navigation = useNavigation();
  const { complaints, updateComplaints } = useComplaints();
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredComplaints(complaints);
  }, [complaints]);

  const handleSearch = useCallback(
    debounce((query) => {
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        const filteredComplaints = complaints.filter((complaint) => {
          return (
            complaint.name.toLowerCase().includes(lowerCaseQuery) ||
            (complaint.createdAt &&
              complaint.createdAt.split("T")[0].includes(lowerCaseQuery)) ||
            complaint.chronology.toLowerCase().includes(lowerCaseQuery) ||
            complaint.status.toLowerCase().includes(lowerCaseQuery)
          );
        });
        setFilteredComplaints(filteredComplaints);
      } else {
        setFilteredComplaints(complaints);
      }
    }, 300),
    [complaints]
  );

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const navigateToDetail = (id) => {
    if ((user && user.role === "Admin") || user.role === "superadmin") {
      navigation.navigate("ComplaintDetailScreen", { id });
    } else {
      navigation.navigate("EditComplaintScreen", { id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <SearchBar
        placeholder="Search"
        onChangeText={handleSearchInputChange}
        value={searchQuery}
        style={{
          marginBottom: 10,
          borderRadius: 20,
          backgroundColor: "white",
        }}
      /> */}
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {Array.isArray(filteredComplaints) && filteredComplaints ? (
          filteredComplaints.map((complaint) => (
            <View key={complaint.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{complaint.name}</Text>
                <Text style={styles.status}>{complaint.status}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.date}>{`Tanggal: ${
                  complaint.createdAt
                    ? complaint.createdAt.split("T")[0]
                    : "N/A"
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
                    {(user && user.role === "Admin") ||
                    user.role === "superadmin"
                      ? "Lihat Detail Kasus"
                      : "Edit Kasus"}
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
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/empty-folder.png")}
              style={styles.noDataImage}
            />
            <Text style={styles.noDataText}>No complaints available</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "transparent",
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
    textAlign: "justify",
  },
  detailButton: {
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  detailButtonText: {
    fontSize: 12,
    color: theme.colors.purple400,
    fontWeight: "bold",
  },
  detailButtonIcon: {
    marginLeft: 4,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noDataImage: {
    width: 200,
    height: 200,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 20,
    textAlign: "center",
  },
});
