import React, { useCallback, useContext, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Switch,
  Platform,
} from "react-native";
import { get_menu, update_menu } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../services/AuthContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export default function App({ route, navigation }) {
  const [menu, setMenu] = useState([]);
  const { restaurant } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          let res = await get_menu(restaurant.id);
          setMenu(res.data.menu);
        } catch (error) {
          console.log(error.response.data);
        }
      }
      fetchData();
    }, [restaurant.restaurant_id])
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const toggleSwitch = (id) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const addItems = () => {
    if (editingId) {
      setMenu((prevMenu) =>
        prevMenu.map((item) =>
          item.id === editingId
            ? { ...item, name: name, price: parseFloat(price) }
            : item
        )
      );
      setEditingId(null);
    } else {
      const newItem = {
        id: uuidv4(),
        name: name,
        price: parseFloat(price),
        description: "",
        status: true,
      };
      setMenu((prevMenu) => [...prevMenu, newItem]);
    }
    setName("");
    setPrice("");
  };

  const editItem = (id) => {
    const item = menu.find((item) => item.id === id);
    setName(item.name);
    setPrice(item.price.toString());
    setEditingId(id);
  };

  const deleteItem = (id) => {
    setMenu((prevMenu) => prevMenu.filter((item) => item.id !== id));
  };

  const updateMenu = async () => {
    try {
      const newMenu = menu.map(({ id, status, ...rest }) => rest); // Removing id and status before sending to the API
      console.log(newMenu);
      await update_menu(newMenu);
      navigation.navigate("ResProfile", { menu });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.listItem, styles.listItemShadow]}>
      <View style={{ padding: 10 }}>
        <Text>Item {item.name}</Text>
        <Text>Price {item.price}</Text>
      </View>
      <View style={styles.toggleSwitchPosition}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={item.status ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleSwitch(item.id)}
          value={item.status}
        />
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => editItem(item.id)}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#ad8840" />
        <View style={styles.container}>
          <View style={[styles.topView, styles.headerAlign]}>
            <Text style={styles.headerText}>Edit Menu</Text>
            <TouchableOpacity style={styles.doneText} onPress={updateMenu}>
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={menu}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ padding: 2 }}
            />
          </View>
          <View style={styles.formHeaderContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Item</Text>
              <TextInput
                style={[styles.input, { height: 40, width: 150 }]}
                onChangeText={setName}
                value={name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={[styles.input, { height: 40, width: 100 }]}
                keyboardType="numeric"
                onChangeText={setPrice}
                value={price}
              />
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.addButton} onPress={addItems}>
                <Text style={styles.addButtonText}>
                  {editingId ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  saveText: {
    height: 40,
    width: 100,
    backgroundColor: "#ffbf00",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    textAlign: "center"
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
  },
  formHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    marginTop: 10,
  },
  addButton: {
    height: 40,
    backgroundColor: "#ffbf00",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginTop: 25,
    justifyContent: "center",
  },
  addButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    width: 100,
  },
  headerText: {
    fontSize: 28,
  },
  headerAlign: { flexDirection: "row", justifyContent: "space-between", padding: 10 },
  toggleSwitchPosition: { padding: 10, position: "absolute", right: 0 },
  listItemShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItem: {
    padding: 15,
    marginBottom: 7,
    margin: 2,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
  },
  container: {
    flex: 1,
  },
  topView: {
    height: 100,
    // justifyContent: "center",
    // alignItems: "center",
    paddingTop: 20,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    color: "black",
  },
  label: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    marginBottom: 2,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});