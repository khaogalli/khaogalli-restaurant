import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { custom_stats, stats } from "../services/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { eachDayOfInterval, format } from "date-fns";

export default function Home({ route, navigation }) {
  const [period, setPeriod] = useState("lunch");
  const username = route.params.username;
  const [statis, setStatis] = useState({
    item_frequency: [],
    total_orders: 0,
    total_revenue: 0,
    orders_by_day: {},
    chartData: {},
    top_3_breakfast_items: [],
    top_3_lunch_items: [],
    top_3_dinner_items: [],
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  let getData = async () => {
    try {
      let res = await custom_stats(startDate, endDate);
      console.log(res.data);
      setStatis(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [endDate, startDate]);
  const name = username;

  const [openStart, setOpenStart] = useState(false);
  const [openClose, setOpenClose] = useState(false);

  const allDates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((date) => format(date, "yyyy-MM-dd"));

  const completeData = allDates.reduce((acc, date) => {
    acc[date] = statis.orders_by_day[date] || 0;
    return acc;
  }, {});
  let labels = Object.keys(completeData);
  let data = Object.values(completeData);

  let chartData = {
    labels: [0],
    datasets: [{ data: [0] }],
  };

  if (data.length != 0 && labels.length == data.length) {
    chartData.labels = labels.map((label) => {
      return label.substring(8);
    });
    chartData.datasets[0].data = data;
  }

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
    <ScrollView>
      <StatusBar backgroundColor="#ad8840" />
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.userName}>{name}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 20,
          }}
        >
          <View>
            <TouchableOpacity
              title="Open"
              style={{
                borderBottomColor: "#e26a00",
                backgroundColor: "#e26a00",
                opacity: 0.8,
                padding: 10,
                height: 40,
                width: 140,
                margin: 10,
                borderRadius: 5,
                borderBottomWidth: 4,
              }}
              onPress={() => setOpenStart(true)}
            >
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#ffffff",
                    fontWeight: "900",
                  }}
                >
                  Start Date
                </Text>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                {startDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              title="Close"
              style={{
                borderBottomColor: "#e26a00",
                backgroundColor: "#e26a00",
                opacity: 0.8,
                padding: 10,
                height: 40,
                width: 140,
                margin: 10,
                borderRadius: 5,
                borderBottomWidth: 4,
              }}
              onPress={() => setOpenStart(true)}
            >
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#ffffff",
                    fontWeight: "900",
                  }}
                >
                  End Date
                </Text>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                {endDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {openStart && (
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setOpenStart(false);
              setStartDate(selectedDate || startDate);
            }}
          />
        )}

        {openClose && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setOpenClose(false);
              setEndDate(selectedDate || endDate);
            }}
          />
        )}

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

        <View style={{ paddingTop: 20 }}>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width}
            height={220}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              formatXLabel: (label) => (
                <Text
                  style={{
                    transform: [{ rotate: "90deg" }],
                    width: 40,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  {label.substring(5)}
                </Text>
              ),
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
            paddingTop: 20,
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
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
    </ScrollView>
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
  filterButton: {
    padding: 10,
    alignItems: "center",
    width: "25%",
    borderRadius: 10,
    marginLeft: 10,
  },
});
