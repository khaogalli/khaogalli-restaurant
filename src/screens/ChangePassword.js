import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../services/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Image as ExpoImage } from "expo-image";

import { RESTAURANT_IMAGE_URL, upload_restaurant_image } from "../services/api";
import { genNonce } from "../services/utils";
import { useFocusEffect } from "@react-navigation/native";

const ProfilePage = ({ route, navigation }) => {
  const { update_restaurant, restaurant } = useContext(AuthContext);
  let username = restaurant.username;

  const [userName, setUserName] = useState(username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const doSomething = async () => {
    let user = {};
    let changed = false;
    if (userName != username) {
      changed = true;
      user.username = userName;
    }
    if (password != "" && NewPassword == confirmPassword) {
      user.update_pass = {
        old_password: password,
        new_password: confirmPassword,
      };
      changed = true;
    }

    if (!changed) {
      navigation.navigate("ResProfile");
      return;
    }

    try {
      await update_restaurant(user);
      navigation.navigate("ResProfile");
    } catch (error) {
      console.log(error);
    }
  };

  const [nonce, setNonce] = useState(genNonce());

  const resetNonce = () => {
    setNonce(genNonce());
  };

  const [photo, setPhoto] = useState(RESTAURANT_IMAGE_URL + restaurant.id);

  useFocusEffect(useCallback(resetNonce, []));

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {

      try {
        const base64 = await FileSystem.readAsStringAsync(
          result.assets[0].uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        const res = await upload_restaurant_image(base64);
        resetNonce();
      } catch (error) {
        console.error("Error reading file or uploading image:", error);
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ad8840" />
        <TouchableOpacity
          onPress={() => {
            pickImage();
          }}
        >
          <ExpoImage
            source={{ uri: photo + "?" + nonce }}
            placeholder={require("../../assets/user.png")}
            priority="high"
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.lable}>Username</Text>
        <TextInput
          style={[styles.input, { height: 40, width: 270 }]}
          onChangeText={setUserName}
          value={userName}
        />

        <Text style={styles.lable}>Password</Text>
        <TextInput
          style={[styles.input]}
          onChangeText={(text) => {
            setPassword(text); 
          }}
          value={password}
        />

        {password != "" ? (
          <View>
            <Text style={[styles.lable, { textAlign: "center" }]}>
              New Password
            </Text>
            <TextInput
              style={[styles.input]}
              onChangeText={setNewPassword}
              value={NewPassword}
            />

            <Text style={[styles.lable, { textAlign: "center" }]}>
              Confirm Password
            </Text>
            <TextInput
              style={[styles.input]}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            doSomething();
          }}
        >
          <Text style={styles.changePasswordText}>Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  changePasswordText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
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
  input: {
    borderBottomWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    height: 40,
    width: 270,
  },
  lable: {
    fontSize: 18,
    color: "black",
    marginBottom: 5,
  },
  button1: {
    width: 270,
    height: 40,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#ffbf00",
    marginTop: 12,
    justifyContent: "center",
  },
});

export default ProfilePage;
