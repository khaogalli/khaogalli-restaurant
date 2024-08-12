import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Signin from "./src/screens/Signin";
import ChangePassword from "./src/screens/ChangePassword";
import ResHome from "./src/screens/ResHome";
import ResOrder from "./src/screens/ResOrder";
import SetMenu from "./src/screens/SetMenu";
import ResProfile from "./src/screens/ResProfile";
import Analysis from "./src/screens/Analysis";
import CustomAnalysis from "./src/screens/CustomAnalysis";
import Offers from "./src/screens/Offers";
import { AuthContext, AuthProvider } from "./src/services/AuthContext";

const Stack = createNativeStackNavigator();

const App = () => {
  const initialScreen = "Signin";

  const { restaurant } = useContext(AuthContext);
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
          name="Analysis"
          component={Analysis}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CustomAnalysis"
          component={CustomAnalysis}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Offers"
          component={Offers}
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
