import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Logo() {
  return (
    <View style={styles.shadow}>
      <Image source={require("../assets/aduanku.png")} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 230,
    height: 230,
    // borderRadius: 5,
    marginBottom: 12,
  },
  shadow: {
    // elevation: 3,
    padding: 5,
    borderRadius: 5,
    shadowColor: "grey",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
