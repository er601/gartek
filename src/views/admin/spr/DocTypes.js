import React from "react";
import {Alert, Card, Form} from 'antd';
import Input, {InputNumber} from "../../../components/Input";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";
import Checkbox from '../../../components/Checkbox'

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
export default class DocTypesRef extends React.Component {
  @observable data = [];
  @observable item = {};
  @observable hasError = false;

  componentDidMount() {
    this.getData();
    this.props.adminStore.createLog({
      action: 'Перешел на страницу Справочник/Перечень документов'
    });
  }

  async getData() {
    let r = await this.props.adminStore.getDocs();
    this.createItem();
    this.data = r || [];
  };

  @computed
  get canSave() {
    return !!(this.item && this.item.name && this.item.position && !this.hasError);
  }

  createItem() {
    this.item = {};
  }

  async saveItem() {
    await this.props.adminStore.saveDoc(this.item);
    this.getData();
    await this.props.adminStore.createLog({
      action: 'Создал/Изменил на странице перечень документов'
    });
  }

  onInputChangeHandler(value){
    let ids = this.data?.map((item)=>item['id']);
    if (value in ids){
      this.hasError = true; // That Value exists. TRY another one!
    }else {
      this.hasError = false; // This value is FREE
    }
  }

  render() {

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Позиция',
        dataIndex: 'position',
      },
      {
        title: 'Наименование',
        dataIndex: 'name',
      },
      {
        key: 'status',
        title: 'Активный',
        dataIndex: 'status',
        render: (text, record) => text ? 'Да' : 'Нет'
      },
      {
        dataIndex: 'id',
        render: (text, record) => (
          <div style={{width: 10}}>
            <Button icon="edit" size="small" title="Изменить" outline onClick={() => this.item = record}/>
          </div>
        ),
      },
    ];

    return (
      <Card title="Перечень документов"
            extra={
              <Button size="small" onClick={() => this.createItem()}>
                Новый
              </Button>
            }>

        {this.hasError ? <Alert type='warning'
                                message="Данный Номер уже занят" closeText={" закрыть "}
                                onClose={()=>this.hasError = false}/> : <></>}

        <Form {...formItemLayout}>

          <Form.Item label="Позиция">
            <InputNumber onChange={this.onInputChangeHandler.bind(this)} model={this.item} name={'position'}/>
          </Form.Item>

          <Form.Item label="Наименование">
            <Input model={this.item} name="name"/>
          </Form.Item>

          <Form.Item label="Активный">
            <Checkbox checked={this.item.status}
                      onChange={() => this.item.status = !this.item.status}/>
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
