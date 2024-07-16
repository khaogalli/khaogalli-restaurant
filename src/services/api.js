import axios from "axios";

const API_URL = "http://172.20.10.6:8080";

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

export const api_update_restaurant = (user) => {
  return api.patch("/api/users", { user });
};

export const complete_order = (order_id) => {
  return api.post("/api/orders/complete/" + order_id);
};

export default api;
