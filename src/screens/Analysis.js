import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { stats } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ route, navigation }) {
  const [period, setPeriod] = useState("lunch");
  const username = route.params.username;
  const [refreshing, setRefreshing] = useState(false);
  const [statis, setStatis] = useState({
    item_frequency: [],
    total_orders: 0,
    total_revenue: 0,
    orders_per_hour_by_day: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    top_3_breakfast_items: [],
    top_3_lunch_items: [],
    top_3_dinner_items: [],
  });

  const getData = async () => {
    setRefreshing(true);
    try {
      let res = await stats();
      setStatis(res.data);
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );
  const name = username;
  const [selectedDay, setSelectedDay] = useState(0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const AOV = statis.total_revenue / statis.total_orders;
  let item_rank = [];
  if (period == "breakfast") {
    item_rank = statis.top_3_breakfast_items;
  } else if (period == "lunch") {
    item_rank = statis.top_3_lunch_items;
  } else {
    item_rank = statis.top_3_dinner_items;
  }
  return (
    <>
      <StatusBar backgroundColor="#ad8840" />
      <View style={styles.container}>
        <View style={styles.topView}>
          <View>
            <Text style={styles.userName}>{name}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#e26a00",
                padding: 15,
                marginRight: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                navigation.navigate("CustomAnalysis", { username });
              }}
            >
              <Text>Custom Analysis</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text>Total Orders</Text>
            <Text>Total Revenue</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 24, color: "#e26a00" }}>
              {statis.total_orders}
            </Text>
            <Text style={{ fontSize: 24, color: "#e26a00" }}>
              {statis.total_revenue}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text>Average Order Value</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 24, color: "#e26a00" }}>
              {AOV.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.container_day}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                selectedDay === days.indexOf(day) &&
                  styles.selectedDayContainer,
              ]}
              onPress={() => {
                setSelectedDay(days.indexOf(day));
              }}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === days.indexOf(day) && styles.selectedDayText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingTop: 20 }}>
          <LineChart
            data={{
              labels: [
                "8",
                "9",
                "10",
                "11",
                "12",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
              ],
              datasets: [
                {
                  data: statis.orders_per_hour_by_day[selectedDay].slice(8, 21),
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={220}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "space-around",
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <Pressable
            onPress={() => {
              setPeriod("breakfast");
            }}
            style={[
              {
                borderBottomWidth: period == "breakfast" ? 2 : 0,
              },
              styles.filterButton,
            ]}
          >
            <View>
              <Text>Breakfast</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setPeriod("lunch");
            }}
            style={[
              {
                borderBottomWidth: period == "lunch" ? 2 : 0,
              },
              styles.filterButton,
            ]}
          >
            <View>
              <Text>Lunch</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setPeriod("dinner");
            }}
            style={[
              {
                borderBottomWidth: period == "dinner" ? 2 : 0,
              },
              styles.filterButton,
            ]}
          >
            <View>
              <Text>Dinner</Text>
            </View>
          </Pressable>
        </View>
        <View
          style={{
            paddingTop: 20,
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text style={{ textAlign: "center", fontSize: 20 }}>Top 3</Text>
            {item_rank.map((item) => (
              <Text
                style={{
                  fontSize: 24,
                  color: "#e26a00",
                  textAlign: "center",
                }}
              >
                {item[0]}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container_day: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    backgroundColor: "#f4f4f4",
  },
  userName: {
    fontSize: 28,
    position: "absolute",
    left: 0,
    verticalAlign: "middle",
    paddingTop: 5,
    paddingLeft: 10,
    color: "black",
  },
  container: {
    flex: 1,
  },
  topView: {
    height: 100,
    justifyContent: "center",
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedDayContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#e26a00",
  },
  dayText: {
    fontSize: 16,
    color: "black",
  },
  selectedDayText: {
    fontWeight: "bold",
    color: "#e26a00",
  },
  filterButton: {
    padding: 10,
    alignItems: "center",
    width: "25%",
    borderRadius: 10,
    marginLeft: 10,
  },
});
