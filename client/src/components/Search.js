import React, { useState, useEffect } from "react";
import { Input, Table, Modal, Typography, Spin } from "antd";
import { Navbar, DetailedView } from "./index.js";
import { getSearch } from "../modules/api";

function Search() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [detailedViewItem, setDetailedViewItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    setSearchText(e);
    setLoading(true);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { status, data } = await getSearch({
          search: searchText,
        });
        if (status === 200) {
          console.log("ran search");
          console.log(data);
          const newArr = data.results.map((item, i) => ({
            ...item,
            key: i,
          }));
          setData(newArr);
          console.log("newnArr" + newArr);
          setLoading(false);
        } 
      } catch (error) {
        setLoading(false);
      }
    };
    if (searchText !== "") {
      console.log("running");
      fetchResults();
    }
  }, [searchText]);

  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      width: "30%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
      width: "10%",
      filters: [
        {
          text: "Book",
          value: "Book",
        },
        {
          text: "Movie",
          value: "Movie",
        },
      ],
      onFilter: (value, record) => record.Type.includes(value),
      filterSearch: true,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: "10%",
      sorter: (a, b) => a.rating - b.rating,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Genres",
      dataIndex: "GenreList",
      key: "GenreList",
    },
  ];

  return (
    <div style={{justifyContent: "center"}}>
      <Navbar />
      <div style={{ display:"flex", flexDirection:"column", justifyContent: "space-between", marginLeft:"auto", marginRight: "auto", width: 600}}>
        <Typography.Title style={{ marginLeft:50}}>Search for Books and Movies!</Typography.Title>
        <Input.Search
        size = "large"
        placeholder="Type in a title, author, director, or actor, and press the button to search"
        onSearch={handleSearch}
        enterButton
        />
      </div>
      {loading && <Spin style={{marginTop: 50}} tip="Loading" size="large">
        <div className="content" />
      </Spin>}
      <div style={{ marginTop: 50, marginLeft: 50, marginRight: 50}}>
      {data && !loading && <Table
        onRow={(record) => {
          return {
            onClick: () => {
              setDetailedViewItem(record);
            }, // click row
          };
        }}
        columns={columns}
        dataSource={data}
      />}
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
          isBook={detailedViewItem && detailedViewItem.Type === "Book"}
        />
      </Modal>
      </div>
  );
}

export default Search;
