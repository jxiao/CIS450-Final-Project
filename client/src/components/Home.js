import React, { useState, useEffect } from 'react';
import { Carousel, Avatar, List } from 'antd';
import { bestDirector, getBooks, getMovies } from '../modules/api'

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
        background: "white"
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
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    },
    listItem: {
      display: 'flex',
      alignItems: 'center'
    }
}

const listData = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

function Home() {
  const [bestData, setBestData] = useState();
  const [bookData, setBookData] = useState();
  const [movieData, setMovieData] = useState();
  useEffect(() => {
    async function fetchData() {
      const {status, data} = await bestDirector();
      console.log(data);
      setBestData(data);
      const {status: bookStatus, data: bookData} = await getBooks();
      console.log(bookData);
      setBookData(bookData);
      const {status: movieStatus, data: movieData} = await getMovies();
      console.log(movieData);
      setMovieData(movieData);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Entertainment Engine</h1> 
      <Carousel autoplay>
        <div>
          <h3 style={styles.contentStyle}>A movie</h3>
        </div>
        <div>
          <h3 style={styles.contentStyle}>Another Movie</h3>
        </div>
        <div>
          <h3 style={styles.contentStyle}>A book</h3>
        </div>
        <div>
          <h3 style={styles.contentStyle}>Another book</h3>
        </div>
      </Carousel>
      <List
        itemLayout="horizontal"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item >
            <List.Item.Meta style={styles.listItem}
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default Home;
