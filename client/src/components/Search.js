import React, { useState, useEffect } from "react";
import { Input, Table } from 'antd';
import {getSearch} from '../modules/api';

function Search() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState(null);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };


  useEffect(() => {
    const fetchResults = async () => {
        const results = await getSearch({
        search: searchText,
        });
        console.log("ran search");
        const newArr = []
        for (let i = 0; i < results.data.results.length; i++) {
            newArr[i] = results.data.results[i] 
            newArr[i].key = i 
        }
        setData(newArr);
    };
     if (searchText !== "") {
        fetchResults();
     }
  }, [searchText]);


  const columns = [
    {
      title: 'Title',
      dataIndex: 'Title',
      key: 'Title',
      width: '30%',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
      width: '20%',
      filters: [
        {
          text: 'book',
          value: 'book',
        },
        {
          text: 'movie',
          value: 'movie',
        },
      ],
      onFilter: (value, record) => record.Type.includes(value),
      filterSearch: true,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: '20%',
      sorter: (a, b) => a.rating - b.rating,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Genres',
      dataIndex: 'GenreList',
      key: 'GenreList',
    },
  ];

  return (
    <div>
      <Input placeholder="Type in a title, author, director, or actor, and press enter to search" onPressEnter={handleSearch}/>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Search;


