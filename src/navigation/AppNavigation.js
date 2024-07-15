import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-native-paper";
import {
  HomeIcon,
  NewspaperIcon,
  InformationCircleIcon,
} from "react-native-heroicons/solid";
import HomeScreen from "../screen/HomeScreen";
import ComplaintScreen from "../screen/ComplaintScreen";
import LoginUserScreen from "../screen/LoginUserScreen";
import { theme } from "../themes/theme";
import { AlertNotificationRoot } from "react-native-alert-notification";
import RegisterScreen from "../screen/RegisterScreen";
import LoginAdminScreen from "../screen/LoginAdminScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Pengajuan"
        component={HomeScreen}
        options={{
          tabBarLabel: "Lihat Pengajuan",
          tabBarIcon: ({ color, size }) => (
            <NewspaperIcon color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Informasi"
        component={HomeScreen}
        options={{
          tabBarLabel: "Informasi Terkait",
          tabBarIcon: ({ color, size }) => (
            <InformationCircleIcon color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <Provider theme={theme}>
      <AlertNotificationRoot>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="LoginUserScreen"
            screenOptions={{
              headerStyle: {
                backgroundColor: "rgb(49, 46, 129)",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
              },
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginUserScreen"
              component={LoginUserScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginAdminScreen"
              component={LoginAdminScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NavigatorScreen"
              component={TabNavigator}
              options={{
                title: "Aduanku",
                headerShown: true,
                headerBackTitleVisible: false,
                headerTintColor: "#fff",
                headerShadowVisible: false,
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 18,
                },
              }}
            />
            <Stack.Screen
              name="ComplaintScreen"
              component={ComplaintScreen}
              options={{
                title: "Pengaduan",
                headerShown: true,
                headerBackTitleVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 18,
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AlertNotificationRoot>
    </Provider>
  );
}
