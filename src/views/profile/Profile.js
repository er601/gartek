import React from "react";
import {Card, Form, Tabs, Typography} from 'antd';
import Input from "../../components/Input";
import {ConfirmButton} from "../../components/Button";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import adminStore from "../../store/AdminStore";

const {TabPane} = Tabs;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

@inject('appStore')
@observer
export default class Profile extends React.Component {

  @observable passwords = {old: '', new1: '', new2: ''};

  componentDidMount() {
    adminStore.createLog({
      action: 'Перешел на профиль'
    });
    // this.props.loadUser();
  }

  render() {
    const {history, appStore} = this.props;
    const {user} = appStore;
    return (
      <>
        <Typography.Title level={3}>Мой профиль</Typography.Title>

        <Tabs defaultActiveKey="1" tabPosition={'left'}>
          <TabPane tab='Личные данные' key="1">
            <Form {...formItemLayout} style={{maxWidth: 500}}>
              <Form.Item label="Пин руководителя">
                <Input disabled model={user} name='pin'/>
              </Form.Item>
              <Form.Item label={"Фамилия"}>
                <Input disabled model={user} name={'surname'}/>
              </Form.Item>
              <Form.Item label={"Имя"}>
                <Input disabled model={user} name={'name'}/>
              </Form.Item>
              <Form.Item label={"Отчество"}>
                <Input disabled model={user} name={'fatherName'}/>
              </Form.Item>
              <Form.Item label='Email'>
                <Input type="email" disabled model={user} name={'email'}/>
              </Form.Item>
              <Form.Item label={"Номер телефона"}>
                <Input type="tel" disabled model={user} name={'phone'}/>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab='Смена пароля' key="2">
            <Form {...formItemLayout} style={{maxWidth: 500}}>
              <Form.Item label={'Введите пароль'}>
                <Input type='password' model={this.passwords} name={'old'}/>
              </Form.Item>
              <Form.Item label={'Повторите пароль'}>
                <Input type='password' model={this.passwords} name={'new1'}/>
              </Form.Item>
              <Form.Item label={'Повторите пароль'}>
                <Input type='password' model={this.passwords} name={'new2'}/>
              </Form.Item>
              <Form.Item>
                <ConfirmButton question={'Вы уверены'}
                               disabled={!this.passwords.old || !this.passwords.new1 || !this.passwords.new2 ||
                               this.passwords.new1.length !== this.passwords.new2.length}
                               onConfirm={() => {
                                 appStore.changePassword(this.passwords).then(async r => {
                                   await adminStore.createLog({
                                     action: 'Изменил пороль'
                                   });
                                   appStore.setAlert('success', 'Пароль успешно изменен');
                                   appStore.logout();
                                   history.replace('/home');
                                 });
                               }}>
                  Сохранить
                </ConfirmButton>
              </Form.Item>
            </Form>

          </TabPane>
        </Tabs>
      </>
    )
  }
}
