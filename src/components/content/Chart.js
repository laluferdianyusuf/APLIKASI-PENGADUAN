import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";

const uri = "http://192.168.1.3:5000";

export default function Chart() {
  const [eduCase, setEduCase] = useState({
    TK: 0,
    SD: 0,
    SMP: 0,
    SMA: 0,
    PerguruanTinggi: 0,
  });

  const [genderCase, setGenderCase] = useState({
    male: 0,
    female: 0,
  });

  const [vioCase, setVioCase] = useState({
    physical: 0,
    sexual: 0,
    psychology: 0,
    economy: 0,
  });

  useEffect(() => {
    fetchEduData();
    fetchGenderData();
    fetchVioData();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 1,
    useShadowColorFromDataset: false,
  };

  const fetchEduData = async () => {
    try {
      const response = await axios.get(`${uri}/case/education`);
      if (response.data.status) {
        setEduCase(response.data.data.complaint);
      }
    } catch (error) {
      console.error(`Error getting data: ${error}`);
    }
  };

  const fetchGenderData = async () => {
    try {
      const response = await axios.get(`${uri}/case/gender`);
      if (response.data.status) {
        setGenderCase(response.data.data.complaint);
      }
    } catch (error) {
      console.error(`Error getting data: ${error}`);
    }
  };

  const fetchVioData = async () => {
    try {
      const response = await axios.get(`${uri}/case/violence`);
      if (response.data.status) {
        setVioCase(response.data.data.complaint);
      }
    } catch (error) {
      console.error(`Error getting data: ${error}`);
    }
  };

  const dataEdu = [
    {
      name: "TK",
      population: eduCase.TK,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "SD",
      population: eduCase.SD,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "SMP",
      population: eduCase.SMP,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "SMA",
      population: eduCase.SMA,
      color: "grey",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "PT",
      population: eduCase.PerguruanTinggi,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const dataGender = [
    {
      name: "L",
      population: genderCase.male,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "P",
      population: genderCase.female,
      color: "lightgreen",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const dataViolence = [
    {
      name: "Fisik",
      population: vioCase.physical,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Sexual",
      population: vioCase.sexual,
      color: "black",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Psikologi",
      population: vioCase.psychology,
      color: "aquamarine",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Ekonomi",
      population: vioCase.economy,
      color: "orange",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchEduData();
              fetchGenderData();
            }}
          />
        }
      >
        <View style={styles.card}>
          <PieChart
            data={dataEdu}
            width={300}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[5, 10]}
          />
          <Text
            style={{ textAlign: "center", fontSize: 18, marginVertical: 16 }}
          >
            Kasus Berdasarkan Pendidikan
          </Text>
        </View>
        <View style={styles.card}>
          <PieChart
            data={dataGender}
            width={300}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[5, 10]}
          />
          <Text
            style={{ textAlign: "center", fontSize: 18, marginVertical: 16 }}
          >
            Kasus Berdasarkan Gender
          </Text>
        </View>

        <View style={styles.card}>
          <PieChart
            data={dataViolence}
            width={300}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[5, 10]}
          />
          <Text
            style={{ textAlign: "center", fontSize: 18, marginVertical: 16 }}
          >
            Kasus Berdasarkan Jenis Kekerasan
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
  },
});
