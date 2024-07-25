import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Icon from "react-native-vector-icons/FontAwesome6";
import { theme } from "../themes/theme";

export default function InformationButton({ modal }) {
  return (
    <TouchableOpacity onPress={modal} style={styles.container}>
      <Icon name="plus" size={20} color={"white"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: getStatusBarHeight(),
    right: 18,
    backgroundColor: theme.colors.purple400,
    padding: 10,
    borderRadius: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});
