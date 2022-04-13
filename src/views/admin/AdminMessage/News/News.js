import React, {useEffect, useState} from 'react';
import Button from "../../../../components/Button";
import {Form, Input, Modal, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ConfirmButton} from "../../../../components/ButtonConfirm";
import adminStore from "../../../../store/AdminStore";
import appStore from "../../../../store/AppStore";
import moment from "moment";
import {Link} from "react-router-dom";


const News = () => {
  const [modal, setModal] = useState(false);
  const [createState, setCreateState] = useState({
    topicRu: '',
    newsRu: ''
  });
  const [news, setNews] = useState([]);


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
    {
      title: '',
      key: 'id',
      dataIndex: 'id',
      width: 120,
      render: id => (
        <>
          <Button  size="small" title="Изменить" style={{marginRight:"10px"}}
          >
            <EditOutlined/>
          </Button>

          <ConfirmButton
            size="small"
            title="Удалить"
            onConfirm={e => deleteItem(id)}
            onCancel={e => e.stopPropagation()}
          >
            <DeleteOutlined />
          </ConfirmButton>
        </>)
    },
  ];

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
    fetchData().then(() => {
      adminStore.createLog({
        action: 'Перешел на Сообщения/Новости'
      });
    });

  }, []);

  const onFinish = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(createState).forEach(item => {
        data.append(item, createState[item]);
      });
      await adminStore.postNews(data);
      await fetchData();
      await adminStore.createLog({
        action: 'Создал новость'
      });
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    } finally {
      setModal(false);
      setCreateState({
        topicRu: '',
        newsRu: ''
      });
    }
  };


  const reset = () => {
    setModal(false);
    setCreateState({
      topicRu: '',
      newsRu: ''
    });
  };

  const deleteItem = async id => {
    try {
      await adminStore.deleteNews(id);
      await fetchData();
      await adminStore.createLog({
        action: 'Удалил новость'
      });
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };

  return (
    <div>
      <div className="adm-tab-title">
        <h3>Новости</h3>
        <Button onClick={() => setModal(true)}>Добавить</Button>
      </div>
      <Table
        columns={columns}
        dataSource={news}
      />

      <Modal
        title='Добавить'
        visible={modal}
        width={600}
        destroyOnClose
        onCancel={() => setModal(false)}
        maskClosable
        footer={false}
      >
        <Form onSubmit={onFinish}>

          <Form.Item
            name="title"
            label='Заголовок'
          >
            <Input
              value={createState.topicRu}
              onChange={e => setCreateState({...createState, topicRu: e.target.value})}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label='Описание'
          >
            <Input.TextArea
              rows={4}
              value={createState.newsRu}
              onChange={e => setCreateState({...createState, newsRu: e.target.value})}
            />
          </Form.Item>

          <Form.Item style={{marginTop: 30}}>
            <Button onClick={reset}>Отмена</Button>
            <Button type="primary" htmlType="submit">Добавить</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default News;
