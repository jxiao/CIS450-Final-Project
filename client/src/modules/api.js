import axios from "axios";

const rootURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `http://localhost:${process.env.REACT_APP_PORT || 5000}`
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

export const bestDirector = async () => {
  try {
    console.log("yep");
    const resp = await axios.get(`${rootURL}/directors/best`, { withCredentials: true });
    return { status: resp.status, data: resp.data };
  } catch (error) {
    console.log("ERROR");
    return { status: error.response.status, data: error.response.data };
  }
};

export const getBooks = async () => {
  try {
    const resp = await axios.get(`${rootURL}/books`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};

export const getMovies = async () => {
  try {
    const resp = await axios.get(`${rootURL}/movies`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};