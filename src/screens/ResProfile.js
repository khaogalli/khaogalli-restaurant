import { React, useCallback, useContext, useEffect, useState } from "react";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../services/AuthContext";
import { get_orders, RESTAURANT_IMAGE_URL } from "../services/api";
import { genNonce } from "../services/utils";
import { useFocusEffect } from "@react-navigation/native";
import { Image as ExpoImage } from "expo-image";

const ProfilePage = ({ route, navigation }) => {
  const { restaurant } = useContext(AuthContext);
  const username = restaurant.username;
  const userID = restaurant.id;

  const { logout } = useContext(AuthContext);

  goToChnagePassword = () => {
    navigation.navigate("ChangePassword", { username });
  };

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let res = await get_orders(100);

      console.log(res.data[0].items);
      setHistory(res.data);
    };
    getData();
  }, []);

  const icon_path = Image.resolveAssetSource(
    // get from api
    require("../../assets/download.jpeg")
  ).uri;

  const html = `
    <html>
      <body>
      <div style="diplay: flex">
        <div style="display: inline-block;">
        <img src="${icon_path}" style="display: inline-block; margin-left: auto; margin-right: auto; width: 100; height: 100; radius: 50px"/>
        </div>
      </div>
        <h1 style="text-align:center">Order Statement</h1>
        <p style="text-align:center; font-size:28" >${username}</p>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr  style="background-color: #ffbf00; text-align: center;">    
              <th style="padding: 8px;">Order ID</th>
              <th style="padding: 8px;">User</th>
              <th style="padding: 8px;">Date</th>
              <th style="padding: 8px;">Items</th>
            </tr>
          </thead>
          <tbody>
            ${history
              .map(
                (order) => `
                  <tr style="text-align:center">
                    <td>${order.id}</td>
                    <td>${order.user_name}</td>
                    <td>${order.created_at.substring(
                      0,
                      10
                    )}<br>${order.created_at.substring(11, 19)}</td>
                    <td>
                      <ul style="list-style-type: none">
                        ${order.items
                          .map(
                            (item) => `
                              <li>${item.name} | ${item.quantity} | ${item.price}</li>
                            `
                          )
                          .join("")}
                      </ul>
                    </td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };

  const handleLogout = async () => {
    console.log("Logout");
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGeneratePDF = () => {
    generatePdf();
    console.log("PDF generated");
  };

  const editmenu = () => {
    console.log("SetMenu");
    navigation.navigate("SetMenu", { username });
  };

  const [nonce, setNonce] = useState(genNonce());

  const resetNonce = () => {
    setNonce(genNonce());
  };
  useFocusEffect(useCallback(resetNonce, []));
  const [photo, setPhoto] = useState(RESTAURANT_IMAGE_URL + restaurant.id);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToChnagePassword}>
        <ExpoImage
          source={{ uri: photo + "?" + nonce }}
          placeholder={require("../../assets/user.png")}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <Text style={styles.userName}>{username}</Text>
      <Text style={styles.regNumber}>{userID}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={editmenu}>
          <View style={styles.buttonText}>
            <Text style={styles.name}>Edit Menu</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleGeneratePDF}>
          <View style={styles.buttonText}>
            <Text style={styles.name}>Download History</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.signouttButtonText}>
            <Text style={styles.name}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signouttButtonText: {
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 0.5,
    padding: 5,
    borderRadius: 5,
    width: 230,
    alignItems: "center",
    backgroundColor: "#ff3c3c",
  },
  buttonText: {
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 0.5,
    padding: 5,
    borderRadius: 5,
    width: 230,
    alignItems: "center",
  },
  userName: { fontWeight: "900", fontSize: 26 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "black",
    borderWidth: 2,
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
  },
  regNumber: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 10,
  },
});

export default ProfilePage;
