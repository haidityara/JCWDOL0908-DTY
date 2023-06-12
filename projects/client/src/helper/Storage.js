const storage = {
  setToken: (token) => {
    localStorage.setItem("token", token);
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  removeToken: () => {
    localStorage.removeItem("token");
  },
};

export default storage;
