import React from "react";
import licenceStore from "../../store/LicenceStore";
import {fileToBase64} from "../../common/utils";
import Button from "../Button";
import {PV} from "../../views/License";
import {Card, Col, Divider, Form, notification, Select as AntSelect} from "antd";
import {inject, observer} from "mobx-react";
import adminStore from "../../store/AdminStore";
import FilesList from "./FilesList";
import appStore from "../../store/AppStore";
import constants from "../../common/constants";
// import JsonView from "../JsonView";

@inject('licenceStore')
@observer
export class LicenceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      licenseSerial: null,
      licenseTypeList: ['I ГАЭ', 'II ГАЭ', "I Госагентство ТЭК"],
      licenseType: null,

      licenseTermsList: [`Без ограничения срока`, 'Срочная'],
      licenseTerm: null,
      licenseTermEndDate: null
    }
  }

  componentWillMount() {
    // debugger
    const {licenseData: licence} = licenceStore;
    adminStore.getActivities().then(r => this.setState({activities: r}));
    if (licence.seriesNumbLicense) {
      let [seria, nomer] = licence.seriesNumbLicense.split(' № ');

      this.setState({
        licenseType: this.state.licenseTypeList.includes(seria) ? seria : this.state.licenseTypeList[0],
        licenseSerial: nomer,
      });
    }
    if (licence.licenseTerm) {
      /*this.setState({
        licenseTerm: licence.licenseTerm,
        licenseTermEndDate: licence.licenseTermEndDate
      })*/
      if (new Date(licence.licenseTerm)) {
        this.setState({licenseTermEndDate: licence.licenseTerm, licenseTerm: this.state.licenseTermsList[1]});
      } else {
        this.setState({licenseTerm: this.state.licenseTermsList[0]})
      }
    }
  }

  seriaSelectHandler = (val) => {
    this.setState({licenseType: val});
  };

  serNumInputHandler = (val) => {
    this.setState({licenseSerial: val});
  };

  licTermSelectHandler = (val) => {
    let license = this.props.licenceStore.licenseData;

    license.licenseTerm = val

    if (val !== 'Срочная') {
      license.dateTerminatLicense = null;
    }

    // val === this.state.licenseTermsList[0] ? this.setState({
    //   licenseTermEndDate: null,
    //   licenseTerm: val
    // }) : this.setState({licenseTerm: val});
  };

  licTermEndDateHandler = (val) => {
    this.setState({licenseTermEndDate: val});
  };

  showTermInfo = () => {
    return Date.parse(this.state.licenseTermEndDate) ? new Date(this.state.licenseTermEndDate).toLocaleDateString() : this.state.licenseTermsList[0]
  };

  onFormSubmit = async (licence) => {
    // debugger
    if (appStore.isAdmin) {
      await adminStore.createLog({
        action: 'Нажал кнопку сохранить licence id - ' + licence.id
      })
    }
    let {licenseType, licenseSerial} = this.state;

    // const {licences} = licenceStore;
    //
    // let found = licences.find(item => item.seriesNumbLicense === licenseType + ' № ' + licenseSerial && item.id !== licence.id);
    // if (found) {
    //   notification['error']({
    //     message: `Данная Лицензия уже зарегистрирована.`,
    //   });
    //   return false
    // }

    if (licenseType && licenseSerial && licenseSerial !== '') {
      // licence.seriesNumbLicense = licenseType + ' № ' + licenseSerial;
      // licence.licenseTerm = this.state.licenseTermEndDate ? this.state.licenseTermEndDate : this.state.licenseTerm;

      let seriesLicense = licenseType;
      let numberLicense = '№ ' + licenseSerial;

      // save!
      try {
        await licenceStore.saveLicense({seriesLicense, numberLicense});
        notification['success']({
          message: 'Успешно сохранено!',
        });

      } catch (e) {
        notification['error']({
          message: e.message,
        });
      }

    } else if (licenseType === null && licenseSerial !== null) {
      notification['error']({
        message: `Вам необходимо выбрать Серию лицензии`,
      });
      return false;
    } else if (licenseSerial === null && licenseType !== null || licenseSerial === '') {
      notification['error']({
        message: `Вам необходимо заполнить номер бланка лицензии`,
      });
      return false;
    } else {
      notification['error']({
        message: `Вам необходимо выбрать серию и ввести номер бланка лицензии`,
      });
      return false;
    }
  };

  onChange = async (files,) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const fileData = {
        name: 'Приказ о выдаче лицензии',
        file_name: file.name,
        file_body: base64,
        licence_id: this.props.licenceStore.licence.id,
        doc_id: -3,
      };
      await licenceStore.fileUpload(fileData);
    }
  };

  render() {
    const {licenceStore} = this.props;
    const {licenseData: licence, readOnly, isOwner} = licenceStore;
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

    let canSubmit = licence.status === constants.LICENCE_STATUS_NEW;
    let canEdit = appStore.isAdmin;
    let canChangeStatus = appStore.isAdmin &&
      [constants.LICENCE_STATUS_ACTIVE, constants.LICENCE_STATUS_INACTIVE].includes(licence.status);

    return (
      <Col sm={24} md={24} lg={24} xs={24}>
        <Card size={'small'} title={'Сведения о лицензии'}>

          {/*<JsonView data={licence}/>*/}
          {/*{licence.status}:*/}

          {/*<Divider/>*/}

          {isOwner && licence.status === 1 &&
            <Button onClick={async () => {
              let res = await licenceStore.submitLicense()
              await licenceStore.getLicense(licenceStore.licence.id)
              if (appStore.isAdmin) {
                await adminStore.createLog({
                  action: 'Нажал кнопку отправить на рассмотрение licence id - ' + licenceStore.licence?.id
                })
              }
            }}
            >
              Отправить на рассмотрение
            </Button>
          }

          {((licence.status >= 20) || canEdit) && <>

            <Form {...formItemLayout}>
              <Form.Item label={'Вид деятельности'}>
                <AntSelect value={licence.activity?.id}
                           disabled>
                  {this.state.activities?.map(l =>
                    <AntSelect.Option key={l.id} value={l.id}>{l.name}</AntSelect.Option>
                  )}
                </AntSelect>
              </Form.Item>

              <PV label='Территория действия лицензии' model={licence} name={'licenseTerrit'}
                  disabled={readOnly}
                  // notVisible={!licence.licenseTerrit && readOnly}
                  // notVisible={!licence.licenseTerrit}
              />
              <PV label='Дата выдачи лицензии' model={licence} name={'licenseIssueDate'}
                  date disabled={readOnly}
                  // notVisible={!licence.licenseIssueDate && readOnly}
              />


              {!readOnly &&
                <>
                  <Form.Item label={'Срок действия лицензии'}>
                    <AntSelect onChange={this.licTermSelectHandler}
                               placeholder={'Выберите пожалуйста бес~/срочность'}
                               disabled={readOnly}
                               // defaultValue={this.state.licenseTerm || this.state.licenseTermsList[0]}
                               value={licence.licenseTerm || this.state.licenseTermsList[0]}
                    >
                      {this.state.licenseTermsList.map((item, index) =>
                        <AntSelect.Option key={index} value={item}>{item}</AntSelect.Option>
                      )}
                    </AntSelect>
                  </Form.Item>

                  {licence.licenseTerm === 'Срочная' &&
                    <>
                      {/*<Form.Item label={'Выберите дату окончания лицензии'}>
                        <DatePicker model={licence} onChange={this.licTermEndDateHandler.bind(this)}
                                    disabled={readOnly} value={this.state.licenseTermEndDate}/>
                      </Form.Item>*/}

                      <PV label="Дата окончания лицензии" model={licence} name={'dateTerminatLicense'}
                        date disabled={readOnly}
                        // notVisible={!licence.licenseIssueDate && readOnly}
                      />
                    </>
                  }
                </>
              }
              {readOnly &&
                <PV label='Срок действия лицензии' model={licence}
                    value={this.showTermInfo()}
                    disabled
                    // notVisible={!licence.licenseTerm && readOnly}
                />
              }

              <PV label='Регистрационный номер лицензии' model={licence} name={'licenseRegNumb'}
                  disabled={readOnly}
                  // notVisible={!licence.licenseRegNumb && readOnly}
              />
              {readOnly &&
                <PV label='Серия и номер бланка лицензии' model={licence}
                    name={'seriesNumbLicense'} disabled/>
              }

              <PV label='Номер приказа о выдачи лицензии' model={licence} name={'licenseOrderNumb'}
                  disabled={readOnly}
                  // notVisible={!licence.licenseOrderNumb && readOnly}
              />
              <PV label='Дата приказа о выдачи лицензии' model={licence} name={'dateOrderIssueLicense'} date
                  disabled={readOnly}
                  // notVisible={!licence.dateOrderIssueLicense && readOnly}
              />

              {/*{!readOnly &&*/}
                <>
                  <Form.Item label={'Серия бланка лицензии'}>
                    <AntSelect onChange={this.seriaSelectHandler}
                               placeholder={'Выберите пожалуйста серию бланка'}
                               disabled={readOnly}
                               defaultValue={this.state.licenseType}>
                      {this.state.licenseTypeList.map((item, index) =>
                        <AntSelect.Option key={index} value={item}>{item}</AntSelect.Option>
                      )}
                    </AntSelect>
                  </Form.Item>

                  <PV label='Номер бланка лицензии' model={licence} type='number'
                      disabled={readOnly}
                      onChange={this.serNumInputHandler.bind(this)} value={this.state.licenseSerial}
                      notVisible={!licence.licenseSerial && readOnly}/>
                </>
              {/*}*/}

              {/*{!readOnly &&*/}
                <Form.Item label={'Приказ о выдаче лицензии'}>
                  <FilesList docId={-3} readOnly={readOnly}/>

                  {/*{!readOnly &&
                    <InputFiles accept={'.pdf,.doc,.docx,.xls,.xlsx,image/*'} onChange={(files) => {
                      this.onChange(files).then(_ => {
                        licenceStore.getAttachments();
                      });
                    }}
                    >
                      <Button>
                        <Icon type="upload"/>
                        Загрузить
                      </Button>
                    </InputFiles>
                  }*/}

                  {/*{files.map(f => <div key={f.id}>
                    <FileLink id={f.attachment_id} fileName={f.file_name}/>
                    &nbsp;
                    &nbsp;
                    {!readOnly &&
                      <Tooltip title="Удалить">
                        <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline onConfirm={() => {
                          licenceStore.deleteAttachment(f.id);
                        }}/>
                      </Tooltip>
                    }
                  </div>)}*/}
                </Form.Item>
              {/*}*/}
            </Form>

          </>}



          {!readOnly && <>
            <Divider/>

            {canEdit &&
              <Button type="default"
                      onClick={() => this.onFormSubmit(licence)}
                      style={{marginRight: 10}}
              >
                Сохранить
              </Button>
            }

            {canSubmit &&
              <Button onClick={async () => {
                let res = await licenceStore.submitLicense()
                await licenceStore.getLicense(licenceStore.licence.id)
              }}>
                Отправить на рассмотрение
              </Button>
            }

            {canChangeStatus &&
              <Button type={'dashed'} style={{float: 'right'}} icon={'edit'}
                      onClick={this.props.showDeactiv}>Изменить Статус Лицензии</Button>
            }
          </>
          }
        </Card>
      </Col>
    )
  }
}
