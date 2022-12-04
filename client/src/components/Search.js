import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Space, Table } from 'antd';
import {getSearch} from '../modules/api';

import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
const dataExample = [
  {
    key: '1',
    title: 'John Brown',
    type: 'Book',
    rating: 32,
    genres: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    title: 'Joe Black',
    type: 'Book',
    rating: 42,
    genres: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    title: 'Jim Green',
    type: 'Movie',
    rating: 32,
    genres: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    title: 'Jim Red',
    type: 'Book',
    rating: 32,
    genres: 'London No. 2 Lake Park',
  },
];



function Search() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState(null);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };


//   const handleReset = (clearFilters) => {
//     setSearchText('');
//   };

  useEffect(() => {
    const fetchResults = async () => {
        const results = await getSearch({
        search: searchText,
        });
        console.log("hi");
    };
    fetchResults();
    // setData(results.data);
  }, [searchText]);

  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
  //     <div
  //       style={{
  //         padding: 8,
  //       }}
  //       onKeyDown={(e) => e.stopPropagation()}
  //     >
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{
  //           marginBottom: 8,
  //           display: 'block',
  //         }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Reset
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             confirm({
  //               closeDropdown: false,
  //             });
  //             setSearchText(selectedKeys[0]);
  //             setSearchedColumn(dataIndex);
  //           }}
  //         >
  //           Filter
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             close();
  //           }}
  //         >
  //           close
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <SearchOutlined
  //       style={{
  //         color: filtered ? '#1890ff' : undefined,
  //       }}
  //     />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  //   render: (text) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: '#ffc069',
  //           padding: 0,
  //         }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ''}
  //       />
  //     ) : (
  //       text
  //     ),
  // });
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
      filters: [
        {
          text: 'Book',
          value: 'Book',
        },
        {
          text: 'Movie',
          value: 'Movie',
        },
      ],
      onFilter: (value, record) => record.type.includes(value),
      filterSearch: true,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: '20%',
      sorter: (a, b) => a.age - b.age,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Genres',
      dataIndex: 'genres',
      key: 'genres',
    },
  ];

  return (
    <div>
      <Input placeholder="Basic usage" onChange={handleSearch}/>
      <Table columns={columns} dataSource={dataExample} />
    </div>
  );
}

export default Search;


