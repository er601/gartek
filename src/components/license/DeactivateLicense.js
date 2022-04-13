import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import React from "react";
import { fileToBase64 } from "../../common/utils";
import licenceStore from "../../store/LicenceStore";
import { Card, Tabs, Col, Divider, Form } from "antd";
import Button from "../Button";
import { PV } from "../../views/License";
import FilesList from "./FilesList";
import moment from "moment";
import appStore from "../../store/AppStore";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@inject("licenceStore")
@observer
export class DeactivateLicense extends React.Component {
  licTermOrd;
  @observable deactivateData = {};

  onChange = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const fileData = {
        name: "Приказ о прекращении лицензии",
        file_name: file.name,
        file_body: base64,
        licence_id: licenceStore.licence.id,
        doc_id: 4,
      };
      await licenceStore.fileUpload(fileData);
    }
  };

  onDeactivate() {
    licenceStore.licence.license_terminat_order = this.licTermOrd;
    licenceStore.deactivateLicense();
  }

  onSuspended = async () => {
    // let data = this.deactivateData;
    //
    // await licenceStore.suspendLicense({
    //   ...data,
    //   licenceId: licenceStore.licenseData.id,
    //   orderDate: moment(data.orderDate).utc().format(),
    //   suspendDate: moment(data.suspendDate).utc().format(),
    // })
    // appStore.setAlert('success', 'Успешно приостановлена');
    // this.props.onDeactivate()
    this.props.hideDeactivHandler()
  }

  render() {
    const { licenceStore, showIt } = this.props;
    const { licenseData: licence, readOnly } = licenceStore;
    const { deactivateData } = this;

    const DeactForm = (
      <Col sm={24} md={24} lg={24} xs={24}>
        <Tabs>
          <Tabs.TabPane key={"1"} tab="Прекращение">
            <Card size={"small"} title={"Прекращение Лицензии"}>
              <Form {...formItemLayout}>
                <Form.Item label={"Приказ о прекращении лицензии"}>
                  <FilesList docId={2} readOnly={readOnly} />
                </Form.Item>

                <PV
                  label="Дата приказа о прекращении лицензии"
                  model={licence}
                  name={"dateTerminatLicense"}
                  date
                />
                <PV
                  label="Регистрационный Номер приказа о прекращении лицензии"
                  model={licence}
                  name={"licenseTerminatOrder"}
                />
                <PV
                  label="Основание для прекращения лицензии"
                  type={"textarea"}
                  model={licence}
                  name={"groundTerminatLicense"}
                />
              </Form>
              <Divider />
              <Button
                type={"danger"}
                style={{ float: "right" }}
                size={"large"}
                icon={"retweet"}
                onClick={() => {
                  (licence.dateTerminatLicense = ""),
                    (licence.licenseTerminatOrder = ""),
                    (licence.groundTerminatLicense = "");
                }}
              >
                Очистить Форму
              </Button>

              <Button
                size={"large"}
                style={{ float: "right" }}
                icon={"save"}
                onClick={this.onDeactivate.bind(this)}
                disabled={
                !licence.dateTerminatLicense ||
                !licence.licenseTerminatOrder ||
                !licence.groundTerminatLicense
                }
              >
                Сохранить Изменения
              </Button>
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane key={"2"} tab="Приостановление">
            <Card size={"small"} title={"Сведения о приостановлении лицензии"}>
              <Form {...formItemLayout}>
                <Form.Item label={"Приказ о приостановлении лицензии"}>
                  <FilesList docId={1001} readOnly={readOnly} />
                </Form.Item>

                <PV
                  label="Дата приостановлении лицензии"
                  model={deactivateData}
                  name={"suspendDate"}
                  date
                />
                <PV
                  label="Срок приостановлении лицензии"
                  type={"textarea"}
                  model={deactivateData}
                  name={""}
                />
                <PV
                  label="Дата приказа о приостановлении лицензии"
                  model={deactivateData}
                  name={"orderDate"}
                  date
                />
                <PV
                  label="Регистрационный Номер приказа о приостановлении"
                  type={"textarea"}
                  model={deactivateData}
                  name={"registerNumber"}
                />
                <PV
                  label="Основание для приостановлении лицензии"
                  type={"textarea"}
                  model={deactivateData}
                  name={"reason"}
                />
              </Form>
              <Divider />
              <Button
                type={"danger"}
                style={{ float: "right" }}
                size={"large"}
                icon={"retweet"}
                onClick={() => {
                  (deactivateData.suspendDate = ""),
                    (deactivateData.orderDate = "");
                    (deactivateData.registerNumber = "");
                    (deactivateData.reason = "");
                }}
              >
                Очистить Форму
              </Button>

              <Button
                size={"large"}
                style={{ float: "right" }}
                icon={"save"}
                onClick={this.onSuspended.bind(this)}
                disabled={
                !deactivateData.suspendDate ||
                !deactivateData.orderDate ||
                !deactivateData.registerNumber ||
                !deactivateData.reason
                }
              >
                Сохранить Изменения
              </Button>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Col>
    );

    return !readOnly && showIt ? DeactForm : null;
  }
}
