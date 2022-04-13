import React from "react";
import {fileToBase64} from "../../common/utils";
import {Card, Col, Row} from "antd";
import {inject, observer} from "mobx-react";
import FilesList from "./FilesList";

@inject('licenceStore')
@observer
export class MainFileUpload extends React.Component {

  fileName;
  doc_id;

  componentDidMount() {
    // this.props.licenceStore.getAttachments();
  }

  onChange = async (files) => {
    const {licenceStore} = this.props;
    const licence_id = licenceStore.licence.id;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const fileData = {
        name: this.fileName,
        file_name: file.name,
        file_body: base64,
        licence_id: licence_id,
        doc_id: this.doc_id,
      };
      await licenceStore.fileUpload(fileData);
    }
  };

  render() {
    const {licenceStore} = this.props;
    const {readOnly} = licenceStore;

    return (
      <Col sm={12} md={12} lg={12} xs={24}>
        <Card title='Основные документы' size="small">

          <Row style={{marginBottom: 15}}>
            <Col>
              <h4>Свидетельство о регистрации</h4>
              <FilesList docId={-1} readOnly={readOnly} showDocName={false}/>
            </Col>
          </Row>

          <Row>
            <Col>
            <h4>Устав организации</h4>
              <FilesList docId={-2} readOnly={readOnly} showDocName={false}/>
            </Col>
          </Row>
        </Card>
      </Col>
    )
  }
}