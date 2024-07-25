import React from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Text,
} from "react-native";
import Chart from "../components/content/Chart";

export default function ComplaintChartScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Chart />
      </ScrollView>
    </SafeAreaView>
  );
}
