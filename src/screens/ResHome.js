import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../services/AuthContext";
import { get_orders } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ route, navigation }) {
  const { restaurant } = useContext(AuthContext);
  const username = restaurant.username;
  const name = username;
  const [i, setI] = useState(true);
  const [Orders, setOrders] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          const response = await get_orders(100);
          console.log(response.data);
          setOrders(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchOrders();
    }, [])
  );
  /*const Orders = [
    // data fetched from the database using the tocken. API endpoint
    {
      OderID: "134",
      status: "0",
      UserID: "645893",
      Date: "2021-10-10",
      Time: "12:30:00",
    },
    {
      OderID: "12234",
      status: "1",
      UserID: "645893",
      Date: "2021-10-10",
      Time: "12:30:00",
    },
    {
      OderID: "7876",
      status: "0",
      UserID: "645893",
      Date: "2021-10-10",
      Time: "12:30:00",
    },
    {
      OderID: "234",
      status: "1",
      UserID: "645893",
      Date: "2021-10-10",
      Time: "12:30:00",
    },
  ];*/

  goToResOrder = (order) => {
    console.log(order);
    navigation.navigate("ResOrder", { order }); // issue of navigation to ResOrder on initial render need to press back to comw to this screen.problem due to use of onpress in flat list rendering.//IDK some how issue fixed....Check once...
  };

  goToResProfile = () => {
    navigation.navigate("ResProfile", { username });
  };

  filterSwitch = () => {
    setI(!i);
  };

  const renderItem = ({ item }) => (
    <>
      {item.pending == i ? (
        <Pressable
          onPress={() => {
            goToResOrder(item);
          }}
        >
          <View style={[styles.renderItem, styles.listShadow]}>
            <View style={{ padding: 10 }}>
              <Text>Order ID</Text>
              <Text>{item.id}</Text>
            </View>
            <View style={styles.dateTime}>
              <Text>{item.created_at.substring(0, 10)}</Text>
              <Text>{item.created_at.substring(11, 19)}</Text>
            </View>
          </View>
        </Pressable>
      ) : null}
    </>
  );

  return (
    <>
      <StatusBar backgroundColor="#ad8840" />
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.userName}>{name}</Text>
          <View
            style={{
              alignSelf: "flex-end",
              paddingRight: 10,
              paddingTop: 5,
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity onPress={goToResProfile}>
              <Image source={require("../../assets/favicon.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={filterSwitch}
          style={[
            {
              backgroundColor: i ? "red" : "green",
            },
            styles.filterButton,
          ]}
        >
          <View>{i ? <Text>Pending</Text> : <Text>Completed</Text>}</View>
        </TouchableOpacity>
        <View style={styles.bottomView}>
          <FlatList
            style={{ width: "100%", marginTop: 5 }}
            data={Orders}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    padding: 10,
    alignItems: "center",
    width: "25%",
    borderRadius: 10,
    marginLeft: 10,
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
  dateTime: {
    padding: 10,
    position: "absolute",
    right: 0,
    marginBottom: 5,
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
  bottomView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
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
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "black",
    borderWidth: 2,
  },

  center: {
    paddingTop: "40%",
    alignItems: "center",
    backgroundColor: "#f74449",
  },

  h1: {
    paddingTop: 10,
    alignItems: "center",
  },

  input: {
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#431213",
    color: "white",
  },
  lable: {
    fontSize: 18,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingRight: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  button1: {
    width: 270,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffbf00",
    marginTop: 12,
    justifyContent: "center",
  },
  header: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    position: "absolute",
    top: 0,
    left: 0,
    height: 60,
  },
});
