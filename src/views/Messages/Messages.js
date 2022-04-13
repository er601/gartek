import React, {useEffect, useState} from "react";
import {Table, Tabs} from "antd";
import Questions from "./Questions/Questions";
import News from "./News/News";
import Instructions from "./Instructions/Instructions";
import {useHistory} from "react-router-dom";
import Notification from "./Notification/Notification";


const { TabPane } = Tabs;


const Messages = () => {
  const history = useHistory();
  const [tab, setTab] = useState('notification');

  const changeTab = key => {
    history.push(`#${key}`);
    localStorage.setItem('publicMes', key);
    setTab(key);
  };

  useEffect(() => {
    if (history.location.hash) {
      setTab(history.location.hash.replace('#', '') || 'notification');
    } else if (localStorage.getItem('publicMes')) {
      const lc = localStorage.getItem('publicMes');
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

          <Notification />

        </TabPane>
        <TabPane tab="Новости" key="news">

          <div>
            <News />
          </div>

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
export default Messages;
