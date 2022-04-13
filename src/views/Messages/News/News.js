import React, {useEffect, useState} from 'react';
import appStore from "../../../store/AppStore";
import {Link} from "react-router-dom";
import moment from "moment";
import {Table} from "antd";

const columns = [
  {
    title: 'Название',
    dataIndex: 'topicRu',
    key: 'topicRu',
    render: (text, row) => <Link to={"/message/" + row.id}>{text}</Link>,
  },
  {
    title: 'Опубликовано',
    dataIndex: 'datePublished',
    key: 'datePublished',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.public - b.public,
    render: data => moment(data).format('DD-MM-YYYY'),
  },
];

const News = () => {
  const [news, setNews] = useState([]);

  const fetchData = async () => {
    try {
      const res = await appStore.getNews();
      setNews(res);
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <p><b>Новости</b></p>
      <Table
        columns={columns}
        dataSource={news}
        rowKey="id"
      />
    </div>
  );
};

export default News;
