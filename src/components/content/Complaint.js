import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios"; // tambahkan import axios
import { theme } from "../../themes/theme";

export default function Complaint({ onEdit }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 500);

    return () => clearInterval(interval);
  }, []);
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const currentUserRequest = await axios.get(
        "http://192.168.1.4:1000/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const currentUserResponse = currentUserRequest.data;
      console.log("user", currentUserResponse);
      if (currentUserResponse.status) {
        setUser(currentUserResponse.data);
      }

      if (currentUserResponse.data.id) {
        const dataComplaint = await axios.get(
          `http://192.168.1.4:1000/getCaseByUserId`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const payloadData = dataComplaint.data;
        console.log(payloadData.data);
        const filteredData = payloadData.data.filter(
          (complaint) => complaint.status === "Menunggu konfirmasi"
        );
        setData(filteredData.reverse());
      }
    } catch (err) {
      setIsLogin(false);
    }
  };

  const navigateToDetail = (id) => {
    // fungsi navigasi detail, sesuaikan dengan implementasi navigasi Anda
    console.log("Navigasi ke detail kasus dengan ID:", id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {data.length > 0 ? (
          data.map(
            (complaint) => (
              console.log("complaint", complaint),
              (
                <View key={complaint.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>{complaint.name}</Text>
                    <Text style={styles.status}>{complaint.status}</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <Text
                      style={styles.date}
                    >{`Tanggal: ${complaint.date}`}</Text>
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
                      {/* Icon placeholder */}
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )
          )
        ) : (
          <Text>Tidak ada data kasus yang ditemukan.</Text>
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
