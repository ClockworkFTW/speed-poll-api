const axios = require("axios");

const BASE_URL = "http://ip-api.com/json";

exports.getLocation = async (ip) => {
  try {
    const res = await axios.get(`${BASE_URL}/${ip}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
