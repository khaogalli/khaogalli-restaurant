import React, { useContext, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../services/AuthContext";
import { complete_order } from "../services/api";

export default function App({ route, navigation }) {
  const { restaurant } = useContext(AuthContext);
  const username = restaurant.username;
  const order = route.params.order;

  goToHome = async () => {
    try {
      let res = await complete_order(order.id);
      navigation.navigate("ResHome", { username }); // this is important to pass username back because we need to show the username on the home screen.
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>{item.quantity}</Text>
      <Text style={styles.itemAmount}>{item.price * item.quantity}</Text>
    </View>
  );

  const getTotalAmount = () => {
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#ad8840" />
      <View style={styles.container}>
        <Text style={styles.heading}>Order ID</Text>
        <Text style={styles.heading1}>{order.id}</Text>
        <Text style={styles.heading1}>{order.user_name}</Text>
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Item</Text>
            <Text style={styles.headerText}>Qty</Text>
            <Text style={styles.headerText}>Amount</Text>
          </View>
          <FlatList
            data={order.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.total}>
          <Text style={styles.totalText}>Grand Total:</Text>
          <Text style={styles.totalAmount}>Rs. {getTotalAmount()}</Text>
        </View>
        <View>
          <Text style={styles.paidStatus}>Paid</Text>
        </View>
        <View style={styles.buttonContainer}>
          {order.status == "paid" ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                goToHome();
              }}
            >
              <Text style={styles.buttonText}>Pending</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  paidStatus: { color: "#2dce08", textAlign: "center", fontSize: 32 },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  heading1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  heading2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    width: "33%", // Adjusting width to fit three columns
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  itemName: {
    fontSize: 16,
    width: "33%", // Adjusting width to fit three columns
    textAlign: "center",
  },
  itemQuantity: {
    fontSize: 16,
    width: "33%", // Adjusting width to fit three columns
    textAlign: "center",
  },
  itemAmount: {
    fontSize: 16,
    width: "33%", // Adjusting width to fit three columns
    textAlign: "center",
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#ffbf00",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
