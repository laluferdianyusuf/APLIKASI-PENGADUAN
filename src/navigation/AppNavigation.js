import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-native-paper";
import ComplaintFormScreen from "../screen/ComplaintFormScreen";
import LoginUserScreen from "../screen/LoginUserScreen";
import { theme } from "../themes/theme";
import { AlertNotificationRoot } from "react-native-alert-notification";
import RegisterScreen from "../screen/RegisterScreen";
import RegisterAdminScreen from "../screen/RegisterAdminScreen";
import HistoryScreen from "../screen/HistoryScreen";
import InformationScreen from "../screen/InformationScreen";
import HistoryDetailScreen from "../screen/HistoryDetailScreen";
import ProgressScreen from "../screen/ProgressScreen";
import EditComplaintScreen from "../screen/EditComplaintScreen";
import ComplaintDetailScreen from "../screen/ComplaintDetailScreen";
import ComplaintChartScreen from "../screen/ComplaintChartScreen";
import UserListScreen from "../screen/UserListScreen";
import ConsultationScreen from "../screen/ConsultationScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const uri = "http://192.168.1.3:5000";

const Stack = createNativeStackNavigator();
import TabNavigator from "./TabNavigator";

export default function AppNavigation() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const response = await axios.get(`${uri}/current/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.status) {
            setInitialRoute("NavigatorScreen");
          } else {
            setInitialRoute("LoginUserScreen");
          }
        } else {
          setInitialRoute("LoginUserScreen");
        }
      } catch (error) {
        console.error("Token check failed", error);
        setInitialRoute("LoginUserScreen");
      }
    };

    checkToken();
  }, []);

  if (initialRoute === null) {
    return null;
  }

  return (
    <Provider theme={theme}>
      <AlertNotificationRoot>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
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
              name="RegisterAdminScreen"
              component={RegisterAdminScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginUserScreen"
              component={LoginUserScreen}
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
              component={ComplaintFormScreen}
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
            <Stack.Screen
              name="ComplaintDetailScreen"
              component={ComplaintDetailScreen}
              options={{
                title: "Detail Pengaduan",
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
            <Stack.Screen
              name="EditComplaintScreen"
              component={EditComplaintScreen}
              options={{
                title: "Ubah Pengaduan",
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
            <Stack.Screen
              name="HistoryScreen"
              component={HistoryScreen}
              options={{
                headerShown: true,
                title: "Riwayat Pengaduan",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
              }}
            />
            <Stack.Screen
              name="ProgressScreen"
              component={ProgressScreen}
              options={{
                headerShown: true,
                title: "Perkembangan Pengaduan",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
              }}
            />
            <Stack.Screen
              name="HistoryDetailScreen"
              component={HistoryDetailScreen}
              options={{
                headerShown: true,
                title: "Detail Riwayat Pengaduan",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
              }}
            />
            <Stack.Screen
              name="InformationScreen"
              component={InformationScreen}
              options={{
                headerShown: true,
                title: "Informasi Terkait",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
              }}
            />
            <Stack.Screen
              name="ComplaintChartScreen"
              component={ComplaintChartScreen}
              options={{
                headerShown: true,
                title: "Detail Kasus",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
              }}
            />
            <Stack.Screen
              name="UserListScreen"
              component={UserListScreen}
              options={{
                headerShown: true,
                title: "List User",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
              }}
            />
            <Stack.Screen
              name="ConsultationScreen"
              component={ConsultationScreen}
              options={{
                headerShown: true,
                title: "Konsultasi Kasus",
                headerStyle: {
                  backgroundColor: "rgb(94, 125, 189)",
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AlertNotificationRoot>
    </Provider>
  );
}
