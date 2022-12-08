import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Radio,
  InputNumber,
  Select,
  Slider,
  Table,
  Modal,
} from "antd";
import {
  getAllRecommendations,
  getBookRecommendations,
  getMovieRecommendations,
} from "../modules/api";
import { Navbar, DetailedView } from "./index.js";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const columns = [
  {
    title: "Title",
    dataIndex: "Title",
    key: "Title",
    width: "30%",
  },
  {
    title: "Type",
    dataIndex: "Type",
    key: "Type",
    width: "20%",
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
  // {
  //   title: "Rating",
  //   dataIndex: "rating",
  //   key: "rating",
  //   width: "20%",
  //   sorter: (a, b) => a.rating - b.rating,
  //   sortDirections: ["descend", "ascend"],
  // },
  // {
  //   title: "Genres",
  //   dataIndex: "GenreList",
  //   key: "GenreList",
  // },
];

function Recommendations() {
  const [data, setData] = useState(null);
  const [detailedViewItem, setDetailedViewItem] = useState(null);
  const [movieChecked, setMovieChecked] = useState(false);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    let genresReformatted = `('${values.genres.join("','")}')`;
    console.log("reformat" + genresReformatted);
    const fetchAllResults = async () => {
      const results = await getAllRecommendations({
        genres: genresReformatted,
        minRating: values.rating,
        minNumRaters: values.minRaters,
      });
      console.log("ran both query");
      console.log(results.data.results);
      const newArr = results.data.results.map((item, i) => ({
        ...item,
        key: i,
      }));
      setData(newArr);
    };
    const fetchBooks = async () => {
      const results = await getBookRecommendations({
        genres: genresReformatted,
        minRating: values.rating,
      });
      console.log("ran book query");
      console.log(results.data.results);
      const newArr = results.data.results.map((item, i) => ({
        ...item,
        key: i,
      }));
      setData(newArr);
    };
    const fetchMovies = async () => {
      const results = await getMovieRecommendations({
        genres: genresReformatted,
        minRating: values.rating,
        minNumRaters: values.minRaters,
      });
      console.log("ran movie query");
      console.log(results.data.results);
      const newArr = results.data.results.map((item, i) => ({
        ...item,
        key: i,
      }));
      setData(newArr);
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
    console.log(!movieChecked)
    setMovieChecked(!movieChecked);
  };

  return (
    <div>
      <Navbar />
      <h2>Recommendation Form</h2>
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          "input-number": 2,
          "checkbox-group": ["Books", "Movies"],
          rating: 0,
          minRaters: "0",
        }}
      >
        <Form.Item
          name="media"
          label="Media type"
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
          label="Genres"
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
            <Option value="biography">Biography</Option>
            <Option value="fiction">Fiction</Option>
            <Option value="nonfiction">Nonfiction</Option>
            <Option value="action">Action</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="rating"
          label="Minimum Average Rating"
          // rules={[
          //   {
          //     required: true,
          //   },
          // ]}
        >
          <Slider
            // defaultValue={0}
            min={0}
            max={10}
            step={0.01}
            marks={{
              0: "0",
              10: "10",
            }}
          />
        </Form.Item>

        {movieChecked && <Form.Item
          name="minRaters"
          label="Minimum no. of raters for the movies"
          rules={[
            {
              required: true,
              message: "Please pick an item",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="0">0</Radio.Button>
            <Radio.Button value="1">1</Radio.Button>
            <Radio.Button value="2">2</Radio.Button>
          </Radio.Group>
        </Form.Item>
        }

        {/* <Form.Item label="InputNumber">
        <Form.Item name="input-number" noStyle>
          <InputNumber min={1} max={10} />
        </Form.Item>
        <span
          className="ant-form-text"
          style={{
            marginLeft: 8,
          }}
        >
          machines
        </span>
      </Form.Item> */}

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            Generate recommendations
          </Button>
        </Form.Item>
      </Form>
      <h2>Recommendation Results</h2>
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
      <Modal
        open={detailedViewItem !== null && detailedViewItem !== undefined}
        onOk={() => setDetailedViewItem(null)}
        onCancel={() => setDetailedViewItem(null)}
        footer={null}
        width={1000}
      >
        <DetailedView
          id={detailedViewItem && detailedViewItem.Id}
          isBook={detailedViewItem && detailedViewItem.Type === "book"}
        />
      </Modal>
    </div>
  );
}

export default Recommendations;
