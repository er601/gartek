import React, {useEffect, useState} from 'react'
import Button from "../../../../components/Button";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ConfirmButton} from "../../../../components/ButtonConfirm";
import appStore from "../../../../store/AppStore";
import adminStore from "../../../../store/AdminStore";
import {Form, Input, Modal, Table} from "antd";



const AdminNotification=() => {

  const [note,setNote] = useState([])
  const [editTitle, setEditTitle] = useState(null);
  const [modal, setModal] = useState(false);
  const [createState, setCreateState] = useState({
    title: '',
    message:''
  });
  const [info, setInfo] = useState(null);


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
    {
      title: '',
      key: 'id',
      dataIndex: 'id',
      width: 120,
      render: id => (
        <>
          <Button  size="small" title="Изменить" style={{marginRight:"20px"}}
                   onClick={() => editItem(id)} >
            <EditOutlined/>
          </Button>
          <ConfirmButton
            size="small"
            title="Удалить"
            onConfirm={ e => deleteItem(id)}
            onCancel={e => e.stopPropagation()}
          >
            <DeleteOutlined />
          </ConfirmButton>
        </>
      )
    },
  ];

  const fetchData = async () => {
    try {
      const res = await appStore.getNotification()
      setNote(res)
    } catch (e) {
      console.log(e)
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };


  useEffect(() => {
    fetchData().then(() => {
      adminStore.createLog({
        action: 'Перешел на Сообщения/Уведомление администрации'
      });
    });
  }, []);


  const onFinish = async e => {
    e.preventDefault();
    try {
      await adminStore.postNotification(createState);
      await fetchData();
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    } finally {
      setModal(false);
    }
  };



  const editItem = async (id) => {

    try {
      const res = await adminStore.getNotificationById(id)
      setEditTitle(res)
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  }

  const save = async e => {
    e.preventDefault();
    try {
      await adminStore.editNotification(editTitle)
      await fetchData()
      await adminStore.createLog({
        action: 'Изменил Уведомление'
      });
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }  finally {
      setEditTitle(null);
    }
  }

  const reset = () => {
    setModal(false);
    setEditTitle(false)
    setCreateState({
      title: '',
      message: ''
    });
  };

  const deleteItem = async id => {
    try {
      await adminStore.deleteNotification(id);
      await fetchData();
      await adminStore.createLog({
        action: 'Удалил Уведомление'
      });
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };

  return(
    <>
      <div>
        <div className="adm-tab-title">
          <h3>Уведомление Администрации</h3>
          <Button onClick={() => setModal(true)}>Добавить</Button>
        </div>
        <Table
          columns={columns}
          dataSource={note}
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
              label='Название'
            >
              <Input
                value={createState.title}
                onChange={e => setCreateState({...createState, title: e.target.value})}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label='Описание'
            >
              <Input.TextArea
                rows={4}
                value={createState.message}
                onChange={e => setCreateState({...createState, message: e.target.value})}
              />
            </Form.Item>

            <Form.Item style={{marginTop: 30}}>
              <Button onClick={reset} style={{marginRight:"20px"}}>Отмена</Button>
              <Button type="primary" htmlType="submit">Добавить</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title='Изменить'
          visible={!!editTitle}
          width={600}
          onOk={save}
          destroyOnClose
          onCancel={() => setEditTitle(false)}
          maskClosable
          footer={false}
        >
          <Form onSubmit={editItem}>
            <Form.Item
              name = "title"
              label="Название"
            >
              <Input
                value={editTitle?.title}
                onChange={e => setEditTitle({...editTitle, title: e.target.value})}
              />

            </Form.Item>
            <Form.Item
              name="description"
              label='Описание'
            >
              <Input.TextArea
                rows={4}
                value={editTitle?.message}
                onChange={e => setEditTitle({...editTitle, message: e.target.value})}
              />
            </Form.Item>
            <Form.Item style={{marginTop: 30}}>
              <Button onClick={reset} style={{marginRight:"20px"}}>Отмена</Button>
              <Button type="primary" htmlType="submit">Изменить</Button>
            </Form.Item>
          </Form>
        </Modal>

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
    </>
  )
}

export default AdminNotification;
