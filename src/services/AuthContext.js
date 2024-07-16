import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import {
  loginRestaurant,
  registerRestaurant,
  setToken,
  api_update_restaurant,
} from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      const restaurantString = await AsyncStorage.getItem("restaurant");
      if (restaurantString) {
        const restaurant = JSON.parse(restaurantString);
        setRestaurant(restaurant);
        setToken(restaurant.token);
      }
    };
    loadRestaurant();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginRestaurant({ username, password });
      const loggedInRestaurant = response.data.restaurant;
      console.log("logged in restaurant" + loggedInRestaurant);
      setRestaurant(loggedInRestaurant);
      setToken(loggedInRestaurant.token);
      await AsyncStorage.setItem(
        "restaurant",
        JSON.stringify(loggedInRestaurant)
      );
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await registerRestaurant({ username, password });
      const loggedInRestaurant = response.data.restaurant;
      setRestaurant(loggedInRestaurant);
      setToken(loggedInRestaurant.token);
      await AsyncStorage.setItem(
        "restaurant",
        JSON.stringify(loggedInRestaurant)
      );
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setRestaurant(null);
    setToken(null);
    await AsyncStorage.removeItem("restaurant");
  };

  const update_restaurant = async (restaurant) => {
    try {
      const response = await api_update_restaurant(restaurant);
      const loggedInRestaurant = response.data.restaurant;
      setRestaurant(loggedInRestaurant);
      setToken(loggedInRestaurant.token);
      await AsyncStorage.setItem(
        "restaurant",
        JSON.stringify(loggedInRestaurant)
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ restaurant, login, register, logout, update_restaurant }}
    >
      {children}
    </AuthContext.Provider>
  );
};
