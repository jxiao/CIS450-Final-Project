import axios from "axios";

const rootURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `http://localhost:${process.env.REACT_APP_PORT || 8080}`
    : "";

// TODO: add api calls, below is a sample POST request
/*
export const postLogin = async (username, password) => {
  try {
    const resp = await axios.post(`${rootURL}/login`, {
      username,
      password,
    });
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};
*/

export const getBookById = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/book/${id}`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    console.log(error);
    return { status: error.response.status, data: error.response.data };
  }
};

export const getMovieById = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/movie/${id}`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    console.log(error);
    return { status: error.response.status, data: error.response.data };
  }
};

export const getSimilarByBookId = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/book/${id}/similar`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    console.log(error);
    return { status: error.response.status, data: error.response.data };
  }
};

export const getSimilarByMovieId = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/movie/${id}/similar`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    console.log(error);
    return { status: error.response.status, data: error.response.data };
  }
};
