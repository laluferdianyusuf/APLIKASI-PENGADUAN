import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeIcon,
  NewspaperIcon,
  UserCircleIcon,
} from "react-native-heroicons/solid";
import HomeScreen from "../screen/Homescreen";
import ComplaintScreen from "../screen/ComplaintScreen";
import AccountScreen from "../screen/AccountScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "rgb(94, 125, 189)",
        tabBarInactiveTintColor: "rgba(158, 182, 230, .5)",
        tabBarStyle: {
          backgroundColor: "white",
          height: 70,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        headerStyle: {
          backgroundColor: "rgb(49, 46, 129)",
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "white",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconComponent;

          if (route.name === "Home") {
            iconComponent = (
              <HomeIcon color={color} size={focused ? size + 10 : size} />
            );
          } else if (route.name === "Pengajuan") {
            iconComponent = (
              <NewspaperIcon color={color} size={focused ? size + 10 : size} />
            );
          } else if (route.name === "Account") {
            iconComponent = (
              <UserCircleIcon color={color} size={focused ? size + 10 : size} />
            );
          }

          return iconComponent;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Pengajuan"
        component={ComplaintScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
