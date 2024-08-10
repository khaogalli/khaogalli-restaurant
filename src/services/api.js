import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const API_URL = "https://khaogalli.me";
export const RESTAURANT_IMAGE_URL = API_URL + "/api/restaurants/image/";
export const USER_IMAGE_URL = API_URL + "/api/users/image/";
export const ITEM_IMAGE_URL = API_URL + "/api/restaurants/menu/item/image/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export const setToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const loginRestaurant = (restaurant) => {
  return api.post("/api/restaurants/login", { restaurant });
};

export const registerRestaurant = (user) => {
  return api.post("/api/users", { user });
};

export const get_restaurants = () => {
  return api.get("/api/restaurants/list");
};

export const get_menu = (ResID) => {
  return api.get("/api/restaurants/menu/" + ResID);
};

export const place_order = (order) => {
  return api.post("/api/orders", { order });
};

export const get_orders = (days) => {
  return api.get("/api/orders/" + days);
};

export const api_update_restaurant = (restaurant) => {
  return api.patch("/api/restaurants", { restaurant });
};

export const complete_order = (order_id) => {
  return api.post("/api/orders/complete/" + order_id);
};

export const update_menu = (menu) => {
  return api.put("/api/restaurants/menu", { menu });
};

export const upload_restaurant_image = (image) => {
  return api.post("/api/restaurants/upload_image", { image });
};

export const add_item = (item) => {
  return api.post("/api/restaurants/menu/item", { item });
};

export const update_item = (item) => {
  return api.patch("/api/restaurants/menu/item", { item });
};

export const delete_item = (item_id) => {
  return api.delete("api/restaurants/menu/item/" + item_id);
};

export const stats = () => {
  return api.get("/api/stats/restaurant");
};

export const custom_stats = (start, end) => {
  return api.post("/api/stats/restaurant/custom/days", { start, end });
};

export const cancel_order = (orderID) => {
  return api.post("/api/orders/cancel/" + orderID);
};

export const post_noti = (notification) => {
  return api.post("/api/notification", notification);
};

export const get_noti = () => {
  return api.get("/api/notification/restaurant");
};

export const del_noti = (id) => {
  return api.delete("/api/notification/delete/" + id);
};

export default api;
