import React, {useEffect, useState} from "react";
import {Table, Tabs} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import Button from "../../../components/Button";
import {ConfirmButton} from "../../../components/ButtonConfirm";
import ReactTable from "../../../components/ReactTable";
import TableActions from "../../../components/TableActions";
import Questions from "./Questions/Questions";
import News from "./News/News";
import Instructions from "./Instructions/Instructions";
import {useHistory} from "react-router-dom";
import AdminNotification from "./AdminNotification/AdminNotification";

const { TabPane } = Tabs;






const columns1 = [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Опубликовано',
    dataIndex: 'public',
    key: 'public',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.public - b.public,
  },
  {
    title: 'Обновлено',
    dataIndex: 'updated',
    key: 'updated',
    sorter: (a, b) => a.updated - b.updated,
  },


  {
    title: '',
    key: 'action',
    render: () => (
      <>
        <Button  size="small" title="Изменить" style={{marginRight:"10px"}}
        >
          <EditOutlined/>
        </Button>

        <ConfirmButton size="small" title="Удалить" >
          <DeleteOutlined />
        </ConfirmButton>
      </>)
  },

];

const data = [
  [
    {
      key: '1',
      name: 'Обновлены инструкции по добавлению деталей проекта',
      public: "15.10.2021 20:45",
      updated: '15.10.2021 20:45'

    },],
  [
    {

      key:"2",
      name:"В тестовом режиме запущена Платформа о Внешней Помощи",
      public: "15.10.2021 20:45",
      updated: '15.10.2021 20:45'

    }
  ],

]
const tabListNoTitle = [
  {
    key: 'adminnotif',
    tab: '\n' +
      'Уведомление администрации\n'
  },
  {
    key: 'News',
    tab: 'Новости',
  },
  {
    key: 'askanswer',
    tab: 'Вопросы и ответы',
  },
  {
    key: 'instruction',
    tab: 'Инструкции',

  },
];


const AdminMessages = () => {
  const history = useHistory();
  const [tab, setTab] = useState('notification');

  const changeTab = key => {
    history.push(`#${key}`);
    localStorage.setItem('adminMes', key);
    setTab(key);
  };

  useEffect(() => {
    if (history.location.hash) {
      setTab(history.location.hash.replace('#', '') || 'notification');
    } else if (localStorage.getItem('adminMes')) {
      const lc = localStorage.getItem('adminMes');
      setTab(lc);
      history.push(`#${lc}`);
    } else {
      history.push('#notification');
    }
  }, []);


  return (
    <>

      <Tabs
        defaultActiveKey={tab}
        destroyInactiveTabPane
        onChange={changeTab}
        activeKey={tab}
      >
        <TabPane tab="Уведомление администрации" key="notification">

          <AdminNotification />

        </TabPane>
        <TabPane tab="Новости" key="news">

          <News />

        </TabPane>
        <TabPane tab="Вопросы и ответы" key="questions">
          <Questions />
        </TabPane>
        <TabPane tab="Инструкции" key="instructions">

          <Instructions />

        </TabPane>
      </Tabs>
    </>
  );
};
export default AdminMessages
