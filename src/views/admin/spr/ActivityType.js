import React from "react";
import {Card, Form, Tooltip, Alert} from 'antd';
import Input, {InputNumber} from "../../../components/Input";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import {inject, observer} from "mobx-react";
import Checkbox from "../../../components/Checkbox";
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
export default class ActivityType extends React.Component {

  @observable activityType = {status: true};
  @observable activityTypes = [];
  @observable hasError = false; // для проверки в input Позиции

  @computed
  get canSaveActivityType() {
    return this.activityType && this.activityType.name && this.activityType.position && !this.hasError;
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.props.adminStore.getActivities().then(r => {
      this.props.adminStore.createLog({
        action: 'Перешел на страницу Справочник/Виды деятельности'
      });
      this.activityType = {status: true};
      this.activityTypes = r || [];
    });
  };


  onInputChangeHandler(value){
    let activeTypesIdList = this.activityTypes.map((item)=>item['id']);
    if (value in activeTypesIdList){
      this.hasError = true; // That Value exists. TRY another one!
    }else {
      this.hasError = false; // This value is FREE
    }
  }

  render() {
    const {adminStore} = this.props;

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
        key: 'name',
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
        key: 'action',
        render: (text, record) => (
          <div style={{width: 10}}>
            <Tooltip title="Изменить">
              <Button icon={'edit'} size={'small'} outline onClick={() => this.activityType = record}/>
            </Tooltip>
          </div>
        ),
      },
    ];

    return (
      <Card title={'Виды деятельности'}
            extra={
              <Button size={'small'} type={'link'} onClick={() => this.activityType = {status: true}}>
                Новый
              </Button>}>

        {this.hasError ? <Alert type='warning'
                                message="Данный Номер уже занят" closeText={" закрыть "}
                                onClose={()=>this.hasError = false}/> : <></>}

        <Form {...formItemLayout}>
          <Form.Item label="Позиция">
            <InputNumber min={1} onChange={this.onInputChangeHandler.bind(this)} model={this.activityType} name={'position'}/>
          </Form.Item>

          <Form.Item label="Наименование">
            <Input model={this.activityType} name={'name'}/>
          </Form.Item>

          <Form.Item label="Активный">
            <Checkbox checked={this.activityType.status}
                      onChange={() => this.activityType.status = !this.activityType.status}/>
          </Form.Item>
        </Form>

        <Button block
                disabled={!this.canSaveActivityType}
                onClick={() => adminStore.saveActivity(this.activityType).then(r => this.getData())}
        >
          Добавить/Изменить
        </Button>

        <Table style={{marginTop: 15}}
               columns={columns}
               data={this.activityTypes}
               pagination={false}
        />
      </Card>
    )
  }
}
