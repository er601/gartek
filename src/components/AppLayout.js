import React from "react";
import {Route, Switch} from "react-router-dom";
import {Card, Layout} from "antd";
import TopBar from './TopBar'
// import Licence from "./Licence";
// import Profile from "./profile/Profile";

const {Footer, Content} = Layout;

const AppLayout = ({children}) => {
  return (
    <Layout>
      <TopBar/>

      <Content style={{padding: "20px"}}>
        <Card>
          {children}
        </Card>
      </Content>

      <Footer style={{textAlign: "center"}}>
        ГАРТЭК © {(new Date().getFullYear())}
      </Footer>
    </Layout>
  );
};

export default AppLayout
