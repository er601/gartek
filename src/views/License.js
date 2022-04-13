import React from 'react';
import {inject, observer} from "mobx-react";
import licenceStore from "../store/LicenceStore";
import {Card, Col, Form, Row, Spin, Typography, Divider, Modal, Input as AntInput} from "antd";
import Button from "../components/Button";
import Input from "../components/Input";
import DatePicker from "../components/DatePicker";
import appStore from "../store/AppStore";
import {withRouter} from "react-router-dom";
import {MainFileUpload} from "../components/license/MainDocs";
import {LicenceInfo} from "../components/license/LicenceInfo";
import {DocsList} from "../components/license/DocsList";
import {BankRequisites} from "../components/license/BankRequisites";
import adminStore from "../store/AdminStore";
import {DeactivateLicense} from "../components/license/DeactivateLicense";
import {OrgInfo} from "../components/license/OrgInfo";
import {observable} from "mobx";
import {OrgInnForm} from "../components/license/OrgInnForm";
import moment from 'moment';

@withRouter
@inject('licenceStore', 'appStore')
@observer
export default class License extends React.Component {

  @observable inn = '';
  @observable id = null;

  constructor(props) {
    super(props);
    this.state = {
      deactiv: false,
      dispOrgInfo: false,
      declineModal: false,
      declineText: ''
    };
    this.id = null;
  }

  async componentDidMount() {
    // if (isDevMode()) {
    //   // 01307199510054
    //   this.inn = '00708201710169';
    // }
    if (appStore.isAdmin) {
      await adminStore.createLog({
        action: 'Перешел на страницу просмотр лицензий | создание'
      });
    }

    // adminStore.getActivities().then(r => this.setState({activities: r}));
    await licenceStore.getActivities();
    await adminStore.getActivityDocs();

    await this.getLicense()
  }

  componentDidUpdate() {
    // let id = this.props.match?.params?.id;
    this.getLicense()
  }

  // async componentDidUpdate() {
  //   // let id = this.props.match?.params?.id;
  //   if (!!this.props.match?.params?.id) {
  //     await this.getLicense()
  //   }
  // }

  async getLicense(force) {
    let id = this.props.match?.params?.id || null;
    let inn = this.props.match?.params?.tin || '';

    if (id) {
      if (id !== this.id || force) {
        this.id = id;

        licenceStore.init();
        if (id !== 'new') {
          await licenceStore.getLicense(id);
          await Promise.all([
            licenceStore.getAttachments(),
            licenceStore.checkOwner(),
          ])

          if (licenceStore.isOwner && this.props.location.search?.includes('edit')) {
            licenceStore.setReadOnly(false)
          }
        }

        if (appStore.isAdmin) {
          licenceStore.setReadOnly(false)
        }
      }
    } else if (inn) {
      // debugger
      if (inn !== this.inn) {
        this.inn = inn;
        // load
        let orgData = await adminStore.getCompanyInfo(inn);
        // debugger
        licenceStore.setLicence({
          ...orgData,
          firstOrderDate: orgData.firstOrderDate ? moment(orgData.firstOrderDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
          status: 0,
        })
      }
    } else {
      // redirect?
      this.id = null;
      // this.inn = '';
    }
  }

  componentWillUnmount() {
    this.props.licenceStore.init();
  }

  showDeactivHandler = async () => {
    this.setState({deactiv: !this.state.deactiv});
    if (appStore.isAdmin) {
      await adminStore.createLog({
        action: 'Нажал Изменить Статус Лицензии при создании лицензии id - ' + licenceStore.licenseData?.id
      })
    }

  }

  hideDeactivHandler =()=>{
    this.setState({deactiv: !this.state.deactiv});
  }


  createLicense = async () => {
    await licenceStore.applicationStart()
    let id = licenceStore.licenseData?.id;
    if (appStore.isAdmin) {
      await adminStore.createLog({
        action: 'Нажал на кнопку далее, при подачи заявки. licence id - ' +  id
      });
    }
    if (id) {
      this.props.history.replace(`/license/${id}?edit`)
    }

  }

  cancelDecline = () => {
    this.setState({
      declineModal: false,
      declineText: ''
    });
  };

  sendDecline = async () => {
    try {
      await adminStore.declineLicence(this.id, this.state.declineText);
      this.setState({
        declineModal: false,
        declineText: ''
      });
      appStore.setAlert('success', 'Успешно отклонено');
      this.props.history.push('/');
    } catch (e) {
      console.error(e);
      appStore.setAlert('error', 'Не удалось отклонить, попробуйте еще раз');
    }
  };

  approveLicence = async () => {
    try {
      await adminStore.approveLicence(this.id);
      appStore.setAlert('success', 'Успешно одобрено');
      this.props.history.push('/');
    } catch (e) {
      console.error(e);
      appStore.setAlert('error', 'Не удалось одобрить, попробуйте еще раз');
    }
  };

  render() {

    let id = this.id;
    let inn = this.inn;
    let {licenseData} = licenceStore
    // let licences

    if ((!id || id === 'new') && !inn) {
      return <OrgInnForm/>
    }

    if (!licenseData)
      return <Spin/>;


    // const {user} = appStore
    // let canEdit = appStore.isAdmin || (user?.id === licence.userId);
    let {isOwner} = licenceStore;
    let canEdit = appStore.isAdmin || isOwner;

    // const title = licence.seriesNumbLicense ? licence.series_numb_license : '';
    const title = (id && id !== 'new' && licenseData.status !== 1) ? 'Просмотр лицензии' : 'Подать заявку';

    return (
      <div>
        <Typography.Title level={3}>
          {title}
        </Typography.Title>

        <Row gutter={[12, 12]}>
          {canEdit && licenceStore.readOnly && <Col>
            <Button onClick={() => licenceStore.setReadOnly(false)}>Изменить</Button>
          </Col>}

          <OrgInfo/>

          {!licenseData.id && <>
            <Divider/>

            <Button disabled={!licenseData.tin} onClick={this.createLicense}>
              Далее
            </Button>
          </>}

          {licenseData.status > 0 &&
          <>
            {!licenceStore.readOnly &&
            <>
              <BankRequisites/>
              <MainFileUpload/>
              <DocsList/>
            </>
            }

            <LicenceInfo showDeactiv={this.showDeactivHandler}/>

            <DeactivateLicense hideDeactivHandler={this.hideDeactivHandler} showIt={this.state.deactiv} onDeactivate={() => this.getLicense(true)}/>
            {licenseData.status === 30 &&
            <TerminateInfo licence={licenseData}/>
            }
            <RenewInfo licence={licenseData}/>
            <SuspendInfo licence={licenseData}/>
            <ResumeInfo licence={licenseData}/>
            <DuplicateInfo licence={licenseData}/>

            {
              appStore.isAdmin && licenceStore.licenseData?.status === 10 && //На расмотрении
              <>
                <Col sm={24} md={24} lg={24} xs={24}>
                  <Row justify="space-between">
                    <Col span={12} className="margin-top-15">
                      <Button onClick={() => this.setState({declineModal: true})}>Отказать</Button>
                    </Col>
                    <Col offset={8} span={4} className="text-right margin-top-15">
                      <Button onClick={this.approveLicence}>Одобрить</Button>
                    </Col>
                  </Row>
                </Col>
                <Modal
                  cancelText='Назад'
                  okText="Отказать"
                  title="Причина отказа"
                  visible={this.state.declineModal}
                  onCancel={this.cancelDecline}
                  onOk={this.sendDecline}
                >
                  <AntInput.TextArea
                    placeholder="Напишите причину отказа"
                    value={this.state.declineText}
                    onChange={e => this.setState({declineText: e.target.value})}
                    rows={4}
                  />
                </Modal>
              </>
            }
          </>
          }
        </Row>
      </div>
    )
  }
}

const TerminateInfo = ({licence}) => (
  !!licence.dateTerminatLicense ?
    <Col sm={12} md={12} lg={12} xs={24}>
      <Card size={'small'} title={'Сведения о прекращении'}></Card>
    </Col>
    : null
);

const RenewInfo = ({licence}) => (
  !!licence.dateRenewedLicense ?
    <Col sm={12} md={12} lg={12} xs={24}>
      <Card size={'small'} title={'Сведения о переоформлении'}></Card>
    </Col>
    : null
);

const SuspendInfo = ({licence}) => (
  !!licence.license_suspen_date ?
    <Col sm={12} md={12} lg={12} xs={24}>
      <Card size={'small'} title={'Сведения о приостановлении'}></Card>
    </Col> : null
);

const ResumeInfo = ({licence}) => (
  !!licence.license_resump_date ?
    <Col sm={12} md={12} lg={12} xs={24}>
      <Card size={'small'} title={'Сведения о возобновлении'}></Card>
    </Col> : null
);

const DuplicateInfo = ({licence}) => (
  !!licence.license_duplic_issue_date ?
    <Col sm={12} md={12} lg={12} xs={24}>
      <Card size={'small'} title={'Сведения о выдачи дубликата'}></Card>
    </Col> : null
);

export const PV = ({label, model, name, date, disabled, notVisible, value, onChange, type}) => (
  !notVisible ?
    <Form.Item label={label}>
      {date ? <DatePicker model={model} name={name} disabled={disabled} value={value}/> :
        <Input model={model} name={name} disabled={disabled} value={value} onChange={onChange} type={type}/>}
    </Form.Item> : null
);

