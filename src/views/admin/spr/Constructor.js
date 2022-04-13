import React, {Fragment} from "react";

import {Card, Divider, Form, Typography} from 'antd';
import {inject, observer} from "mobx-react";
import Checkbox from "../../../components/Checkbox";
import {action, observable} from "mobx";
import Button from "../../../components/Button";
import adminStore from "../../../store/AdminStore";
import appStore from "../../../store/AppStore";

@inject('adminStore')
@observer
export default class Constructor extends React.Component {

  @observable activities = [];
  @observable activity = null;
  @observable docs = [];

  async componentDidMount() {
    const {adminStore} = this.props;
    const a = await adminStore.getActivities();
    this.activities = a || [];
    const d = await adminStore.getDocs();
    this.docs = d || [];
    await adminStore.createLog({
      action: 'Перешел на страницу Справочник/Конструктор документов'
    });
  }

  isActivityDocs = (doc_id) => {
    if (!this.activity) return;
    return this.activity.docIds.includes(doc_id);
  }

  @action
  setActivityDocs = (doc_id, checked) => {
    if (!this.activity) return;

    let act = this.activity;
    if (checked) {
      act.docIds.push(doc_id);
    } else {
      act.docIds.splice(act.docIds.indexOf(doc_id), 1);
    }
  }

  saveActivityDocs = async () => {
    if (!this.activity) return;

    let {docIds, id} = this.activity;
    await adminStore.saveActivityDocs(id, docIds)
    await adminStore.createLog({
      action: 'Сохранил документ на страницу Справочник/Конструктор документов ' + id.toString()
    });
    appStore.setAlert('success', 'Сохранено!')
  }

  render() {
    const {adminStore} = this.props;
    const acts = this.activities.filter(a => a.status).sort((a, b) => a.position - b.position);
    const docs = this.docs.filter(d => d.status).sort((a, b) => a.position - b.position);

    return (
      <Card title='Конструктор документов'>
        <Card type="inner" title={'Вид деятельности'}>
          {acts.map(a => <Fragment key={a.id}>
            <Checkbox key={a.id}
                      checked={this.activity && this.activity.id === a.id}
                      label={a.id+ '. ' + a.name}
                      onChange={(val) => {
                        if (this.activity && this.activity.id === a.id) {
                          this.activity = null;
                        } else {
                          this.activity = a;
                        }
                      }}/>
            <Divider dashed/>
          </Fragment>)}
        </Card>

        {!!this.activity ?
          <>
            <br/>
            <Card type="inner" title={'Перечень документов'}>
              <h4>{this.activity.name}</h4>
              <Divider/>
              {docs.map(c =>
                <Form.Item key={c.id}>
                  <Checkbox
                    label={c.name}
                    checked={this.isActivityDocs(c.id)}
                    onChange={(v) => this.setActivityDocs(c.id, v)}
                  />
                </Form.Item>
              )}
            </Card>
            <Button size='large' onClick={this.saveActivityDocs}>Сохранить</Button>
          </>
          : <Typography.Text type="warning">Выберите вид деятельности</Typography.Text>
        }
      </Card>
    )
  }

}
