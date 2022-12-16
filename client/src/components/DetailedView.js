/**
 * @file DetailedView.js
 * @description This file contains the DetailedView component.
 * This component is used to display the detailed view of a book or movie.
 * It also displays similar books and movies.
 */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Spin } from "antd";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  getBookById,
  getMovieById,
  getSimilarByBookId,
  getSimilarByMovieId,
} from "../modules/api";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: inline;
  flex: ${(props) => props.flex || 1};
  flex-direction: column;
  padding: 10px;
`;

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};
const { Meta } = Card;
const LEFT_COLUMN_RATIO = 30;
const translate = (item, isBook) => {
  const obj = {
    type: item.Type || (isBook ? "Book" : "Movie"),
    id: isBook ? item.ISBN : item.movieId,
    Title: item.Title,
    Rating: item.Rating,
    genre: item.genre,
  };
  if (isBook) {
    obj.authors = item.authors;
    obj.ImageURL = item.ImageURL;
    obj.Description = item.Description;
    obj.NumPages = item.NumPages;
    obj.GoodreadsLink = item.GoodreadsLink;
  } else {
    obj.actors = item.actors;
    obj.directors = item.directors;
    obj.Description = item.Overview;
  }
  return obj;
};

function DetailedView({ id, isBook }) {
  const [data, setData] = useState(null);
  const [similarData, setSimilarData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  useEffect(() => {
    /**
     * Fetches detailed information for a specific book or movie
     */
    const fetchData = async () => {
      try {
        const { status, data } = await (isBook
          ? getBookById(id)
          : getMovieById(id));
        if (status === 200) {
          setData(translate(data, isBook));
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    /**
     * Fetches similar books and movies
     */
    const fetchSimilarData = async () => {
      try {
        setSimilarLoading(true);
        const { status, data } = await (isBook
          ? getSimilarByBookId(id)
          : getSimilarByMovieId(id));
        if (status === 200) {
          const res = isBook ? data.books : data.movies;
          setSimilarData(
            res.map((item) => translate(item, item.Type === "Book"))
          );
        }
        setSimilarLoading(false);
      } catch (error) {
        setSimilarLoading(false);
        console.log(error);
      }
    };
    fetchData();
    fetchSimilarData();
  }, [id, isBook]);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{data.Title}</h1>
      <Container>
        <Column flex={`${LEFT_COLUMN_RATIO}%`}>
          <img
            alt={`${data.Title}`}
            src={data.ImageURL}
            style={{ width: "100%" }}
          />
        </Column>
        <Column flex={`${100 - LEFT_COLUMN_RATIO}%`}>
          <b>{isBook ? "ISBN" : "Movie ID"}:</b> {data.id}
          <br />
          <b>Rating:</b> {data.Rating}
          <br />
          <b>Genres:</b> {data.genre}
          <br />
          <b>Description:</b> {data.Description}
          <br />
          {isBook ? (
            <>
              <b>Authors:</b> {data.authors}
              <br />
              <b>Number of Pages:</b> {data.NumPages}
              <br />
              <b>
                <a href={data.GoodreadsLink}>Goodreads Link</a>
              </b>
              <br />
            </>
          ) : (
            <>
              <b>Actors:</b> {data.actors || "N/A"}
              <br />
              <b>Directors:</b> {data.directors || "N/A"}
            </>
          )}
        </Column>
      </Container>
      <h3>Similar Books and Movies</h3>
      {similarLoading && (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      )}
      {!similarLoading &&
        (similarData && similarData.length > 0 ? (
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            responsive={responsive}
          >
            {similarData.map((item) => (
              <div key={item.id}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt={item.Title}
                      src={
                        item.type === "Book"
                          ? item.ImageURL
                          : "https://www.clipartmax.com/png/middle/1-15852_exp-movie-icon.png"
                      }
                    />
                  }
                >
                  <Meta title={item.Title} description={item.type} />
                </Card>
              </div>
            ))}
          </Carousel>
        ) : (
          <div>No similar books or movies found.</div>
        ))}
    </div>
  );
}

export default DetailedView;
