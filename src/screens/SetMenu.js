import React, { useCallback, useContext, useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import {
  add_item,
  delete_item,
  get_menu,
  ITEM_IMAGE_URL,
  RESTAURANT_IMAGE_URL,
  update_item,
} from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../services/AuthContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { genNonce } from "../services/utils";
import { Image as ExpoImage } from "expo-image";

export default function App({ route, navigation }) {
  const [menu, setMenu] = useState([]);
  const { restaurant } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  async function fetchData() {
    try {
      let res = await get_menu(restaurant.id);
      setLoading(false);
      setMenu(res.data.menu);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [restaurant.restaurant_id])
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const toggleSwitch = async (item) => {
    try {
      setMenu((prevMenu) =>
        prevMenu.map((it) =>
          it.id === item.id ? { ...it, available: !it.available } : it
        )
      );
      await update_item({ id: item.id, available: !item.available });
    } catch (error) {
      console.log(error);
    }

    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const addItems = async () => {
    if (editingId) {
      try {
        let updatedItem = {
          id: editingId,
          name: name,
          price: parseFloat(price),
          description: description,
        };

        try {
          await update_item(updatedItem);
        } catch (error) {
          console.log(error);
        }
        fetchData();
      } catch (error) {
        console.log(error);
      }
      setEditingId(null);
    } else {
      const newItem = {
        name: name,
        price: parseFloat(price),
        description: description,
        status: true,
      };
      try {
        await add_item(newItem);
      } catch (error) {
        console.log(error);
      }
      fetchData();
    }
    setName("");
    setPrice("");
    setDescription("");
  };

  const editItem = (id) => {
    const item = menu.find((item) => item.id === id);
    setName(item.name);
    setPrice(item.price.toString());
    setEditingId(id);
    setDescription(item.description);
  };

  const deleteItem = async (id) => {
    try {
      await delete_item(id);
    } catch (error) {
      console.log(error);
    }
    fetchData();
  };

  const [nonce, setNonce] = useState(genNonce());

  const resetNonce = () => {
    setNonce(genNonce());
  };

  const [photo, setPhoto] = useState(RESTAURANT_IMAGE_URL + restaurant.id);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    };

    requestPermissions();
  }, []);

  const pickImage = async (id) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);

      try {
        const base64 = await FileSystem.readAsStringAsync(
          result.assets[0].uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        const res = await update_item({ id, image: base64 });
        resetNonce();
        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Error reading file or uploading image:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.listItem, styles.listItemShadow]}>
      <TouchableOpacity
        onPress={() => {
          pickImage(item.id);
        }}
      >
        <View>
          <ExpoImage
            source={{ uri: ITEM_IMAGE_URL + item.id + "?" + nonce }}
            placeholder={require("../../assets/grey.png")}
            priority="high"
            style={{ height: 65, width: 65, borderRadius: 10 }}
          />
        </View>
      </TouchableOpacity>

      <View style={{ padding: 10, width: 160 }}>
        <Text>{item.name}</Text>
        <Text> Rs. {item.price}</Text>
      </View>

      <View style={styles.toggleSwitchPosition}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={item.available ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleSwitch(item)}
          value={item.available}
        />
      </View>
      <TouchableOpacity
        style={[styles.editButton]}
        onPress={() => editItem(item.id)}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert("Delete", "Are you sure you want to delete the item", [
            {
              text: "Cancel",
              style: "cancel",
            }, 
            { text: "OK", onPress: () => deleteItem(item.id) },
          ]);
          
        }}
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
          </View>

          {!loading ? (
            <View style={{ flex: 1 }}>
              <FlatList
                data={menu}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={{ padding: 2 }}
              />
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.listItem,
                  {
                    height: 85,
                    backgroundColor: "#333333",
                    opacity: 0.5,
                  },
                ]}
              ></View>
              <View
                style={[
                  styles.listItem,
                  {
                    height: 85,
                    backgroundColor: "#333333",
                    opacity: 0.4,
                  },
                ]}
              ></View>
              <View
                style={[
                  styles.listItem,
                  {
                    height: 85,
                    backgroundColor: "#333333",
                    opacity: 0.3,
                  },
                ]}
              ></View>
              <View
                style={[
                  styles.listItem,
                  {
                    height: 85,
                    backgroundColor: "#333333",
                    opacity: 0.2,
                  },
                ]}
              ></View>
              <View
                style={[
                  styles.listItem,
                  {
                    height: 85,
                    backgroundColor: "#333333",
                    opacity: 0.1,
                  },
                ]}
              ></View>
            </>
          )}
          <View
            style={[styles.formHeaderContainer, { flexDirection: "column" }]}
          >
            <View style={{ flexDirection: "row" }}>
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
            <View>
              <Text style={[styles.label, { textAlign: "center" }]}>
                Description
              </Text>
              <TextInput
                style={[styles.input, { height: 40 }]}
                onChangeText={setDescription}
                value={description}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  headerAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
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
    padding: 10,
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
    marginRight: 10,
  },
  saveText: {
    height: 40,
    backgroundColor: "#ffbf00",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
