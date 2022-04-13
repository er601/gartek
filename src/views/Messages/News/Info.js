import React, {useEffect, useState} from 'react';
import {Card, Divider} from "antd";
import appStore from "../../../store/AppStore";

const Info = props => {
  const [info, setInfo] = useState({
    topicRu: '',
    newsRu: '',
    datePublished: '',
    id: ''
  });

  const fetchData = async () => {
    try {
      const res = await appStore.getNewsById(props.match.params.id);
      setInfo(res);
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  }
  useEffect(() => {
    fetchData();
  }, [props.match.params.id]);

  return (
    <Card>
      <h3 style={{textAlign: 'center'}}>{info?.topicRu || 'Извините новость не загрузилась'}</h3>
      <Divider />
      <p>{info?.newsRu}</p>
    </Card>
  );
};

export default Info;
