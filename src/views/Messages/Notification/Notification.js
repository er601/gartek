import React, {useEffect, useState} from 'react'
import appStore from "../../../store/AppStore";
import {Modal, Table} from "antd";


const Notification = () => {
  const [note, setNote] = useState([])
  const [info, setInfo] = useState(null);

  const fetchData = async () => {
    try{
      const res = await appStore.getNotification()
      setNote(res)
    }catch (e) {
      console.log(e)
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Сообщение',
      dataIndex: 'message',
      key: 'message',
      render: (text, row) => <span
        style={{color: 'blue', cursor: 'pointer'}}
        onClick={() => setInfo(row)}
      >
        {text}
      </span>,
    },
    {
      title: 'Опубликовано',
      dataIndex: 'createdDate',
      key: 'createdDate',
      defaultSortOrder: 'descend',
    },
  ];


  return(
    <div>
      <div className="adm-tab-title">
        <h3>Уведомление Администрации</h3>
      </div>
      <Table
        columns={columns}
        dataSource={note}
      />
      <Modal
        title={info?.title}
        visible={!!info}
        width={600}
        destroyOnClose
        onCancel={() => setInfo(null)}
        maskClosable
        footer={false}
      >
        <div className="text-center">
          {info?.message}
        </div>
      </Modal>
    </div>
  )
}

export default Notification;
