import React, { useState, useEffect } from "react";
import { List, Card, Modal, Typography, Spin } from "antd";
import Carousel from "react-multi-carousel";
import {
  bestDirector,
  getAuthorsBest,
  getBooks,
  getMovies,
} from "../modules/api";
import { Navbar, DetailedView } from "./index.js";
import { translate as translateData } from "../modules/utility.js";

const styles = {
  box: {
    width: "35%",
    margin: "auto",
    boxShadow: "2px 2px 10px rgba(0,0,0,.2)",
    padding: "45px 20px",
    borderRadius: "15px",
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -30%)",
    zIndex: "2",
    background: "white",
  },
  flex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "auto",
  },
  input: {
    borderColor: "grey",
  },
  contentStyle: {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
  },
};

const { Meta } = Card;

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

function Home() {
  const [bestData, setBestData] = useState([]);
  const [carouselData, setCarouselData] = useState([]);
  const [detailedViewItem, setDetailedViewItem] = useState(null);
  const [authorsBestData, setAuthorsBestData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function interleaveArrays(arr1, arr2) {
      const result = [];
      for (let i = 0; i < arr1.length; i++) {
        result.push(arr1[i]);
        result.push(arr2[i]);
      }
      return result;
    }
    async function fetchBestDirector() {
      const { data } = await bestDirector({
        numRaters: 1,
        numMovies: 1,
      });
      setBestData(data.directors);
    }
    async function fetchBestAuthor() {
      setLoading(true);
      const { data } = await getAuthorsBest();
      setAuthorsBestData(data.results);
      setLoading(false);
    }
    async function fetchBooksAndMovies() {
      const NUM_ITEMS = 10;
      const MULTIPLIER = 5;
      const { data: bookData } = await getBooks({
        numResults: MULTIPLIER * NUM_ITEMS,
      });
      const { data: movieData } = await getMovies({
        numResults: MULTIPLIER * NUM_ITEMS,
      });
      setCarouselData(
        interleaveArrays(
          bookData.books
            .sort(() => 0.5 - Math.random())
            .slice(0, NUM_ITEMS)
            .map((item) => translateData(item, true)),
          movieData.movies
            .sort(() => 0.5 - Math.random())
            .slice(0, NUM_ITEMS)
            .map((item) => translateData(item, false))
        )
      );
    }
    fetchBestDirector();
    fetchBooksAndMovies();
    setTimeout(() => {
      fetchBestAuthor();
    }, 500);
  }, []);

  return (
    <div>
      <Navbar />
      <Typography.Title style={{ textAlign: "center" }}>
        Discover new books and movies today!
      </Typography.Title>
      <div style={{ marginLeft: 20, marginTop: 50 }}>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          responsive={responsive}
        >
          {carouselData.map((item) => (
            <div key={item.id}>
              <Card
                hoverable
                onClick={() => {
                  setDetailedViewItem(item);
                }}
                style={{ width: 240, height: 350 }}
                cover={
                  <img
                    alt={item.Title}
                    style={{ height: 250 }}
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
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 1, padding: "0.5rem" }}>
          <Typography.Title
            level={2}
            style={{ marginTop: 50, textAlign: "center" }}
          >
            Featured Directors
          </Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={bestData}
            renderItem={(item) => (
              <List.Item
                onClick={() => {
                  setDetailedViewItem(item);
                }}
              >
                <List.Item.Meta
                  style={styles.listItem}
                  // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={
                    <Typography.Link style={{ color: "rgb(5, 99, 193)" }}>
                      {" "}
                      {item.title}
                    </Typography.Link>
                  }
                  description={<div>{item.name}</div>}
                />
              </List.Item>
            )}
          />
        </div>
        <div style={{ flex: 1, padding: "0.5rem" }}>
          <Typography.Title
            level={2}
            style={{ marginTop: 50, textAlign: "center" }}
          >
            Featured Authors
          </Typography.Title>
          {loading && (
            <Spin style={{ marginTop: 50 }} tip="Loading" size="large">
              <div className="content" />
            </Spin>
          )}
          {!loading && (
            <List
              style={{ flex: 1, padding: "0.5rem" }}
              itemLayout="horizontal"
              dataSource={authorsBestData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    style={styles.listItem}
                    // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.title}
                    description={<div>{item.author}</div>}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
      <Modal
        open={detailedViewItem !== null && detailedViewItem !== undefined}
        onOk={() => setDetailedViewItem(null)}
        onCancel={() => setDetailedViewItem(null)}
        footer={null}
        width={1000}
      >
        <DetailedView
          id={
            detailedViewItem &&
            (detailedViewItem.movie_id || detailedViewItem.id)
          }
          isBook={
            detailedViewItem &&
            detailedViewItem.type &&
            detailedViewItem.type.toLowerCase() === "book"
          }
        />
      </Modal>
    </div>
  );
}

export default Home;
