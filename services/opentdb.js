const axios = require("axios");

const BASE_URL = "https://opentdb.com/api.php";

exports.getQuestions = async (amount) => {
  try {
    const res = await axios.get(`${BASE_URL}?amount=${amount}&type=multiple`);

    if (res.data.response_code === 0) {
      return res.data.results;
    } else {
      throw "opentdb error";
    }
  } catch (error) {
    throw error;
  }
};
