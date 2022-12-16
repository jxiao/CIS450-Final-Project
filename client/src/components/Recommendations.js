/**
 * @file Recommendations.js
 * @description This file contains the Recommendations component.
 * This component is used to display the recommendations page.
 * It displays a form to select the type of recommendation, and a table to display the recommendations.
 * It also displays a modal to display the detailed view of a book or movie.
 */
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Radio,
  Select,
  Slider,
  Table,
  Modal,
  Typography,
  Spin,
} from "antd";
import {
  getAllRecommendations,
  getBookRecommendations,
  getMovieRecommendations,
} from "../modules/api";
import { Navbar, DetailedView } from "./index.js";

const { Option } = Select;

const columns = [
  {
    title: "Title",
    dataIndex: "Title",
    key: "Title",
    width: "10%",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Type",
    dataIndex: "Type",
    key: "Type",
    width: "10%",
    filters: [
      {
        text: "book",
        value: "book",
      },
      {
        text: "movie",
        value: "movie",
      },
    ],
    onFilter: (value, record) => record.Type.includes(value),
    filterSearch: true,
  },
];

function Recommendations() {
  const [data, setData] = useState(null);
  const [detailedViewItem, setDetailedViewItem] = useState(null);
  const [movieChecked, setMovieChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    let genresReformatted = `('${values.genres.join("','")}')`;
    setLoading(true);
    const fetchAllResults = async () => {
      try {
        const { status, data } = await getAllRecommendations({
          genres: genresReformatted,
          minRating: values.rating,
          minNumRaters: values.minRaters,
        });
        if (status === 200) {
          const newArr = data.results.map((item, i) => ({
            ...item,
            key: i,
          }));
          setData(newArr);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setData(null);
      }
    };
    const fetchBooks = async () => {
      try {
        const { status, data } = await getBookRecommendations({
          genres: genresReformatted,
          minRating: values.rating,
        });
        if (status === 200) {
          const newArr = data.results.map((item, i) => ({
            ...item,
            key: i,
          }));
          setData(newArr);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setData(null);
      }
    };
    const fetchMovies = async () => {
      try {
        const { status, data } = await getMovieRecommendations({
          genres: genresReformatted,
          minRating: values.rating,
          minNumRaters: values.minRaters,
        });
        if (status === 200) {
          const newArr = data.results.map((item, i) => ({
            ...item,
            key: i,
          }));
          setData(newArr);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setData(null);
      }
    };
    if (values.media.length === 2) {
      fetchAllResults();
    } else if (values.media[0] === "Books") {
      fetchBooks();
    } else {
      fetchMovies();
    }
  };

  const handleChangeMedia = (e) => {
    setMovieChecked(!movieChecked);
  };

  const resetForm = (e) => {
    setData(null);
    setLoading(false);
    setMovieChecked(false);
  };

  return (
    <div style={{ justifyContent: "center" }}>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginLeft: "auto",
          marginRight: "auto",
          width: 1000,
        }}
      >
        {data === null && (
          <Typography.Title
            style={{
              textAlign: "center",
              marginBottom: "50px",
              marginTop: "50px",
            }}
            level={2}
          >
            Fill out this form to see books and movies recommended for you!
          </Typography.Title>
        )}
        {data === null && (
          <Form
            name="validate_other"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              "input-number": 2,
              "checkbox-group": ["Books", "Movies"],
              rating: 0,
              minRaters: 0,
            }}
          >
            <Form.Item
              name="media"
              label={
                <p style={{ fontSize: "16px", margin: "auto" }}>
                  What kind of media do you like?
                </p>
              }
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Checkbox.Group>
                <Col span={14}>
                  <Checkbox
                    value="Books"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Books
                  </Checkbox>
                </Col>
                <Col span={14}>
                  <Checkbox
                    onChange={handleChangeMedia}
                    value="Movies"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Movies
                  </Checkbox>
                </Col>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              name="genres"
              label={
                <p style={{ fontSize: "16px", margin: "auto" }}>
                  What are your favorite genres?
                </p>
              }
              rules={[
                {
                  required: true,
                  message: "Please select your preferred genres",
                  type: "array",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Please select your preferred genres"
              >
                <Option value="history">History</Option>
                <Option value="adventure">Adventure</Option>
                <Option value="romance">Romance</Option>
                <Option value="horror">Horror</Option>
                <Option value="fiction">Fiction</Option>
                <Option value="comedey">Comedy</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="rating"
              label={
                <p style={{ fontSize: "16px", margin: "auto" }}>
                  Preferred Minimum Average Rating
                </p>
              }
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Slider
                min={0}
                max={10}
                step={0.01}
                marks={{
                  0: "0",
                  10: "10",
                }}
              />
            </Form.Item>

            {movieChecked && (
              <Form.Item
                name="minRaters"
                label={
                  <p style={{ fontSize: "16px", margin: "auto" }}>
                    What is the minimum no. of raters you prefer for a movie?
                  </p>
                }
                rules={[
                  {
                    required: true,
                    message: "Please pick an item",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio.Button value={0}>0</Radio.Button>
                  <Radio.Button value={1}>1</Radio.Button>
                  <Radio.Button value={2}>2</Radio.Button>
                </Radio.Group>
              </Form.Item>
            )}
            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 10,
              }}
            >
              <Button type="primary" htmlType="submit">
                Generate recommendations
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
      {loading && (
        <Spin style={{ marginTop: 50 }} tip="Loading" size="large">
          <div className="content" />
        </Spin>
      )}
      <div
        style={{
          marginTop: 50,
          marginLeft: 200,
          marginRight: 200,
          justifyContent: "center",
        }}
      >
        {data && <h2>Recommendation Results</h2>}
        {data && (
          <Table
            onRow={(record) => {
              return {
                onClick: () => {
                  setDetailedViewItem(record);
                }, // click row
              };
            }}
            columns={columns}
            dataSource={data}
          />
        )}
        {data && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={resetForm}
            style={{ marginLeft: "500px" }}
          >
            Try again
          </Button>
        )}
      </div>
      <Modal
        open={detailedViewItem !== null && detailedViewItem !== undefined}
        onOk={() => setDetailedViewItem(null)}
        onCancel={() => setDetailedViewItem(null)}
        footer={null}
        width={1000}
      >
        <DetailedView
          id={detailedViewItem && detailedViewItem.Id}
          isBook={
            detailedViewItem && detailedViewItem.Type.toLowerCase() === "book"
          }
        />
      </Modal>
    </div>
  );
}

export default Recommendations;
