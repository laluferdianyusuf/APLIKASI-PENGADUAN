import React, { useState, useRef } from "react";
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
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const InformationScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const accordionItems = [
    {
      title: "Bagaimana mengenali pelecehan online dan perilaku kriminal ?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
    },
    {
      title: "Apa undang-undang tentang penyalahgunaan online ?",
      content:
        "Suspendisse potenti. In eleifend quam adipiscing odio. Suspendisse potenti. Maecenas malesuada. Duis euismod. Morbi ut mi. Nullam enim leo, egestas id, condimentum at, laoreet mattis, massa.",
    },
    {
      title: "Apa yang bisa dilakukan polisi ?",
      content:
        "Proin in tellus sit amet nibh dignissim sagittis. Nullam lorem ipsum, faucibus vel, interdum nec, mattis vitae, leo.",
    },
    {
      title: "Apa hak korban menurut hukum ?",
      content:
        "Praesent pede. Mauris pretium  varius lacus. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien.",
    },
    {
      title: "Apa yang harus dilakukan korban ?",
      content:
        "Praesent pede. Mauris pretium  varius lacus. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien.",
    },
    {
      title: "Siapa yang harus diajak bicara ?",
      content:
        "Praesent pede. Mauris pretium  varius lacus. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien.",
    },
  ];

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedIndex === index) {
      setExpandedIndex(-1);
      animateIcon(0); // Collapse animation
    } else {
      setExpandedIndex(index);
      animateIcon(1); // Expand animation
    }
  };

  const animateIcon = (value) => {
    Animated.timing(animation, {
      toValue: value,
      duration: 300, // Adjust as needed
      useNativeDriver: false,
    }).start();
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animatedStyles = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {accordionItems.map((item, index) => (
          <View style={styles.card} key={index}>
            <TouchableWithoutFeedback onPress={() => toggleExpand(index)}>
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>{item.title}</Text>
                <Animated.View style={[styles.iconContainer, animatedStyles]}>
                  <Icon name="chevron-down" size={20} color="#333" />
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
            {expandedIndex === index && (
              <View style={styles.cardBody}>
                <Text style={styles.bodyText}>{item.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: "#fff",
  },
  bodyText: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InformationScreen;
