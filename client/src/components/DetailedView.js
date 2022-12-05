import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card } from "antd";
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
    isBook,
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

/*
import React from "react";
import { Modal } from "antd";
import DetailedView from "./DetailedView";

const [isModalVisible, setIsModalVisible] = useState(false);

<h2 onClick={() => setIsModalVisible(true)}>Detailed View?</h2>
<Modal
  open={isModalVisible}
  onOk={() => setIsModalVisible(false)}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  width={1000}
>
  <DetailedView id="002914180X" isBook={true} />
  <DetailedView id="862" isBook={false} />
</Modal>
*/

function DetailedView({ id, isBook }) {
  const [data, setData] = useState(null);
  const [similarData, setSimilarData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
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
        console.log(error);
        setIsLoading(false);
      }
    };
    const fetchSimilarData = async () => {
      try {
        const { status, data } = await (isBook
          ? getSimilarByBookId(id)
          : getSimilarByMovieId(id));
        if (status === 200) {
          // TODO : determine similarity result schema
          setSimilarData(data.map((item) => translate(item, isBook)));
        }
      } catch (error) {
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
              <b>Actors:</b> {data.actors}
              <br />
              <b>Directors:</b> {data.directors}
            </>
          )}
        </Column>
      </Container>
      <h3>Similar Books and Movies</h3>
      {similarData && similarData.length > 0 ? (
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
                      item.isBook
                        ? item.ImageURL
                        : "https://www.clipartmax.com/png/middle/1-15852_exp-movie-icon.png"
                    }
                  />
                }
              >
                <Meta
                  Title={item.Title}
                  Description={item.isBook ? "Book" : "Movie"}
                />
              </Card>
            </div>
          ))}
        </Carousel>
      ) : (
        <div>No similar books or movies found.</div>
      )}
    </div>
  );
}

export default DetailedView;
