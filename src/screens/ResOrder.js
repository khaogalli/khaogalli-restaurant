import React, { useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function App({ route, navigation }) {
  const orderItems = [
    // data fetched from the database using the order id
    { id: "1", name: "Item 1", quantity: 2, amount: 10 },
    { id: "2", name: "Item 2", quantity: 1, amount: 15 },
    { id: "3", name: "Item 3", quantity: 3, amount: 20 },
  ];
  const [paid, setPaid] = useState(true); // status of payment feched from the database using the order id

  // get username from the data base using the order id
  const username = "username"; // for testing purposes
  const orderID = route.params.OderID;
  const [orderStatus, setOrderStatus] = useState(false);

  goToHome = () => {
    setOrderStatus(!orderStatus);
    navigation.navigate("ResHome", { username }); // this is important to pass username back because we need to show the username on the home screen.
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>{item.quantity}</Text>
      <Text style={styles.itemAmount}>{item.amount}</Text>
    </View>
  );

  const getTotalAmount = () => {
    return orderItems.reduce(
      (total, item) => total + item.amount * item.quantity,
      0
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#ad8840" />
      <View style={styles.container}>
        <Text style={styles.heading}>Order ID</Text>
        <Text style={styles.heading1}>{orderID}</Text>
        <Text style={styles.heading1}>~Customer ID/Name~{username}</Text>
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Item</Text>
            <Text style={styles.headerText}>Qty</Text>
            <Text style={styles.headerText}>Amount</Text>
          </View>
          <FlatList
            data={orderItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.total}>
          <Text style={styles.totalText}>Grand Total:</Text>
          <Text style={styles.totalAmount}>Rs. {getTotalAmount()}</Text>
        </View>
        <View>
          {paid ? (
            <Text style={styles.paidStatus}>Paid</Text>
          ) : (
            <Text style={styles.paidStatus}>Not Paid</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={goToHome} // should I route back to home page? or wait for the user to press back button? Ig former is better...
          >
            {orderStatus ? (
              <Text style={styles.buttonText}>Complete</Text>
            ) : (
              <Text style={styles.buttonText}>Pending</Text>
            )}
          </TouchableOpacity>
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
