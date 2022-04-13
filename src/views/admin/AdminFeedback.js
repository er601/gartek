import {Button, Divider, Form, Input, Modal} from 'antd';
import {ConfirmButton} from "../../components/Button";
import ReactTable from "../../components/ReactTable";
import React, {useEffect, useRef, useState} from "react";
import TableActions from "../../components/TableActions";
import {DeleteOutlined, EditOutlined, SendOutlined} from "@ant-design/icons";
import moment from "moment";
import AdminStore from "/src/store/AdminStore"
import appStore from "../../store/AppStore";
import adminStore from "/src/store/AdminStore";



const AdminFeedback = () =>{
  const [state, setState] = useState({
    answer: '',
    id: ''
  });
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const msgId = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminStore.getFeedback();
        await adminStore.createLog({
          action: 'Перешел на страницу обратная связь'
        });
        setTableData(response.reverse());
      } catch (e) {
        appStore.setAlert('error', 'Ошибка при обращении на сервер');
        console.log(e);
      }
    };

    fetchData();
  }, []);


  const edit = async id => {
    try {
      await AdminStore.getFeedbackId(id);
      const response = await AdminStore.getFeedback();
      appStore.setAlert('success', 'Сообщение прочитано');
      setTableData(response.reverse());
    } catch (e) {
      appStore.setAlert('error', 'Ошибка при обращении на сервер');
      console.error(e);
    }

  };

  const deleteItem = async id => {
    try {
      await AdminStore.deleteFeedback(id);
      const response = await AdminStore.getFeedback();
      appStore.setAlert('success', 'Успешно удалено');
      await adminStore.createLog({
        action: 'Удалил сообщение из обратной связи'
      });
      setTableData(response.reverse());
    } catch (e) {
      appStore.setAlert('error', 'Ошибка при обращении на сервер');
      console.error(e);
    }
  };

  const onFinish = async e => {
    e.preventDefault();
    try {
      await AdminStore.postSendEmailFeedback(state.id, {answer: state.answer});
      const response = await AdminStore.getFeedback();
      setTableData(response);
      setOpenModal(false);
      await adminStore.createLog({
        action: 'Отправил письмо с ответом'
      });
    } catch (e) {
      console.log(e);
    }
  };

  const answer = (id) => {
    setState({...state, id});
    setOpenModal(true);
  };


  const columns = [
    {
      Header: 'Фамилия',
      accessor: 'lastName',
      headerClassName: 'f-bold',
      className: 'text-center',
      maxWidth: 150,
      Cell: ({original, value}) => (
        <div style={{color: original.seen ? "green" : "red", cursor: "pointer"}}>
          {value}
        </div>),
    },
    {
      Header: "Имя",
      accessor: 'name',
      headerClassName: 'f-bold',
      className: 'text-center',
      maxWidth: 150,
      Cell: ({original, value}) => (
        <div style={{color: original.seen ? "green" : "red", cursor: "pointer"}} >
          {value}
        </div>),
    },
    {
      Header: "Дата отправления",
      accessor: 'date',
      headerClassName: 'f-bold',
      className: 'text-center',
      maxWidth: 150,
      Cell: ({original, value}) => (
        <div style={{color: original.seen ? "green" : "red", cursor: "pointer"}}  onClick={() => setMessage(original)}>
          {moment(value).format('DD-MM-YYYY')}
        </div>),
    },
    {
      Header: "Сообщение",
      accessor: 'message',
      headerClassName: 'f-bold',
      className: 'text-center',
      maxWidth: 450,
      Cell: ({original, value}) => (
        <div style={{color: original.seen ? "green" : "red", cursor: "pointer"}} onClick={() => setMessage(original)} >
          {value}
        </div>),
    },
    {
      Header: "Адрес эл почты",
      accessor: 'mail',
      className: 'text-center',
      headerClassName: 'f-bold',
      maxWidth: 150, Cell: ({original, value}) => (
        <div style={{color: original.seen ? "green" : "red", cursor: "pointer"}} onClick={() => setMessage(original)}>
          {value}
        </div>),
    },
    {
      Header: "Номер телефона",
      accessor: 'phoneNumber',
      className: 'text-center',
      headerClassName: 'f-bold',
      maxWidth: 150, Cell: ({original, value}) => (
        <div style={{color: original.seen ? "green" : "red", cursor: "pointer"}}  onClick={() => setMessage(original)}>
          {value}
        </div>),
    },
    {
      width: 120,
      Cell: ({original}) => <>
        <TableActions>
          <Button  size="small" title="Изменить"  onClick={() => edit(original.id) }
          >
            <EditOutlined/>
          </Button>

          <ConfirmButton size="small" title="Удалить" onConfirm={() => deleteItem(original.id)} >
            <DeleteOutlined />
          </ConfirmButton>
          <Button size="small" type="primary" title="Ответить" onClick={() => answer(original.id)}>
            <SendOutlined />
          </Button>
        </TableActions>

      </>,
    },

  ];

  return (
    <div className="adm-tab-content">
      <div className="adm-tab-title">
        <h3>Сообщения</h3>
      </div>
      <ReactTable
        data={tableData}
        columns={columns}
        defaultPageSize={10}
        okText="Добавить"
      />
      {!!message && <>
        <Divider/>
        <div className="site-card-border-less-wrapper">
          <h3 style={{textAlign: "center"}}>Подробнее</h3>
          <p><b>Фамилия: </b> {message.lastName}</p>
          <p><b>Имя:</b> {message.name}</p>
          <p><b>Дата Отправления: </b> {moment(message.date).format('DD-MM-YYYY')}</p>
          <p><b>Адрес Эл.Почты:</b> {message.mail}</p>
          <p><b>Номер телефона:</b> {message.phoneNumber}</p>
          <p><b>Сообщение:</b></p>
          <p>{message.message}</p>
        </div>
      </>}

      <Modal
        title="Ответ"
        visible={openModal}
        width={600}
        destroyOnClose
        onCancel={() => setOpenModal(false)}
        maskClosable
        footer={false}
      >
        <Form onSubmit={onFinish}>
          <Form.Item
            name="message"
          >
            <Input.TextArea
              placeholder={"Введите сообщение"}
              value={state.answer}
              onChange={e => setState({...state, answer: e.target.value})}
            />
          </Form.Item>
          <Form.Item wrapperCol={{offset: 8, span: 16}}>
            <Button type="primary" htmlType="submit">
              Отправить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


export default AdminFeedback;











