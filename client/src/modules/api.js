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
export const bestDirector = async ({ numRaters, numMovies }) => {
  try {
    const resp = await axios.get(
      `${rootURL}/directors/best?numRaters=${numRaters || 1}&numMovies=${
        numMovies || 1
      }`,
      {
        withCredentials: true,
      }
    );
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};

export const getSearch = async (search) => {
  try {
    const resp = await axios.get(`${rootURL}/search`, {
      params: search,
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

export const getBooks = async ({ genres, author, minRating, numResults }) => {
  try {
    const query = `numResults=${numResults || 10}${
      genres ? `&genres=${genres}` : ""
    }${author ? `&author=${author}` : ""}${
      minRating !== undefined && minRating !== null
        ? `&minRating=${minRating}`
        : ""
    }`;
    const resp = await axios.get(`${rootURL}/books?${query}`);
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

export const getMovies = async ({
  genres,
  director,
  minRating,
  numResults,
}) => {
  try {
    const query = `numResults=${numResults || 10}${
      genres ? `&genres=${genres}` : ""
    }${director ? `&director=${director}` : ""}${
      minRating !== undefined && minRating !== null
        ? `&minRating=${minRating}`
        : ""
    }`;
    const resp = await axios.get(`${rootURL}/movies?${query}`);
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

export const getAllRecommendations = async (fields) => {
  try {
    const resp = await axios.get(`${rootURL}/allrecommendations`, {
      params: fields,
    });
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};

export const getMovieRecommendations = async (fields) => {
  try {
    const resp = await axios.get(`${rootURL}/movierecommendation`, {
      params: fields,
    });
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};
export const getBookRecommendations = async (fields) => {
  try {
    const resp = await axios.get(`${rootURL}/bookrecommendation`, {
      params: fields,
    });
    return { status: resp.status, data: resp.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};
