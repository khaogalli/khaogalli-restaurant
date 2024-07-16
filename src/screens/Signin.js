import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
} from "react-native";

import Api from "../ApiManager";
import { AuthContext } from "../services/AuthContext";

export default function Signin({ route, navigation }) {
  const [username, onChangeText] = React.useState("");
  const [password, onChangePass] = React.useState("");
  const error = "";

  const { login } = useContext(AuthContext);

  goToSignup = () => {
    navigation.navigate("Signup");
  };

  const verify = async () => {
    // if (!username.trim().match(/^[a-zA-Z0-9]+$/)) {
    //   error = "Username Invalid";
    //   Alert.alert("Username Invalid");
    //   return;
    // }

    // if (password.length < 8) {
    //   error = "Password should be at least 8 characters long";
    //   Alert.alert("Password should be at least 8 characters long.");
    //   return; gm
    // }

    try {
      await login(username, password);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.KAV}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <SafeAreaView style={styles.SAV}>
            <StatusBar backgroundColor="#ad8840" />

            <View style={[styles.center, styles.h1]}>
              <Image
                style={styles.logo}
                source={require("../../assets/download.jpeg")}
              />

              <Text style={styles.signinText}>Sign in</Text>
              <View style={styles.formContainer}>
                <View style={{ marginLeft: 15, marginTop: 20 }}>
                  <Text style={styles.lable}>Username</Text>
                  <TextInput
                    style={[styles.input, { height: 40, width: 270 }]}
                    onChangeText={onChangeText}
                    value={username}
                  />
                  <Text style={styles.lable}>Password</Text>
                  <TextInput
                    style={[styles.input, { height: 40, width: 270 }]}
                    onChangeText={onChangePass}
                    value={password}
                  />
                  <TouchableOpacity style={styles.button1} onPress={verify}>
                    <Text style={styles.continueText}>Continue</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ marginTop: 15 }}
                    onPress={goToSignup}
                  >
                    <Text style={styles.footerText}>
                      Not Signed up? Sign up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  KAV: {
    flex: 1,
    backgroundColor: "#f74449",
  },
  SAV: { flex: 1, justifyContent: "space-around" },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    paddingRight: 10,
  },
  continueText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  formContainer: [
    {
      backgroundColor: "#aa2e32",
      height: 355,
      width: 300,
      borderRadius: 20,
      marginTop: 10,
      borderWidth: 2,
    },
    { marginLeft: 15, marginTop: 20 },
  ],
  signinText: {
    fontSize: 36,
    color: "white",
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
  continueButton: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
});
