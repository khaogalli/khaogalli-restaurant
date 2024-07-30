import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { stats } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ route, navigation }) {
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
  });

  const getData = async () => {
    setRefreshing(true);
    try {
      let res = await stats();
      console.log(res.data);
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
  let item_rank = statis.item_frequency;
  item_rank.sort((a, b) => b[1] - a[1]);
  return (
    <>
      <StatusBar backgroundColor="#ad8840" />
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.userName}>{name}</Text>
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
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 20,
          }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text style={{ textAlign: "center", fontSize: 20 }}>Top 3</Text>
            {item_rank.slice(0, 3).map((item) => (
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
          <View>
            <Text style={{ textAlign: "center", fontSize: 20 }}>Bottom 3</Text>
            {item_rank
              .slice(item_rank.length - 3, item_rank.length)
              .map((item) => (
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
    alignItems: "center",
    paddingTop: 20,
  },
  renderItem: {
    padding: 15,
    marginBottom: 7,
    margin: 2,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  listShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
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
});
