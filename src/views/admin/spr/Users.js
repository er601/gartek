import React, {useEffect, useMemo, useState} from "react";
import adminStore from "../../../store/AdminStore";
import {Card, Checkbox, Form, Input, Tooltip} from "antd";
import {PhoneInput} from "../../../components/Input";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import {dateFormat} from "../../../common/utils";

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

const Users = () => {
  const [user, setUser] = useState({
    blocked: false,
    createdDate: "",
    email: "",
    fatherName: "",
    name: "",
    password: "",
    phone: "",
    pin: "",
    role: "",
    surname: "",
    tin: '',
    updateDate: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
    adminStore.createLog({action: 'Перешел на Справочник/Пользователи'});
  }, []);

  const resetUser = () => {
    setUser({
      blocked: false,
      createdDate: "",
      email: "",
      fatherName: "",
      name: "",
      password: "",
      phone: "",
      pin: "",
      role: "",
      surname: "",
      tin: '',
      updateDate: '',
    });
  };

  const getUsers = () => {
    resetUser();
    adminStore.getUsers().then(r => setUsers(r));
  };



  const canSave = useMemo(() => {
    return user.name
      && user.password
      && user.email
      && user.fatherName
      && user.phone
      && user.surname
      && user.pin;
  }, [user.name, user.password, user.email, user.fatherName, user.phone, user.surname, user.pin]);

  const columns = [
    {
      title: 'Pin',
      dataIndex: 'pin',
    },
    {
      title: 'blocked',
      dataIndex: 'blocked',
      render: val => val.toString()
    },
    {
      title: 'Имя',
      dataIndex: 'name',
    },
    {
      title: 'Фамилия',
      dataIndex: 'surname',
    },
    {
      title: 'Отчество',
      dataIndex: 'fatherName',
    },
    {
      title: 'Почта',
      dataIndex: 'email',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      dataIndex: 'createdDate',
      title: 'Создан',
      render: val => dateFormat(val)
    },
    {
      dataIndex: 'id',
      key: 'action',
      render: (text, record) => (
        <div style={{width: 25}}>
          <Tooltip title="Изменить">
            <Button
              icon='edit'
              size='small'
              outline
              onClick={() => {
                setUser(record);
              }}
            />
          </Tooltip>
        </div>
      ),
    }
  ];

  console.log(user);


  return (
    <Card title='Пользователи'
          extra={<>
            <Button type="primary" style={{marginRight: 10}} onClick={resetUser}>Очистить поля</Button>
            <Button type="default" onClick={() => getUsers()}>Обновить</Button>
          </>}>
      <Form {...formItemLayout}>
        <Form.Item label="Имя">
          <Input
            value={user.name}
            onChange={e => setUser({
              ...user,
              name: e.target.value
            })}
          />
        </Form.Item>
        <Form.Item label="Фамилия">
          <Input
            value={user.surname}
            onChange={e => setUser({
              ...user,
              surname: e.target.value
            })}
          />
        </Form.Item>
        <Form.Item label="Отчество">
          <Input
            value={user.fatherName}
            onChange={e => setUser({
              ...user,
              fatherName: e.target.value
            })}
          />
        </Form.Item>
        <Form.Item label="Почта">
          <Input
            value={user.email}
            onChange={e => setUser({
              ...user,
              email: e.target.value
            })}
          />
        </Form.Item>
        <Form.Item label="ПИН">
          <Input
            value={user.pin}
            onChange={e => setUser({
              ...user,
              pin: e.target.value
            })}
          />
        </Form.Item>
        <Form.Item label="Телефон">
          <PhoneInput
            value={user.phone}
            onChange={v => setUser({...user, phone: v})}
          />
        </Form.Item>
        <Form.Item label="Пароль">
          <Input
            value={user.password}
            onChange={e => setUser({
              ...user,
              password: e.target.value
            })}
          />
        </Form.Item>
        <Form.Item label="Заблокирован">
          <Checkbox
            checked={user.blocked}
            onChange={() => setUser({
              ...user,
              blocked: !user.blocked
            })}
          />
        </Form.Item>
        <Form.Item label="Админ">
          <Checkbox
            checked={user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MAIN_ADMIN'}
            onChange={e => setUser(() => {
              if (e.target.checked) {
                return {
                  ...user,
                  role: 'ROLE_ADMIN'
                }
              } else {
                return {
                  ...user,
                  role: 'ROLE_USER'
                }
              }
            })}
          />
        </Form.Item>

        <Form.Item style={{textAlign: 'center'}}>
          <Button
            disabled={!canSave}
            onClick={() => {
              if (!user.id) {
                const obj = {...user};
                delete obj.createdDate;
                delete obj.updateDate;
                delete obj.tin;
                delete obj.blocked;
                obj.admin = obj.role === 'ROLE_ADMIN';
                delete obj.role;
                adminStore.createUser(obj).then(async r => {
                  await adminStore.createLog({
                    action: `Создал пользователя - ${obj.name} ${obj.surname}`
                  });
                  resetUser();
                  getUsers();
                });
              } else {
                adminStore.changeUser(user).then(async r => {
                  await adminStore.createLog({
                    action: `Изменил пользователя - ${user.name} ${user.surname}`
                  });
                  resetUser();
                  getUsers();
                })
              }
            }}
          >
            Добавить/Изменить
          </Button>
        </Form.Item>
      </Form>

      <Table
        style={{marginTop: 15}}
        columns={columns}
        data={users}
      />
    </Card>
  );
};

export default Users;
