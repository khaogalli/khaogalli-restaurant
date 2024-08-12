class ApiManager {
  onAuthChange;
  UserInfo = {
    username: "",
    userID: "",
    tocken: "",
  };
  restaurantList = [];
  restaurantMenu = [];

  async login(username, password) {
    const user = {
      username: username,
      password: password,
    };
    const message = {
      user: user,
    };
    try {
      const response = fetch("http://192.168.140.201:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if ((await response.status) === 200) {
        data = await response.JSON();
        this.UserInfo.username = data.user.username;
        this.UserInfo.userID = data.user.userID;
        this.UserInfo.tocken = data.user.tocken;
        return (await response).status;
      } else if ((await response).status === 422){
        return (await response).status;
      }else if ((await response).status === 500){
        return (await response).status ;
      }else{
        return (await response).status;
      }
    } catch (error) {
      console.error("Error:", error);
    }
    this.onAuthChange(true);
  }

  async Signup(username, password) {
    const user = {
      username: username,
      password: password,
    };
    const message = {
      user: user,
    };
    try {
      const response = await fetch("http://192.168.140.201:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if ((response.status) === 200) {
        data = response.JSON();
        this.UserInfo.username = data.user.username;
        this.UserInfo.userID = data.user.userID;
        this.UserInfo.tocken = data.user.tocken;
        return (response).status;
      } else if ((response).status === 422){
        return ( response).status;
      }else if ((response).status === 500){
        return ( response).status ;
      }else{
        return (response).status;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  Home(username, regnum, tocken) {
    const message = {
      username: username,
      regnum: regnum,
      tocken: tocken,
    };
    try {
      const response = fetch("http://192.168.23.201:8080/signup", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      data = response.JSON();
      this.restaurantList = data.restaurants;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  RestaurantsDetail(restaurantID) {
    const message = {
      restaurantID: restaurantID,
    };
    try {
      const response = fetch("http://192.168.23.201:8080/restaurant", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      data = response.JSON();
      this.restaurantMenu = data.menu;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

Api = new ApiManager();
export default Api;
