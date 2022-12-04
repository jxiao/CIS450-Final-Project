import React from 'react';
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
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
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
          <Option value="red">Red</Option>
          <Option value="green">Green</Option>
          <Option value="blue">Blue</Option>
        </Select>
      </Form.Item>

      <Form.Item 
        name="rating" 
        label="Average rating" 
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Slider
          range
          min={0}
          max={10}
          step={0.01}
          defaultValue={[0, 10]}
          marks={{
            0: '0',
            10: '10',
          }}
        />
      </Form.Item>

      <Form.Item
        name="min-raters"
        label="Minimum no. of raters"
        rules={[
          {
            required: true,
            message: 'Please pick an item',
          },
        ]}
      >
        <Radio.Group>
          <Radio.Button value="a">1</Radio.Button>
          <Radio.Button value="b">2</Radio.Button>
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