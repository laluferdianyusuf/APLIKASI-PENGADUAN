import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  Platform,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import InformationButton from "../components/InformationButton";
import { theme } from "../themes/theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const uri = "http://192.168.1.3:5000";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function InformationScreen() {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [animations, setAnimations] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newInfo, setNewInfo] = useState({ title: "", descriptions: "" });
  const [accordionItems, setAccordionItems] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    validateLogin();
    fetchInformation();
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
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchInformation = async () => {
    try {
      const response = await axios.get(`${uri}/list/Info`);
      if (response.data.status) {
        setAccordionItems(response.data.data.informasi);
        const initialAnimations = {};
        response.data.data.informasi.forEach((_, index) => {
          initialAnimations[index] = new Animated.Value(0);
        });
        setAnimations(initialAnimations);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching information:", error);
    }
  };

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedIndex === index) {
      setExpandedIndex(-1);
      animateIcon(index, 0);
    } else {
      setExpandedIndex(index);
      animateIcon(index, 1);
    }
  };

  const animateIcon = (index, value) => {
    if (animations[index]) {
      Animated.timing(animations[index], {
        toValue: value,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const rotateInterpolate = (index) => {
    if (animations[index]) {
      return animations[index].interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
      });
    }
    return "0deg";
  };

  const addInformation = async () => {
    try {
      await axios.post(`${uri}/create/info`, newInfo);
      fetchInformation(); // Refresh the list after adding
      setModalVisible(false);
      setNewInfo({ title: "", descriptions: "" });
    } catch (error) {
      console.error("Error adding information:", error);
    }
  };

  const deleteInformation = async (id) => {
    try {
      await axios.delete(`${uri}/deleted/Info/${id}`);
      fetchInformation(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting information:", error);
    }
  };

  const handleModal = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {accordionItems.map((item, index) => (
          <View style={styles.card} key={index}>
            <TouchableWithoutFeedback onPress={() => toggleExpand(index)}>
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>{item.title}</Text>
                <Animated.View
                  style={{ transform: [{ rotate: rotateInterpolate(index) }] }}
                >
                  <Icon name="chevron-down" size={24} color="#333" />
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
            {expandedIndex === index && (
              <View style={styles.cardBody}>
                <Text style={styles.bodyText}>{item.descriptions}</Text>
                {(user.role === "Admin" || user.role === "superadmin") && (
                  <TouchableOpacity
                    style={styles.buttonDelete}
                    onPress={() => deleteInformation(item.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {(user.role === "Admin" || user.role === "superadmin") && (
        <InformationButton modal={handleModal} />
      )}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tambah Informasi</Text>
          <TextInput
            style={styles.input}
            placeholder="Judul"
            value={newInfo.title}
            onChangeText={(text) => setNewInfo({ ...newInfo, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Deskripsi"
            value={newInfo.descriptions}
            onChangeText={(text) =>
              setNewInfo({ ...newInfo, descriptions: text })
            }
            multiline
            numberOfLines={5}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={handleModalCancel}
            >
              <Text style={styles.modalButtonText}>Tidak</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={addInformation}
            >
              <Text style={styles.modalButtonText}>Ya</Text>
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
  },
  scrollView: {
    padding: 16,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardBody: {
    padding: 16,
  },
  bodyText: {
    fontSize: 14,
    color: "#666",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    display: "flex",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    width: "49%",
    padding: 10,
    backgroundColor: theme.colors.purple400,
    borderRadius: 5,
  },
  modalButtonCancel: {
    backgroundColor: "gray",
  },
  modalButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  deleteText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
  },
  buttonDelete: {
    alignItems: "flex-end",
  },
});
