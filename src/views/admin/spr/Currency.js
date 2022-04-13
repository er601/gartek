import React from "react";
import {Card, Form} from 'antd';
import Input from "../../../components/Input";
import Button, {ConfirmButton} from "../../../components/Button";
import Table from "../../../components/Table";
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";

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
export default class CurrencyRef extends React.Component {
  @observable data = [];
  @observable item = {};

  componentDidMount() {
    this.getData();
    this.props.adminStore.createLog({
      action: 'Перешел на страницу Валюты'
    });
  }

  async getData() {
    let r = await this.props.adminStore.getCurrencies();
    this.createItem();
    this.data = r || [];
  };

  @computed
  get canSave() {
    return !!(this.item && this.item.name && this.item.code);
  }

  createItem() {
    this.item = {};
  }

  async saveItem() {
    await this.props.adminStore.saveCurrency(this.item);
    await this.getData();
    await this.props.adminStore.createLog({
      action: 'Сохранил валюту на странице Валюты'
    });
  }

  async deleteItem(id) {
    await this.props.adminStore.deleteCurrency(id);
    await this.getData();
    await this.props.adminStore.createLog({
      action: 'Удалил валюту на странице Валюты'
    });
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
        title: 'Код',
        dataIndex: 'code',
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
      <Card title="Валюты"
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

        <Form {...formItemLayout}>
          <Form.Item label="Код">
            <Input model={this.item} name="code"/>
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
