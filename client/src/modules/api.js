import axios from "axios";

const rootURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `http://localhost:${process.env.REACT_APP_PORT || 8080}`
    : "";

export const getBookById = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/book/${id}`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};
export const bestDirector = async () => {
  try {
    const resp = await axios.get(`${rootURL}/directors/best`, {
      withCredentials: true,
    });
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};

export const getMovieById = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/movie/${id}`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
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

export const getSimilarByBookId = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/book/${id}/similar`);
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

export const getSimilarByMovieId = async (id) => {
  try {
    const resp = await axios.get(`${rootURL}/movie/${id}/similar`);
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};
