import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { theme } from "../themes/theme";

const complaintData = [
  {
    id: 1,
    title: "Pengaduan 1",
    status: "Diproses",
    date: "01 Juli 2024",
    description:
      "Deskripsi lengkap untuk Pengaduan 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
  },
  {
    id: 2,
    title: "Pengaduan 2",
    status: "Selesai",
    date: "03 Juli 2024",
    description:
      "Deskripsi lengkap untuk Pengaduan 2. Suspendisse potenti. In eleifend quam adipiscing odio. Suspendisse potenti. Maecenas malesuada. Duis euismod. Morbi ut mi. Nullam enim leo, egestas id, condimentum at, laoreet mattis, massa.",
  },
  {
    id: 3,
    title: "Pengaduan 3",
    status: "Ditunda",
    date: "05 Juli 2024",
    description:
      "Deskripsi lengkap untuk Pengaduan 3. Proin in tellus sit amet nibh dignissim sagittis. Nullam lorem ipsum, faucibus vel, interdum nec, mattis vitae, leo.",
  },
  {
    id: 4,
    title: "Pengaduan 4",
    status: "Diproses",
    date: "07 Juli 2024",
    description:
      "Deskripsi lengkap untuk Pengaduan 4. Praesent pede. Mauris pretium varius lacus. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien.",
  },
  {
    id: 5,
    title: "Pengaduan 5",
    status: "Selesai",
    date: "09 Juli 2024",
    description:
      "Deskripsi lengkap untuk Pengaduan 5. Praesent pede. Mauris pretium varius lacus. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien.",
  },
];

const HistoryScreen = ({ navigation }) => {
  const navigateToDetail = (complaintId) => {
    navigation.navigate("HistoryDetailScreen", { complaintId });
  };

  if (complaintData) {
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {complaintData.map((complaint) => (
          <View key={complaint.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{complaint.title}</Text>
              <Text style={styles.status}>{complaint.status}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.date}>{`Tanggal: ${complaint.date}`}</Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.description}
              >
                {complaint.description}
              </Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigateToDetail(complaint.id)}
              >
                <Text style={styles.detailButtonText}>Lihat Detail Kasus</Text>
                <Icon
                  name="arrow-right"
                  size={16}
                  color={theme.colors.purple400}
                  style={styles.detailButtonIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
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
    fontSize: 14,
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
});

export default HistoryScreen;
