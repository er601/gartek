import React from "react";
import {Affix, Col, Collapse, Divider, Form, Icon, Row, Select as AntSelect, Steps, Tooltip, Typography} from 'antd';
import Button, {ConfirmButton} from "../../components/Button";
import Input, {NumericInput} from "../../components/Input";
import {inject, observer} from "mobx-react";
import {dateFormat, fileToBase64, isDevMode} from "../../common/utils";
import Select from "../../components/Select";
import licenceStore from "../../store/LicenceStore";
import Table from "../../components/Table";
import InputFiles from 'react-input-files';
import constants from "../../common/constants";
import {BASE_URL} from "../../common/requester";

const {Step} = Steps;
const {Panel} = Collapse;

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

@inject('licenceStore')
@observer
export default class OrgProfile extends React.Component {

  componentDidMount() {
    // this.props.licenceStore.init();
    // if (isDevMode()) {
    //   this.props.licenceStore.inn = '00205199410037'
    // }
  }

  render() {
    const {licenceStore} = this.props;
    const {licence} = licenceStore;
    const {status} = licence;
    const title = licence && licence.id ? `Заявление ${licence && '№ ' + licence.id}` : 'Заявление';

    return (
      <>
        <Typography.Title level={2} className={'text-center'}>{title}</Typography.Title>
        <Divider/>
        <Row>
          <Col xs={24} sm={2} md={6} lg={6}>
            <Affix offsetTop={10}>
              <Steps direction="vertical" current={status}>
                <Step title={status === 0 ? 'В процессе' : 'Завершено'} description="Сведения об организации"/>
                <Step title={status === 1 ? 'В процессе' : status < 1 ? 'В ожидании' : 'Завершено'}
                      description="Реквизиты банка"/>
                <Step title={status === 1 ? 'В процессе' : status < 1 ? 'В ожидании' : 'Завершено'}
                      description="Загрузка основных документов"/>
                <Step title={status === 1 ? 'В процессе' : status < 1 ? 'В ожидании' : 'Завершено'}
                      description="Загрузка документов"/>
              </Steps>
            </Affix>
          </Col>

          <Col xs={24} sm={22} md={18} lg={18}>
            <Row style={{marginBottom: 15}}>
              <Col md={18}>
                <NumericInput
                  placeholder="ИНН"
                  size="large"
                  maxLength={14}
                  model={licenceStore}
                  name={'inn'}
                />
              </Col>
              <Col md={6}>
                <Button style={{float: 'right'}}
                        icon="search"
                        size={'large'}
                        disabled={licenceStore.inn.length !== 14}
                        onClick={() => licenceStore.checkInn()}
                >
                  Поиск
                </Button>
              </Col>
            </Row>

            <Collapse accordion>
              <Panel header={'Сведения об организации'} key={'1'} disabled={!licenceStore.orgData}>
                {!!licenceStore.orgData && <OrgInfo licenceStore={licenceStore}/>}
              </Panel>
              <Panel header={'Реквизиты банка'} key={'2'}
                     extra={status < 2 ? null :
                       <Button type='link'
                               onClick={(e) => {
                                 e.stopPropagation();
                                 licenceStore.setAccount({});
                               }}>
                         Очистить форму
                       </Button>}
                     disabled={status < 1}>
                {status > 0 && <BankRequisites/>}
              </Panel>
              <Panel header={'Загрузка основных документов'} key={'3'} disabled={status > 0}>
                {status >= 1 && <MainFileUpload/>}
              </Panel>
              <Panel header={'Загрузка документов'} key={'4'} disabled={status > 0}>
                {status >= 1 && <CategoryFileUpload/>}
              </Panel>
            </Collapse>
            <Button size={'large'} style={{marginTop: 15}} disabled={status > 0}
                    onClick={() => {
                      licenceStore.applicate();
                    }}
            >
              Подать заявление
            </Button>
          </Col>
        </Row>
      </>
    )
  }
}

const OrgInfo = ({licenceStore}) => {
  const {orgData, licence} = licenceStore;
  return (
    <>
      <OrgData label={'Полное наименование на гос языке'} value={orgData.fullNameGl}/>
      <OrgData label='Сокращенное наименование на гос языке' value={orgData.shortNameGl}/>
      <OrgData label='Полное наименование на официальном языке' value={orgData.fullNameOl}/>
      <OrgData label='Сокращенное наименование на официальном языке' value={orgData.shortNameOl}/>
      <OrgData label='регистрационный номер' value={orgData.registrCode}/>
      <OrgData label='инн руководителя' value={orgData.chiefTin}/>
      <OrgData label='форма собственности' value={orgData.ownership}/>
      <OrgData label='окпо' value={orgData.statSubCode}/>
      <OrgData label='область' value={orgData.region}/>
      <OrgData label='город' value={orgData.city}/>
      <OrgData label='район' value={orgData.district}/>
      <OrgData label='село' value={orgData.village}/>
      <OrgData label='микрайон' value={orgData.microdistrict}/>
      <OrgData label='улица' value={orgData.street}/>
      <OrgData label='дом' value={orgData.house}/>
      <OrgData label='квартира' value={orgData.room}/>
      <OrgData label='телефон' value={orgData.phones}/>
      <OrgData label='почта' value={orgData.email1}/>
      <OrgData label='почта 2' value={orgData.email2}/>
      <OrgData label='Дата приказа' value={orgData.orderDate ? dateFormat(orgData.orderDate) : null}/>
      <OrgData label='Дата первичной регистрации (при перерегистрации)'
               value={orgData.firstOrderDate ? dateFormat(orgData.firstOrderDate) : null}/>
      <OrgData label='Основной вид деятельности' value={orgData.baseBus}/>
      <OrgData label='Код экономической деятельности' value={orgData.baseBusCode}/>
      <OrgData label='Количество учредителей физических лиц' value={orgData.indFounders}/>
      <OrgData label='Количество учредителей юридических лиц' value={orgData.jurFounders}/>
      <OrgData label='Общее количество учредителей' value={orgData.totalFounders}/>
      {licence.status === constants.LICENCE_STATUS_NOT_STARTED &&
      <Button icon='arrow-right' disabled={!orgData} onClick={() => licenceStore.applicationStart()}>Далее</Button>
      }
    </>
  )
};

@inject('licenceStore')
@observer
class BankRequisites extends React.Component {

  componentDidMount() {
    const {licenceStore} = this.props;
    licenceStore.getBanks();
    licenceStore.getCurrencies();
    licenceStore.getAccountList();
  }

  render() {
    const {licenceStore} = this.props;

    const columns = [
      {
        key: 'bank',
        title: 'Банк',
        dataIndex: 'bankName',
        render: (text, record) => record.bank.name
      },
      {
        key: 'account_number',
        title: 'Счет',
        dataIndex: 'account_number',
      },
      {
        key: 'bic',
        title: 'Бик',
        dataIndex: 'bic',
      },
      {
        key: 'name',
        title: 'Наименвание',
        dataIndex: 'name',
      },
      {
        key: 'currency',
        title: 'Валюта',
        dataIndex: 'currency',
        render: (text, record) => record.currency.name
      },
      {
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <div style={{width: 65}}>
            <Tooltip title="Изменить">
              <Button icon={'edit'} size={'small'} outline onClick={() => licenceStore.setAccount(record)}/>
            </Tooltip>
            <Divider type='vertical'/>
            <Tooltip title="Удалить">
              <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline onConfirm={() => {
                licenceStore.removeAccount(record);
              }}/>
            </Tooltip>
          </div>
        ),
      },
    ];

    const {account} = licenceStore;
    return (
      <div>
        <Select options={licenceStore.banks}
                placeholder="Выберите банк"
                clearable={false}
                labelKey="name"
                valueKey="id"
                value={account && account.bank}
                onChange={(bank) => {
                  licenceStore.setAccountBank(bank)
                }}/>
        <Form.Item>
          <Input placeholder={'Введите расчетный счет'} model={account} name={'account_number'}/>
        </Form.Item>
        <Form.Item>
          <Input placeholder={'Введите БИК'} model={account} name={'bic'}/>
        </Form.Item>
        <Form.Item>
          <Input placeholder={'Введите владельца счета'} model={account} name={'name'}/>
        </Form.Item>
        <Select options={licenceStore.currencies}
                placeholder='Введите валюту счета'
                clearable={false}
                searchable={false}
                labelKey="name"
                valueKey="id"
                value={account && account.currency}
                onChange={(currency) => {
                  licenceStore.setAccountCurrency(currency)
                }}/>

        <Button style={{marginTop: 15}}
                block
                disabled={!licenceStore.canAddAccount}
                onClick={() => {
                  licenceStore.saveAccount();
                }}
        >
          Добавить/Изменить
        </Button>

        <Table style={{marginTop: 15}}
               columns={columns}
               data={licenceStore.accounts}
               pagination={false}
               title={() => <div>
                 <span>Счета</span>
                 <Tooltip title="Обновить список счетов">
                   <Button size={'small'} icon={'reload'}
                           style={{float: 'right'}}
                           onClick={() => licenceStore.getAccountList()}/>
                 </Tooltip>
               </div>}
        />

        {/*<Form.Item>*/}
          {/*<Button icon='save' onClick={() => licenceStore.saveAccounts()}>Сохранить</Button>*/}
        {/*</Form.Item>*/}
      </div>
    )
  }
}

@inject('licenceStore')
@observer
class MainFileUpload extends React.Component {

  fileName;
  doc_id;

  componentDidMount() {
    this.props.licenceStore.getAttachments();
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
    const filesReg = licenceStore.attachments.filter(f => f.doc_id === -1);
    const filesUst = licenceStore.attachments.filter(f => f.doc_id === -2);

    const columns = [
      {
        key: 'file_name',
        title: 'Наименование',
        dataIndex: 'file_name',
        render: (text, record) => <FileLink id={record.attachment_id} fileName={text}/>
      },
      {
        key: 'created_date',
        title: 'Дата загрузки',
        dataIndex: 'created_date',
        render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        dataIndex: 'id',
        key: 'id',
        width: 30,
        render: (text, record) => (
          <div>
            <Tooltip title="Удалить">
              <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline onConfirm={() => {
                licenceStore.deleteAttachment(record.id);
              }}/>
            </Tooltip>
          </div>
        ),
      },
    ];

    return (
      <>
        <Row gutter={[12, 12]}>
          <Col md={11}>
            <InputFiles multiple accept={'.pdf,.doc,.docx,.xls,.xlsx,image/*'} onChange={(files) => {
              this.fileName = 'Свидетельства о регистрации';
              this.doc_id = -1;
              this.onChange(files).then(_ => licenceStore.getAttachments());
            }}
            >
              <Button>
                <Icon type="upload"/>
                Загрузить Свидетельство о регистрации
              </Button>
            </InputFiles>

            <Table columns={columns} data={filesReg} bordered={false} pagination={false} showHeader={false}
                   style={{marginTop: 15}}/>
          </Col>

          <Col md={11} style={{marginLeft: 15}}>
            <InputFiles multiple accept={'.pdf,.doc,.docx,.xls,.xlsx,image/*'} onChange={(files) => {
              this.fileName = 'Устав организации';
              this.doc_id = -2;
              this.onChange(files).then(_ => licenceStore.getAttachments());
            }}>
              <Button>
                <Icon type="upload"/>
                Загрузить Устав организации
              </Button>
            </InputFiles>

            <Table columns={columns} data={filesUst} bordered={false} pagination={false} showHeader={false}
                   style={{marginTop: 15}}/>
          </Col>
        </Row>
      </>
    )
  }
}

@inject('licenceStore', 'adminStore')
@observer
class CategoryFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {activity_id: 0, activities: []};
  }

  componentDidMount() {
    this.props.adminStore.getActivities().then(r => this.setState({activities: r}));
    this.props.adminStore.getActivityDocs();
    this.props.licenceStore.getAttachments();
  }

  onActivityChange = (activity_id) => {
    this.setState({activity_id});
  };

  onChange = async (files, name, doc_id,) => {
    const {licenceStore} = this.props;

    // const activity = this.state.activities.find(a => a.id === this.state.activity_id);
    const licence_id = licenceStore.licence.id;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const fileData = {
        name: name,
        file_name: file.name,
        file_body: base64,
        licence_id: licence_id,
        activity_id: this.state.activity_id,
        doc_id: doc_id,
      };
      await licenceStore.fileUpload(fileData);
    }
  };

  getDocFiles = (doc_id) => {
    return this.props.licenceStore.attachments.filter(f => f.doc_id === doc_id && f.activity_id === this.state.activity_id);
  };


  render() {
    const {licenceStore, adminStore} = this.props;

    const activityDocs = adminStore.activityDocs.filter(ad => ad.activity_id === this.state.activity_id);

    const columns = [
      {
        key: 'file_name',
        title: 'Наименвание файла',
        dataIndex: 'file_name',
        render: (text, record) => <FileLink id={record.attachment_id} fileName={text}/>
      },
      {
        key: 'name',
        title: 'Наименвание документа',
        dataIndex: 'name',
      },
      {
        key: 'created_date',
        title: 'Дата загрузки',
        dataIndex: 'created_date',
        render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text, record) => (
          <Tooltip title="Удалить">
            <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline onConfirm={() => {
              licenceStore.deleteAttachment(record.id);
            }}/>
          </Tooltip>
        ),
      },
    ];

    return (
      <>
        <Form {...formItemLayout}>
          <Form.Item label={'Вид деятельности'}>
            <AntSelect onChange={this.onActivityChange} placeholder={'Выберите'}>
              {this.state.activities.filter(lc => lc.status).map(l =>
                <AntSelect.Option key={l.id} value={l.id}>{l.name}</AntSelect.Option>
              )}
            </AntSelect>
          </Form.Item>
        </Form>

        {activityDocs.map(ad =>
          <div key={ad.id}>
            <Divider><h1>{ad.doc_name}</h1></Divider>
            <Row>
              <Col md={6}>Наименвание документа</Col>
              <Col md={14}>
                <Input value={this.state[`${ad.id}name`] || ''}
                       onChange={(value) => this.setState({[`${ad.id}name`]: value})}/>
              </Col>
              <Col md={4}>
                <InputFiles multiple accept={'.pdf,.doc,.docx,.xls,.xlsx,image/*'} onChange={(files) => {
                  this.onChange(files, this.state[`${ad.id}name`], ad.doc_id).then(_ => {
                    licenceStore.getAttachments();
                    this.setState({[`${ad.id}name`]: ''});
                  });
                }}
                >
                  <Button disabled={!!!this.state[`${ad.id}name`]}>
                    <Icon type="upload"/>
                    Загрузить
                  </Button>
                </InputFiles>
              </Col>
            </Row>
            <Table columns={columns}
                   dontShowTableWhenEmpty
                   data={this.getDocFiles(ad.doc_id)}
                   pagination={false}
                   style={{marginTop: 15}}/>
          </div>)}
      </>
    )
  }
}


const OrgData = ({label, value}) => (
  value !== undefined && value !== null && value !== '' ?
    <div>
      <Row>
        <Col xs={24} sm={24} md={12}><span>{label}:</span></Col>
        <Col xs={24} sm={24} md={12}><strong>{value}</strong></Col>
      </Row>
      <Divider dashed/>
    </div> : null
);

const FileLink = ({id, fileName}) => {
  if (!fileName) return null;
  const ar = fileName.split('.');
  if (ar.length < 2) return null;
  const ext = ar[1].substring(0, 3);
  const url = `${BASE_URL}file/doc/${id}`;
  return <div>
    <span className={`fiv-sqo fiv-icon-${ext}`}/>
    &nbsp;&nbsp;<a href={url}>{fileName}</a>
  </div>
};
