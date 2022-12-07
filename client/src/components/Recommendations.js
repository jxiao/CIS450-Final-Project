import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Radio,
  InputNumber,
  Select,
  Slider,
} from 'antd';
import { getAllRecommendations, getBookRecommendations, getMovieRecommendations } from '../modules/api';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function Recommendations() {
  const [data, setData] = useState(null);
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    let genresReformatted = `('${values.genres.join("','")}')`;
    console.log("reformat" + genresReformatted);
    const fetchAllResults = async () => {
      const results = await getAllRecommendations({
        genres: genresReformatted, 
        minRating: values.rating,
        minNumRaters: values.minRaters
      });
      console.log("ran both query");
      console.log(results.data.results);
      setData(results.data.results);
    };
    const fetchBooks= async () => {
      const results = await getBookRecommendations({
        genres: genresReformatted, 
        minRating: values.rating,
      });
      console.log("ran book query");
      console.log(results.data.results);
      setData(results.data.results);
    };
    const fetchMovies= async () => {
      const results = await getMovieRecommendations({
        genres: genresReformatted, 
        minRating: values.rating,
        minNumRaters: values.minRaters
      });
      console.log("ran movie query");
      console.log(results.data.results);
      setData(results.data.results);
    };
    if (values.media.length === 2){
      fetchAllResults();
    } else if (values.media[0]==="Books") {
      fetchBooks();
    } else {
      fetchMovies();
    }
  };


  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        'input-number': 2,
        'checkbox-group': ['Books', 'Movies'],
        rate: 3.5,
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
                lineHeight: '32px',
              }}
            >
              Books
            </Checkbox>
          </Col>
          <Col span={14}>
            <Checkbox
              value="Movies"
              style={{
                lineHeight: '32px',
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
            message: 'Please select your preferred genres',
            type: 'array',
          },
        ]}
      >
        <Select mode="multiple" placeholder="Please select your preferred genres">
          <Option value="biography">Biography</Option>
          <Option value="fiction">Fiction</Option>
          <Option value="nonfiction">Nonfiction</Option>
          <Option value="action">Action</Option>
        </Select>
      </Form.Item>

      <Form.Item 
        name="rating" 
        label="Minimum Average Rating" 
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
            0: '0',
            10: '10',
          }}
        />
      </Form.Item>

      <Form.Item
        name="minRaters"
        label="Minimum no. of raters for the movies"
        rules={[
          {
            required: false,
            message: 'Please pick an item',
          },
        ]}
      >
        <Radio.Group>
          <Radio.Button value="0">0</Radio.Button>
          <Radio.Button value="1">1</Radio.Button>
          <Radio.Button value="2">2</Radio.Button>
        </Radio.Group>
      </Form.Item>

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
  );
};

export default Recommendations;