import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, Button, Dialog, Portal } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconFa6 from "react-native-vector-icons/FontAwesome6";
import { theme } from "../themes/theme";
import Modal from "react-native-modal";

const uri = "http://192.168.1.3:5000";

export default function AccountScreen({ navigation }) {
  const [user, setUser] = React.useState({});
  const [isLogin, setIsLogin] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Animated value for the logout button
  const animatedScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
            setIsLogin(true);
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

    validateLogin();
  }, []);

  const handleLoginNavigation = () => {
    setDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginUserScreen" }],
    });
  };

  const handleHome = () => {
    setDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "NavigatorScreen" }],
    });
  };

  const handleRegisterAdmin = () => {
    navigation.navigate("RegisterAdminScreen");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginUserScreen" }],
    });
  };

  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const encryptEmail = (email) => {
    if (!email) return "";
    const atIndex = email.indexOf("@");
    const encryptedEmail = email.slice(0, 1) + "*****" + email.slice(atIndex);
    return encryptedEmail;
  };

  const encryptPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const encryptedPhoneNumber = phoneNumber.slice(0, 3) + "*****";
    return encryptedPhoneNumber;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {((user && user.role === "Admin") || user.role === "superadmin") && (
          <TouchableOpacity
            style={styles.addAdmin}
            onPress={handleRegisterAdmin}
          >
            <IconFa6 name="circle-user" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {user && user.name ? user.name.slice(0, 1) : ""}{" "}
            </Text>
            <View style={styles.button}>
              <Text>{user && user.role}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.row}>
            <View style={styles.infoRow}>
              <Text style={styles.infoTextTitle}>Name</Text>
              <Icon name="form-textbox" color={theme.colors.extra} size={20} />
            </View>
            <Text style={styles.infoText}>{user && user.name} </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.infoRow}>
              <Text style={styles.infoTextTitle}>Username</Text>
              <Icon name="account" color={theme.colors.extra} size={20} />
            </View>
            <Text style={styles.infoText}>{user && user.username} </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.infoRow}>
              <Text style={styles.infoTextTitle}>Email</Text>
              <Icon name="email-outline" color={theme.colors.extra} size={20} />
            </View>
            <Text style={styles.infoText}>
              {encryptEmail(user && user.email)}{" "}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.infoRow}>
              <Text style={styles.infoTextTitle}>Phone number</Text>
              <Icon
                name="cellphone-dock"
                color={theme.colors.extra}
                size={20}
              />
            </View>
            <Text style={styles.infoText}>
              {encryptPhoneNumber(user && user.phoneNumber)}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.infoRow}>
              <Text style={styles.infoTextTitle}>Address</Text>
              <Icon
                name="map-marker-outline"
                color={theme.colors.extra}
                size={20}
              />
            </View>
            <Text style={styles.infoText}>{user && user.address}</Text>
          </View>
          <Animated.View
            style={[
              styles.logoutButton,
              { transform: [{ scale: animatedScale }] },
            ]}
          >
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => setModalVisible(true)}
              style={styles.logoutContent}
            >
              <Text style={styles.menuItemText}>Logout</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible}>
          <Dialog.Title>Login Required</Dialog.Title>
          <Dialog.Content>
            <Text>You need to login to access this resource.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.error} onPress={handleHome}>
              Tidak
            </Button>
            <Button
              textColor={theme.colors.purple400}
              onPress={handleLoginNavigation}
            >
              Login
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Konfirmasi</Text>
          <Text style={styles.modalMessage}>
            Apakah Anda yakin ingin keluar?
          </Text>
          <Image
            source={require("../assets/signin-out.png")}
            style={styles.imageDone}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalButton} onPress={logout}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
  },
  scroll: {
    marginTop: 20,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
    position: "relative",
  },
  addAdmin: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  button: {
    marginTop: 20,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 10,
    width: 120,
    borderRadius: 50,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    textAlign: "center",
    backgroundColor: "rgba(158, 182, 230, .5)",
    width: 150,
    height: 150,
    borderRadius: 75,
    fontWeight: "600",
    color: "rgb(94, 125, 189)",
    textTransform: "uppercase",
    fontSize: 32,
    textAlignVertical: "center",
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
    color: theme.colors.secondary,
  },
  infoSection: {
    marginBottom: 15,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "column",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: "justify",
  },
  infoTextTitle: {
    color: theme.colors.secondary,
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.purple400,
    padding: 10,
    backgroundColor: "white",
    marginHorizontal: 20,
  },
  logoutContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    color: theme.colors.purple400,
    marginRight: 10,
    fontWeight: "600",
    fontSize: 16,
  },
  portalStyle: {
    color: theme.colors.purple400,
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
});
