import React from "react";
import {Upload, message, Card, Col, Collapse, Row, Tabs, Space, Result, Input,
  Divider, Tooltip, Form, Alert, Icon, Select as AntSelect } from "antd";
import Table from "../components/Table";
import Button, {ConfirmButton} from "../components/Button";
import {useHistory} from "react-router-dom";
import {NumericInput} from "../components/Input";
import licenceStore from "../store/LicenceStore";
import {dateFormat, fileToBase64} from "../common/utils";
import constants from "../common/constants";
import * as PropTypes from "prop-types";
import Select from "../components/Select";
import InputFiles from "react-input-files";

const {Panel} = Collapse;
const {Search} = Input;
const dataSource = [
  {
    key: '1',
    name: '1',
    blanck: '005',
    date: '21.05.2008',
    num: '356',
    year: 2008,
    name_license: "ОсОО “Энергосила”",
    address: "г.Бишкек ул.",
    period: "Бессрочная",
    kind: "Продажа эл/энергии",
    status: "Действует",
  },
];

const columns = [
  {
    title: '№ п/п',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '№ бланка ',
    dataIndex: 'blanck',
    key: 'blanck',
  },
  {
    title: 'Дата приказа',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '№ приказа',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: 'Год',
    dataIndex: 'year',
    key: 'year',
  },
  {
    title: 'Наименование лицензиата',
    dataIndex: 'name_license',
    key: 'name_license',
  },
  {
    title: 'Адрес',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Срок действия',
    dataIndex: 'period',
    key: 'period',
  },
  {
    title: 'Вид деятельности',
    dataIndex: 'kind',
    key: 'kind',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
  },
];

export default class Licenses extends React.Component {
  render() {
    // const {goBack} = useHistory()
    const {history} = this.props;


    return <>
      <Card style={{flex: 1, height: 500}}>
        <Tabs>
          <Tabs.TabPane key={'1'} tab='Действующие'>
            <Table style={{marginTop: 15}}
                   columns={columns}
                   data={dataSource}/>
          </Tabs.TabPane>
          <Tabs.TabPane key={'2'} tab='Проекты'>
            <Table style={{marginTop: 15, width: 500}}
                   columns={columns.slice(0, 4)}
                   data={dataSource}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={'3'} tab='На рассмотрении'>
            <Table style={{marginTop: 15, width: 600}}
                   columns={columns.slice(0, 5)}
                   data={dataSource}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={'4'} tab='Отклоненные'>
            <Table style={{marginTop: 15, width: 800}}
                   columns={columns.slice(0, 7)}
                   data={dataSource}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={'5'} tab='Прекращенные'>
            <Table style={{marginTop: 15, width: 800}}
                   columns={columns.slice(0, 6)}
                   data={dataSource}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={'6'} tab='Подача заявления'>
            <Col xs={24} sm={22} md={18} lg={18}>
              <Row style={{marginBottom: 15}}>
                <Col md={12}>
                  <Search
                    placeholder="ИНН"
                    allowClear
                    model={licenceStore}
                    maxLength={14}
                    enterButton="Search"
                    size="large"
                    onSearch='fun'
                    name={'inn'}
                  />
                </Col>
              </Row>
              <Collapse accordion>
                <Panel header={'Сведения об организации'}
                >
                  {<OrgInfo licenceStore={licenceStore}/>}
                </Panel>
                <Panel header={'Банковские реквизиты'}
                       extra={
                         <Button type='link'
                                 onClick={() => {
                                 }}>
                           Очистить форму
                         </Button>}>
                  {<BankRequisites/>}
                </Panel>
                <Panel header={'Наименование документа'}>
                  {<MainFileUpload/>}
                </Panel>
                <Panel header={'Загрузите сканированную копию Свидетельства о регистрации'}>
                  {<CategoryFileUpload/>}
                </Panel>
                <Panel header={'Загрузите сканированную копию Устава организации'}>
                  <Button size={'small'} style={{margin: 10, float: 'right'}}
                  >
                    Далее
                  </Button>
                </Panel>
              </Collapse>
              <Button size={'small'} style={{marginTop: 15}}
                      onClick={() => {
                        history.goBack('')
                      }}>Назад</Button>
              <Button size={'small'} style={{margin: '15px 10px'}}
                      onClick={() => {
                        history.push('/')
                      }}>Выйти </Button>

              <Button size={'small'} style={{marginTop: '15px', float: 'right'}}
                      onClick={() => {
                      }}>Подать Заявление</Button>
            </Col>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </>
  }
}

class BankRequisites extends React.Component {

  componentDidMount() {
  }

  render() {
    // const {licenceStore} = this.props;

    const columns2 = [
      {
        key: 'bank',
        title: 'Банк',
        dataIndex: 'bankName',
        // render: (text, record) => record.bank.name
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
        // render: (text, record) => record.currency.name
      },
      {
        dataIndex: 'id',
        key: 'action',
        render: (
          // text,
          // record
        ) => (
          <div style={{width: 65}}>
            <Tooltip title="Изменить">
              <Button icon={'edit'} size={'small'} outline
                // onClick={() => licenceStore.setAccount(record)}
              />
            </Tooltip>
            <Divider type='vertical'/>
            <Tooltip title="Удалить">
              <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline
                //                onConfirm={() => {
                //   licenceStore.removeAccount(record);
                // }}
              />
            </Tooltip>
          </div>
        ),
      },
    ];

    // const {account} = licenceStore;
    return (
      <div>
        <Select
          // options={licenceStore.banks}
          placeholder="Выберите банк из списка"
          clearable={false}
          labelKey="name"
          valueKey="id"
          // value={account && account.bank}
          // onChange={(bank) => {
          //   licenceStore.setAccountBank(bank)
          // }}
        />
        <Form.Item>
          <Input placeholder={'Введите расчетный счет'}
            // model={account}
                 name={'account_number'}/>
        </Form.Item>
        <Form.Item>
          <Input placeholder={'Введите БИК'}
            // model={account}
                 name={'bic'}/>
        </Form.Item>
        <Form.Item>
          <Input placeholder={'Введите владельца счета'}
            // model={account}
                 name={'name'}/>
        </Form.Item>
        <Select
          // options={licenceStore.currencies}
          placeholder='Введите валюту счета'
          clearable={false}
          searchable={false}
          labelKey="name"
          valueKey="id"
          // value={account && account.currency}
          // onChange={(currency) => {
          //   licenceStore.setAccountCurrency(currency)
          // }}
        />

        <Table style={{marginTop: 15}}
               columns={columns2}
          // data={licenceStore.accounts}
               pagination={false}
               title={() => <div>
                 <span>Счета</span>
                 <Tooltip title="Обновить список счетов">
                   <Button size={'small'} icon={'reload'}
                           style={{float: 'right'}}
                     // onClick={() => licenceStore.getAccountList()}
                   />
                 </Tooltip>
               </div>}
        />

      </div>
    )
  }
}

class MainFileUpload extends React.Component {

  componentDidMount() {

  }

  render() {
    const props = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
      defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          url: 'http://www.baidu.com/xxx.png',
        },
      ],
    };

    const columns3 = [
      {
        key: 'file_name',
        title: 'Наименование банка',
        dataIndex: 'file_name',
      },
      {
        key: 'created_date',
        title: 'Расчетный счет',
        dataIndex: 'created_date',
        // render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        key: 'created_date',
        title: 'БИК',
        dataIndex: 'created_date',
        // render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        key: 'created_date',
        title: 'Владелец счета',
        dataIndex: 'created_date',
        // render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        key: 'created_date',
        title: 'Валюта счета',
        dataIndex: 'created_date',
        // render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        key: 'created_date',
        title: 'Время загрузки',
        dataIndex: 'created_date',
      },
      {
        key: 'created_date',
        title: 'Загруженный файл',
        dataIndex: 'created_date',
      },
      {
        key: 'created_date',
        title: 'Действие',
        dataIndex: 'created_date',
      },
      {
        dataIndex: 'id',
        key: 'id',
        width: 30,
        // render: (text, record) => (
        //   <div>
        //     <Tooltip title="Удалить">
        //       <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline onConfirm={() => {
        //         licenceStore.deleteAttachment(record.id);
        //       }}/>
        //     </Tooltip>
        //   </div>
        // ),
      },
    ];

    return (
      <>
        <div>
          <Row>
            <Col md={6}>Наименвание документа
              <Upload {...props}>
                <Button style={{marginTop: '15px', marginBottom: '10px'}} size={'small'} icon='upload'>Upload</Button>
              </Upload>,
              {/*<Button style={{marginTop: '15px', marginBottom: '10px'}} size={'small'}*/}
              {/*  // disabled={!!!this.state[`${ad.id}name`]}*/}
              {/*>*/}
              {/*  <Icon type="upload"/>*/}
              {/*  Загрузите файл*/}
              {/*</Button>*/}
            </Col>
            <Col md={18}>
              <Input placeholder='Выписка реквизитов банка'/>
            </Col>
            <Col>
              <Table columns={columns3}
                     pagination={false}
                     style={{marginTop: 15}}/>
            </Col>
            <Button size={'small'} style={{float: 'right', marginTop: '10px'}} >Далее</Button>
          </Row>
        </div>
      </>
    )
  }
}

class SuccessAlert extends React.Component {
  render() {
    return <>
      <Result
        status="success"
        title="Уважаемый Пользователь! "
        style={{width: '500px'}}
        subTitle="После отправки он-лайн подачи ЗАЯВЛЕНИЯна рассмотрение, изменить ЗАЯВЛЕНИЕ не
представляется возможным.
Настоящим Вы подтверждаете что все данные
введенные Вами являются достоверными
и актуальными на момент подачи
ЗАЯВЛЕНИЯ.

Если Ваше ЗАЯВЛЕНИЕ отклонят, то оплаченная Вами государственная пошлина не подлежит возврату, и последующая подача оплачивается отдельно."
        extra={[
          <Button type="primary" key="console">ОТМЕНИТЬ</Button>,
          <Button key="buy" style={{marginLeft: '30px'}}>ПОДАТЬ</Button>
        ]}
      />
    </>
  }
}

class CategoryFileUpload extends React.Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {activity_id: 0, activities: []};
  // }

  componentDidMount() {
    // this.props.adminStore.getActivities().then(r => this.setState({activities: r.data}));
    // this.props.adminStore.getActivityDocs();
    // this.props.licenceStore.getAttachments();
  }

  // onActivityChange = (activity_id) => {
  //   this.setState({activity_id});
  // };

  // onChange = async (files, name, doc_id,) => {
  //   const {licenceStore} = this.props;
  //
  //   // const activity = this.state.activities.find(a => a.id === this.state.activity_id);
  //   const licence_id = licenceStore.licence.id;
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const base64 = await fileToBase64(file);
  //     const fileData = {
  //       name: name,
  //       file_name: file.name,
  //       file_body: base64,
  //       licence_id: licence_id,
  //       activity_id: this.state.activity_id,
  //       doc_id: doc_id,
  //     };
  //     await licenceStore.fileUpload(fileData);
  //   }
  // };

  // getDocFiles = (doc_id) => {
  //   return this.props.licenceStore.attachments.filter(f => f.doc_id === doc_id && f.activity_id === this.state.activity_id);
  // };


  render() {
    // const {licenceStore, adminStore} = this.props;

    // const activityDocs = adminStore.activityDocs.filter(ad => ad.activity_id === this.state.activity_id);

    const columns1 = [
      {
        key: 'file_name',
        title: 'Наименвание файла',
        dataIndex: 'file_name',
        // render: (text, record) => <FileLink id={record.attachment_id} fileName={text}/>
      },
      {
        key: 'name',
        title: 'Время загрузки',
        dataIndex: 'name',
      },
      {
        key: 'created_date',
        title: 'Загруженный файл',
        dataIndex: 'created_date',
        // render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        key: 'created_date',
        title: 'Действие',
        dataIndex: 'created_date',
        // render: (text, record) => <div>{dateFormat(text)}</div>
      },
      {
        dataIndex: 'id',
        key: 'id',
        width: 100,
        // render: (text, record) => (
        //   <Tooltip title="Удалить">
        //     <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline onConfirm={() => {
        //       licenceStore.deleteAttachment(record.id);
        //     }}/>
        //   </Tooltip>
        // ),
      },
    ];

    return (
      <>
        <div>
          <Row>
            <Col md={6}>Наименвание документа
              <Button style={{marginTop: '15px', marginBottom: '10px'}} size={'small'}
                // disabled={!!!this.state[`${ad.id}name`]}
              >
                <Icon type="upload"/>
                Загрузите файл
              </Button>
            </Col>
            <Col md={18}>
              <Input placeholder='Свидетельство о регистрации юридического лица'/>
            </Col>
            <Col>
              <Table columns={columns1}
                     pagination={false}
                     style={{marginTop: 15}}/>
            </Col>
            <Button size={'small'} style={{float: 'right', marginTop: '10px'}}>Далее</Button>
          </Row>
        </div>
      </>
    )
  }
}

const OrgData = ({label, value}) => (
  // value !== undefined && value !== null && value !== '' ?
  <div>
    <Row>
      <Col xs={24} sm={24} md={12}><span>{label}:</span></Col>
      {/*<Col xs={24} sm={24} md={12}><strong>{value}</strong></Col>*/}
    </Row>
    <Divider dashed/>
  </div>
  // : null
);

//{licenceStore}
const OrgInfo = () => {
  // const {orgData, licence} = licenceStore;
  return (
    <>
      <OrgData label={'Полное наименование на гос языке'}/>
      <OrgData label='Сокращенное наименование на гос языке'/>
      <OrgData label='Полное наименование на официальном языке'/>
      <OrgData label='Сокращенное наименование на официальном языке'/>
      <OrgData label='регистрационный номер'/>
      <OrgData label='инн руководителя'/>
      <OrgData label='форма собственности'/>
      <OrgData label='окпо'/>
      <OrgData label='область'/>
      <OrgData label='город'/>
      <OrgData label='район'/>
      <OrgData label='село'/>
      <OrgData label='микрайон'/>
      <OrgData label='улица'/>
      <OrgData label='дом'/>
      <OrgData label='квартира'/>
      <OrgData label='телефон'/>
      <OrgData label='почта'/>
      <OrgData label='почта 2'/>
      <OrgData label='дата приказа'/>
      <OrgData label='Дата первичной регистрации (при перерегистрации)'
      />
      <OrgData label='Основной вид деятельности'/>
      <OrgData label='Код экономической деятельности'/>
      <OrgData label='Количество учредителей физических лиц'/>
      <OrgData label='Количество учредителей юридических лиц'/>
      <OrgData label='Общее количество учредителей'/>
      {/*{licence.status === constants.LICENCE_STATUS_NOT_STARTED &&*/}
      {/*<Button icon='arrow-right' disabled={!orgData} onClick={() => licenceStore.applicationStart()}>Далее</Button>*/}

    </>
  )
}