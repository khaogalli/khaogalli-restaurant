import React, { useContext, useState } from "react";
import Api from "./src/ApiManager";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//pages common to both
import Signin from "./src/screens/Signin";
import Signup from "./src/screens/Signup";
import ChangePassword from "./src/screens/ChangePassword";
//pages for restaurant
import ResHome from "./src/screens/ResHome";
import ResOrder from "./src/screens/ResOrder";
import SetMenu from "./src/screens/SetMenu";
import ResProfile from "./src/screens/ResProfile";
import { AuthContext, AuthProvider } from "./src/services/AuthContext";

const Stack = createNativeStackNavigator();

const App = () => {
  const initialScreen = "Signup";

  const { restaurant } = useContext(AuthContext);
  console.log("test " + restaurant);
  return restaurant ? (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          cardStyleInterpolator: ({ current, layouts }) => {
            const { index } = current;
            const inputRange = [index - 1, index, index + 1];
            const translateX = current.progress.interpolate({
              inputRange,
              outputRange: [layouts.screen.width, 0, -layouts.screen.width],
            });

            return {
              cardStyle: {
                transform: [{ translateX }],
              },
            };
          },
          transitionSpec: {
            open: { animation: "timing", config: { duration: 1200 } },
            close: { animation: "timing", config: { duration: 1200 } },
          },
        }}
      >
        <Stack.Screen
          name="ResHome"
          component={ResHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResOrder"
          component={ResOrder}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SetMenu"
          component={SetMenu}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResProfile"
          component={ResProfile}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          cardStyleInterpolator: ({ current, layouts }) => {
            const { index } = current;
            const inputRange = [index - 1, index, index + 1];
            const translateX = current.progress.interpolate({
              inputRange,
              outputRange: [layouts.screen.width, 0, -layouts.screen.width],
            });

            return {
              cardStyle: {
                transform: [{ translateX }],
              },
            };
          },
          transitionSpec: {
            open: { animation: "timing", config: { duration: 1200 } },
            close: { animation: "timing", config: { duration: 1200 } },
          },
        }}
      >
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
