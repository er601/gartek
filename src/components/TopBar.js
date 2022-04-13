import {Avatar, Col, Dropdown, Form, Icon, Layout, Menu, Modal, Row, Select} from 'antd'
import React, {useMemo, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {useAuth} from 'oidc-react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import Input from './Input'
import Button from './Button'
import appStore from '../store/AppStore'
import {useRoutes, useUser} from '../routes'

const {Header} = Layout;

const TopBar = () => {
  const auth = useAuth();
  const [loginVisible, showLogin] = useState();
  const history = useHistory();
  const user = useUser();
  const routes = useRoutes();
  const location = useLocation();
  const [loginVisibleEc, showLoginEc] = useState();

  const dropdownMenu = useMemo(() => {
    if (appStore.isAdmin) {
      return (
        <Menu>
          <Menu.Item>
            <Link to="/profile">
              <Icon type="setting" style={{marginRight: 5}}/>
              Мой профиль
            </Link>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              appStore.logout();
              history.replace("/home");
            }}
          >
            <Icon type="logout"/>
            <span>Выход</span>
          </Menu.Item>
        </Menu>
      )

    } else if (appStore.isUser) {
      return (
        <Menu>
          <Menu.Item>
            <Link to="/profile">
              <Icon type="setting" style={{marginRight: 5}}/>
              Мой профиль
            </Link>
          </Menu.Item>

          <Menu.Divider/>

          <Menu.Item
            onClick={() => {
              appStore.logout();
              history.replace("/home");
            }}
          >
            <Icon type="logout"/>
            <span>Выход</span>
          </Menu.Item>
        </Menu>
      )

    } else
      return null;

  }, [user?.role]);

  const logoLink = useMemo(() =>
      appStore.isAdmin ? '/admin/licenses'
        : appStore.isUser ? '/licenses'
          : '/home',
    [user?.role])

  return (
    <>
      <Header className="header">
        <Row type="flex" justify1="space-between" style={{background: '#001529'}}>
          <Col>
            <div className="logo">
              <Link to={logoLink}>
                <Avatar shape="square" src="http://regultek.gov.kg/assets/template/img/logo.png" size="large"/>
              </Link>
            </div>
          </Col>

          <Col style={{flexGrow: 1}}>
            <Menu theme="dark" mode="horizontal" style={{lineHeight: "64px"}} selectedKeys={[]}>
              {routes
                .filter(r => !r.hidden)
                .map(r => (
                  <Menu.Item key={r.path}
                             className={location.pathname.startsWith(r.path) && 'ant-menu-item-selected'}
                  >
                    <Link to={r.path}>
                      {r.title}
                    </Link>
                  </Menu.Item>
                ))}
            </Menu>
          </Col>

          <Col style={{marginRight: 20}}>
            <div style={{display: 'flex'}}>

              {user ?
                <Dropdown overlay={dropdownMenu}>
                  <div>
                    {/*<span style={{marginRight: 10}}>{`${user.lastname || ''} ${user.name || ''}`}</span>*/}
                    <span style={{marginRight: 10, color: 'white'}}>
                      {user.name}
                    </span>
                    <Avatar/>
                  </div>
                </Dropdown>
                :
                <Dropdown.Button
                  type="primary"
                  icon={<Icon type="down"/>}
                  onClick={() => auth.signIn()}
                  overlay={
                    <Menu selectedKeys={[]}>
                      <Menu.Item onClick={() => showLogin(true)}>
                        Вход через email
                      </Menu.Item>
                      <Menu.Item onClick={() => showLoginEc(true)}>
                        Вход через ЭП
                      </Menu.Item>
                    </Menu>
                  }>
                  Вход
                </Dropdown.Button>
              }

            </div>
          </Col>

        </Row>
      </Header>

      <Modal
        width={500}
        visible={loginVisible}
        footer={null}
        keyboard={false}
        onCancel={() => showLogin(false)}
        maskClosable={false}
      >
        <LoginForm history={history} onFinish={() => showLogin(false)}/>
      </Modal>
      <Modal
        width={500}
        visible={loginVisibleEc}
        footer={null}
        keyboard={false}
        onCancel={() => showLoginEc(false)}
        maskClosable={false}
      >
        <Form>
          <h3>Аутентификация при помощи Рутокен ЭЦП</h3>
          <Form.Item name="device " label="Доступные устройства:" rules={[{required: true, message: 'Missing area'}]}>
            <Button>
              Обновить
            </Button>
            <Select/>
          </Form.Item>
          <Form.Item name="" label="Доступные сертификаты:" rules={[{required: true, message: 'Missing area'}]}>
            <Select/>
          </Form.Item>
          <Form.Item name="certificates" label="PIN КОД:" rules={[{required: true, message: 'Missing area'}]}>
            <Input/>
          </Form.Item>
          <Form.Item wrapperCol={{offset: 5, span: 16}}>
            <Button type="primary" htmlType="submit" style={{width: "250px"}}>
              Войти
            </Button>
          </Form.Item>
        </Form>

      </Modal>

    </>
  );
}

// const ProfileMenu = ({history, user}) => {
//   return
// }

@observer
class LoginForm extends React.Component {
  @observable login = "";
  @observable password = "";

  onSubmit = async (e) => {
    e.preventDefault();

    const {history, onFinish} = this.props;

    await appStore.login(this.login, this.password)

    if (appStore.isUser) {
      history.push('/licenses');
    } else if (appStore.isAdmin) {
      history.push('/admin/licenses');
    } else {
      history.push("/home");
    }

    onFinish?.()
  }

  render() {
    return (
      <>
        <h3>Вход: Админ</h3>

        <Form className="login-form" onSubmit={this.onSubmit}>
          <Form.Item>
            <Input
              prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>}
              placeholder="Логин"
              value={this.login}
              onChange={login => (this.login = login)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>}
              type="password"
              placeholder="Пароль"
              value={this.password}
              onChange={password => (this.password = password)}
            />
          </Form.Item>
          <Form.Item>
            <Button size="large"
                    type="primary"
                    htmlType="submit"
                    block
                    disabled={this.login.length < 3 || this.password < 2 || appStore.loading}
            >
              Войти
            </Button>
          </Form.Item>

        </Form>
      </>
    );
  }
}

export default TopBar;
