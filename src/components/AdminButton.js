import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Icon from "react-native-vector-icons/FontAwesome6";

export default function AdminButton({ loginAdmin }) {
  return (
    <TouchableOpacity onPress={loginAdmin} style={styles.container}>
      <Icon name="circle-user" size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 15 + getStatusBarHeight(),
    right: 18,
  },
  image: {
    width: 24,
    height: 24,
  },
});
