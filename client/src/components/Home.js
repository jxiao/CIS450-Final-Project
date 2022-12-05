import React, { useState } from "react";
import { Modal } from "antd";
import DetailedView from "./DetailedView";

function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <div>
      <h1>Home</h1>
      <h2 onClick={() => setIsModalVisible(true)}>Detailed View?</h2>
      <Modal
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
      >
        {/* <DetailedView id="002914180X" isBook={true} /> */}
        <DetailedView id="862" isBook={false} />
      </Modal>
    </div>
  );
}

export default Home;
