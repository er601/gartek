import React from "react";
import {Card, Form} from 'antd';
import Input from "../../../components/Input";
import Button, {ConfirmButton} from "../../../components/Button";
import Table from "../../../components/Table";
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";
import adminStore from "../../../store/AdminStore";

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

@inject('adminStore')
@observer
export default class BanksRef extends React.Component {
  @observable data = [];
  @observable item = {};

  componentDidMount() {
    this.getData();
    this.props.adminStore.createLog({
      action: 'Перешел на страницу Справочник/Банки'
    });
  }

  async getData() {
    let r = await this.props.adminStore.getBanks();
    this.createItem();
    this.data = r || [];
  };

  @computed
  get canSave() {
    return !!(this.item && this.item.name);
  }

  createItem() {
    this.item = {};
  }

  async saveItem() {
    await this.props.adminStore.saveBank(this.item);
    await this.props.adminStore.createLog({
      action: 'Сохранил банк на страницу Справочник/Банки'
    });
    this.getData();
  }

  async deleteItem(id) {
    await this.props.adminStore.deleteBank(id);
    await this.props.adminStore.createLog({
      action: 'Удалил банк на страницу Справочник/Банки ' + id.toString()
    });
    this.getData();
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Наименование',
        dataIndex: 'name',
      },
      {
        dataIndex: 'id',
        width: 65,
        render: (text, record) => (
          <>
            <Button icon="edit" size="small" title="Изменить" outline style={{marginRight: 5}}
                    onClick={() => this.item = record}/>
            <ConfirmButton icon="delete" size="small" title="Удалить" outline type="danger"
                           onConfirm={() => this.deleteItem(record.id)}/>
          </>
        ),
      },
    ];

    return (
      <Card title="Банки"
            extra={
              <Button size="small" onClick={() => this.createItem()}>
                Новый
              </Button>
            }>

        <Form {...formItemLayout}>
          <Form.Item label="Наименование">
            <Input model={this.item} name="name"/>
          </Form.Item>
        </Form>

        <Button block
                disabled={!this.canSave}
                onClick={() => this.saveItem()}
        >
          Добавить/Изменить
        </Button>

        <Table style={{marginTop: 15}}
               columns={columns}
               data={this.data}
               pagination={false}
        />
      </Card>
    )
  }
}
