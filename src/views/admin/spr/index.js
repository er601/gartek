import React from 'react';
import {Link, Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {Card, Col, Menu, Row} from "antd";
import ActivityType from "./ActivityType";
import DocTypes from "./DocTypes";
import Constructor from "./Constructor";
import Users from "./Users";
import Banks from "./Banks";
import LicenseStatus from "./LicenseStatus";
import Currency from './Currency'
import Logs from "./Logs";
// import Languages from "./Languages";
// import Countries from "./Countries";
// import Opf from "./Opf";
// import Coate from "./Coate";
// import Forms from "./Forms";
// import Settings from "./Settings";

const routes = [
  {
    title: 'Пользователи',
    path: '/spr/users',
    component: Users,
  },
  {
    title: 'Виды деятельности',
    path: '/spr/activities',
    component: ActivityType,
  },
  {
    title: 'Перечень документов',
    path: '/spr/docs',
    component: DocTypes,
  },
  {
    title: 'Конструктор документов',
    path: '/spr/constructor',
    component: Constructor,
  },
  // {
  //   title: 'Языки',
  //   path: '/spr/lang',
  //   component: Languages,
  // },
  // {
  //   title: 'Страны',
  //   path: '/spr/country',
  //   component: Countries,
  // },
  // {
  //   title: 'ОПФ',
  //   path: '/spr/opf',
  //   component: Opf,
  // },
  {
    title: 'Банки',
    path: '/spr/banks',
    component: Banks,
  },
  {
    title: 'Валюты',
    path: '/spr/currency',
    component: Currency,
  },
  {
    title: 'Статусы лицензий',
    path: '/spr/license_status',
    component: LicenseStatus,
  },
  {
    title: 'Логи',
    path: '/spr/logs',
    component: Logs
  }
  // {
  //   title: 'СОАТЕ',
  //   path: '/spr/coate',
  //   component: Coate,
  // },
  // {
  //   title: 'Формы собственности',
  //   path: '/spr/forms',
  //   component: Forms,
  // },
  // {
  //   title: 'Настройки',
  //   path: '/spr/settings',
  //   component: Settings,
  // },
];

class SprMain extends React.Component {
  render() {
    const {location} = this.props;

    return (
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={6} lg={6}>
          <Card size={'small'}>

            <Menu mode="vertical" selectedKeys={[]}>
              {routes.map(r => (
                <Menu.Item key={r.path}
                           className={location.pathname.startsWith(r.path) && 'ant-menu-item-selected'}
                >
                  <Link to={r.path}>
                    {r.title}
                  </Link>
                </Menu.Item>
              ))}
            </Menu>

          </Card>
        </Col>
        <Col xs={24} sm={24} md={18} lg={18}>
          <Switch>
            {routes.map(r => (
              <Route
                key={r.path}
                path={r.path}
                component={r.component}
                exact={r.exact}
              />
            ))}
            <Redirect from={'/spr'} to={routes[0].path}/>
          </Switch>
        </Col>
      </Row>
    )
  }
}

export default withRouter(SprMain);
