import {observer} from "mobx-react";
import React from "react";
import {fileToBase64} from "../../common/utils";
import {Card, Col, Divider, Form, Select as AntSelect} from "antd";
import licenceStore from "../../store/LicenceStore";
import adminStore from "../../store/AdminStore";
import FilesList from "./FilesList";
// import JsonView from "../JsonView";

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

// @inject('licenceStore', 'adminStore')
@observer
export class DocsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {activities: []};
  }

  componentDidMount() {
    // const {adminStore, licenceStore} = this.props;
    // adminStore.getActivities().then(r => this.setState({activities: r}));
    // adminStore.getActivityDocs();
    // licenceStore.getAttachments();
  }

  onActivityChange = (activity_id) => {
    // let activity = this.state.activities.find(a => a.id == activity_id)
    // debugger
    licenceStore.setActivity(activity_id);
    licenceStore.saveLicenseActivity()
    // this.props.licenceStore.saveLicense()
    // this.props.licenceStore.setActivityId(activity_id);
  };

  onChange = async (files, name, doc_id,) => {
    const {licenceStore} = this.props;

    const licence_id = licenceStore.licence.id;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const fileData = {
        name: name,
        file_name: file.name,
        file_body: base64,
        licence_id: licence_id,
        activity_id: licenceStore.licence.activity_id,
        doc_id: doc_id,
      };
      await licenceStore.fileUpload(fileData);
    }
  };

  getDocFiles = (doc_id) => {
    return licenceStore.attachments.filter(f => f.docId === doc_id && f.activity_id === this.props.licenceStore.licence.activity_id);
  };


  render() {

    const {licenseData: licence, readOnly, activities, attachments} = licenceStore;

    // const activityDocs = adminStore.activityDocs.filter(ad => ad.activity_id === licence.activity_id);
    let activityDocs = [];
    if (licence.activity && activities?.length) {
      let activity = activities.find(a => a.id == licence.activity.id);
      if (activity) {
        let docIds = activity.docIds;
        // debugger
        activityDocs = docIds.map(id =>
          adminStore.activityDocs.find(d => d.id == id && d.status === true)
        )
        // debugger
      }
    }

    return (
      <Col sm={12} md={12} lg={12} xs={24}>
        <Card title='Документы' size="small">

          <Form {...formItemLayout}>
            <Form.Item label={'Вид деятельности'}>
              <AntSelect onChange={this.onActivityChange}
                         placeholder={'Выберите'}
                         value={licence.activity?.id}
                         disabled={readOnly}>
                {licenceStore.activities.map(l =>
                  <AntSelect.Option key={l.id} value={l.id}>{l.name}</AntSelect.Option>
                )}
              </AntSelect>
            </Form.Item>
          </Form>

          {/*<JsonView data={activityDocs} name="activityDocs"/>*/}
          {/*<JsonView data={attachments} name="attachments"/>*/}

          {activityDocs.map(ad => {
            if (!ad)
              return null;

            return (
              <div key={ad.id}>
                <Divider type={'horizontal'}/>
                <div>
                  <b>{ad.name}</b>
                </div>

                <FilesList docId={ad.id} readOnly={readOnly}/>

              </div>
            )
          })}
        </Card>
      </Col>
    )
  }
}
