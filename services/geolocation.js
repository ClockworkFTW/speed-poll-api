const axios = require("axios");

const BASE_URL = "http://ip-api.com/json";

exports.getLocation = async (ip) => {
  try {
    const res = await axios.get(`${BASE_URL}/${ip}`);

    if (res.data.status === "success") {
      return res.data;
    } else {
      throw "geolocation error";
    }
  } catch (error) {
    throw error;
  }
};
