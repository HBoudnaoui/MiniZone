import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import moment from "moment";
import { AntDesign, EvilIcons, Fontisto, Feather } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const [totals, setTotals] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    fetch("http://YourLocalHost:3000/totals")
      .then((response) => response.json())
      .then((data) => {
        setTotals({
          totalUsers: data.totals.totalUsers,
          totalProducts: data.totals.totalProducts,
          totalOrders: data.totals.totalOrders,
        });
        const processedSalesData = processSalesData(data.sales);
        setChartData({
          labels: processedSalesData.map((s) => s.date),
          datasets: [{ data: processedSalesData.map((s) => s.totalSales) }],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const processSalesData = (sales) => {
    const salesByDate = {};
    const startOfWeek = moment().startOf("isoWeek");
    const today = moment();

    for (
      let date = moment(startOfWeek);
      date.isSameOrBefore(today);
      date.add(1, "days")
    ) {
      salesByDate[date.format("YYYY-MM-DD")] = 0;
    }

    let weeklyTotalRevenue = 0;

    sales.forEach((sale) => {
      const saleDate = moment(sale.Date_Commande).format("YYYY-MM-DD");
      if (salesByDate.hasOwnProperty(saleDate)) {
        const dailyRevenue = sale.Prix * sale.Quantite;
        salesByDate[saleDate] += dailyRevenue;
        weeklyTotalRevenue += dailyRevenue;
      }
    });
    let totalRevenue = 0;
    Object.values(salesByDate).forEach((dailyTotal) => {
      totalRevenue += dailyTotal;
    });
    setTotalRevenue(weeklyTotalRevenue);

    return Object.keys(salesByDate).map((date) => {
      return { date, totalSales: salesByDate[date] };
    });
  };

  const chartConfig = {
    backgroundColor: "#1cc910",
    backgroundGradientFrom: "#eff3ff",
    backgroundGradientTo: "#efefef",
    decimalPlaces: 2, // specify the number of decimal places you want.
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
      padding: 5,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
      strokeDasharray: "0", // solid background lines with no dashes
    },
    propsForLabels: {
      fontWeight: "bold", // Make labels bold
    },
  };

  const chartStyle = {
    marginVertical: 8,
    borderRadius: 16,
    padding: 16, // Add padding for better spacing around the chart
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7, // Shadow for Android
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.card, styles.cardPurple]}>
          <AntDesign name="user" size={24} color="white" />
          <Text style={styles.cardValue}>{totals.totalUsers}</Text>
          <Text style={styles.cardTitle}>Utilisateurs</Text>
        </View>
        <View style={[styles.card, styles.cardYellow]}>
          <EvilIcons name="cart" size={24} color="white" />
          <Text style={styles.cardValue}>{totals.totalProducts}</Text>
          <Text style={styles.cardTitle}>Produits</Text>
        </View>
        <View style={[styles.card, styles.cardPink]}>
          <Feather name="inbox" size={24} color="white" />
          <Text style={styles.cardValue}>{totals.totalOrders}</Text>
          <Text style={styles.cardTitle}>Commandes</Text>
        </View>
        <View style={[styles.card, styles.cardGreen]}>
          <Fontisto name="money-symbol" size={24} color="white" />
          <Text style={styles.cardValue}>${totalRevenue.toFixed(2)}</Text>
          <Text style={styles.cardTitle}>Revenue</Text>
        </View>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>
          Ventes de la semaine
        </Text>
        <BarChart
          data={chartData}
          width={screenWidth}
          height={250} // Increase the height for better visibility
          chartConfig={chartConfig}
          style={chartStyle}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 50,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    margin: 10,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 18,
    color: "#fff",
  },
  cardPurple: {
    backgroundColor: "#9b59b6",
  },
  cardYellow: {
    backgroundColor: "#f1c40f",
  },
  cardPink: {
    backgroundColor: "#e74c3c",
  },
  cardGreen: {
    backgroundColor: "#2ecc71",
  },
  chart: {
    width: "100%",
    chartConfig: {},
    style: {
      marginVertical: 8,
      borderRadius: 16,
    },
  },
});

export default Dashboard;
