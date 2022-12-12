import React, { useState, useEffect } from "react";
import { Input, Table, Modal } from "antd";
import { Navbar, DetailedView } from "./index.js";
import { getSearch } from "../modules/api";

function Search() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [detailedViewItem, setDetailedViewItem] = useState(null);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchResults = async () => {
      const results = await getSearch({
        search: searchText,
      });
      const newArr = results.data.results.map((item, i) => ({
        ...item,
        key: i,
      }));
      setData(newArr);
    };
    if (searchText !== "") {
      fetchResults();
    }
  }, [searchText]);

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
      width: "20%",
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
    <div>
      <Navbar />
      <Input
        placeholder="Type in a title, author, director, or actor, and press enter to search"
        onPressEnter={handleSearch}
      />
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
          isBook={
            detailedViewItem && detailedViewItem.Type.toLowerCase() === "book"
          }
        />
      </Modal>
    </div>
  );
}

export default Search;
