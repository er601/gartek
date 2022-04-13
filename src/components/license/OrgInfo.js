import {Observer} from "mobx-react";
import {Card, Col, Form} from "antd";
import React from "react";
import {PV} from "../../views/License";
import {useHistory} from "react-router-dom";
import licenceStore from "../../store/LicenceStore";
import {dateFormat} from "../../common/utils";
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

export const OrgInfo = () => {
  const history = useHistory();
  let {licenseData: licence} = licenceStore;

  let licenseData = {
    ...licence,
    foreignPart: licence?.foreignPart ? 'Да' : 'Нет',
    ownership: parseInt(licence?.ownership) === 1 ? "Частная" : "Государственная",
    orderDate: licence.orderDate ? dateFormat(licence.orderDate): null,
    firstOrderDate: licence.firstOrderDate ? dateFormat(licence.firstOrderDate): null,
  };

  return (
    <Observer>{() => (
      <Col sm={24} md={24} lg={24} xs={24}>
        <Card size="default" title='Сведения об организации'>

          {/*<JsonView data={licenseData} name="licenseData"/>*/}

          <Form {...formItemLayout}>
            <PV label="Полное наименование на гос языке" model={licenseData} name="fullNameGl" disabled/>
            <PV label="Сокращенное наименование на гос языке" model={licenseData} name="shortNameGl" disabled/>
            <PV label="Полное наименование на официальном языке" model={licenseData} name="fullNameOl" disabled/>
            <PV label="Сокращенное наименование на официальном языке" model={licenseData} name="shortNameOl"
                disabled/>
            <PV label="Есть ли иностранное участие" model={licenseData} name="foreignPart" disabled/>
            <PV label="Регистрационный номер" model={licenseData} name="registrCode" disabled/>
            <PV label="ПИН руководителя" model={licenseData} name="chiefTin" disabled/>
            <PV label="ИНН организации" model={licenseData} name="tin" disabled/>
            <PV label="Форма собственности" model={licenseData} name="ownership" disabled/>

            {/* hide? */}
            <PV label="ОКПО" model={licenseData} name="statSubCode" disabled/>
            <PV label="Область" model={licenseData} name="region" disabled/>
            <PV label="Город" model={licenseData} name="city" disabled/>
            <PV label="Район" model={licenseData} name="district" disabled/>
            <PV label="Село" model={licenseData} name="village" disabled/>
            <PV label="Микрайон" model={licenseData} name="microdistrict" disabled/>
            <PV label="Улица" model={licenseData} name="street" disabled/>
            <PV label="Дом" model={licenseData} name="house" disabled/>
            <PV label="Квартира" model={licenseData} name="room" disabled/>
            <PV label="Телефон" model={licenseData} name="phones" disabled/>
            <PV label="Почта" model={licenseData} name="email1" disabled/>
            <PV label="Почта 2" model={licenseData} name="email2" disabled/>
            <PV label="Дата приказа" model={licenseData} name="orderDate" disabled/>
            <PV label="Дата первичной регистрации (при перерегистрации)1"
                model={licenseData} name="firstOrderDate"
                disabled/>
            <PV label="Основной вид деятельности" model={licenseData} name="baseBus" disabled/>
            <PV label="Код экономической деятельности" model={licenseData} name="baseBusCode" disabled/>
            <PV label="Количество учредителей физических лиц" model={licenseData} name="indFounders" disabled/>
            <PV label="Количество учредителей юридических лиц" model={licenseData} name="jurFounders" disabled/>
            <PV label="Общее количество учредителей" model={licenseData} name="totalFounders" disabled/>
          </Form>

        </Card>
      </Col>
    )}</Observer>
  )
};

/*const OrgInfo = observer(({licenceStore, dispOrgInfoHand}) => {
  const {licence, readOnly} = licenceStore;
  return (
    <Col sm={24} md={24} lg={24} xs={24}>
      <Card size="default" title='Сведения об организации'
            extra={<Button hidden={readOnly} disabled={readOnly} style={{float: 'right'}}
                           onClick={() => {
                             licenceStore.init();
                             dispOrgInfoHand()
                           }}>Новое заявление</Button>}>
        <Form {...formItemLayout}>
          <PV label='Полное наименование на гос языке' model={licence} name='fullNameGl' disabled={true}
              notVisible={!licence.fullNameGl && readOnly}/>
          <PV label='Сокращенное наименование на гос языке' model={licence} name='shortNameGl' disabled={readOnly}
              notVisible={!licence.shortNameGl && readOnly}/>
          <PV label='Полное наименование на официальном языке' model={licence} name='fullNameOl' disabled={readOnly}
              notVisible={!licence.fullNameOl && readOnly}/>
          <PV label='Сокращенное наименование на официальном языке' model={licence} name='shortNameOl'
              disabled={readOnly} notVisible={!licence.shortNameOl && readOnly}/>
          <PV label='Есть ли иностранное участие' model={licence} name='foreignPart' disabled={readOnly}
              notVisible={readOnly}/>
          <PV label='Регистрационный номер' model={licence} name={'registrCode'} disabled={readOnly}
              notVisible={!licence.registrCode && readOnly}/>
          <PV label='ПИН руководителя' model={licence} name={'chiefTin'} disabled={readOnly} notVisible={readOnly}/>
          <PV label='ИНН организации' model={licence} name={'tin'} disabled={true}
              notVisible={!licence.tin && readOnly}/>
          <PV label='Форма собственности' model={licence} name={'ownership'} disabled={readOnly}
              notVisible={!licence.ownership && readOnly}/>
          {!readOnly && <>
            <PV label='ОКПО' model={licence} name={'statSubCode'} disabled={readOnly}/>
            <PV label='Область' model={licence} name={'region'} disabled={readOnly}/>
            <PV label='Город' model={licence} name={'city'} disabled={readOnly}/>
            <PV label='Район' model={licence} name={'district'} disabled={readOnly}/>
            <PV label='Село' model={licence} name={'village'} disabled={readOnly}/>
            <PV label='Микрайон' model={licence} name={'microdistrict'} disabled={readOnly}/>
            <PV label='Улица' model={licence} name={'street'} disabled={readOnly}/>
            <PV label='Дом' model={licence} name={'house'} disabled={readOnly}/>
            <PV label='Квартира' model={licence} name={'room'} disabled={readOnly}/>
            <PV label='Телефон' model={licence} name={'phones'} disabled={readOnly}/>
            <PV label='Почта' model={licence} name={'email1'} disabled={readOnly}/>
            <PV label='Почта 2' model={licence} name={'email2'} disabled={readOnly}/>
            <PV label='Дата приказа' model={licence} name={'orderDate'} date disabled={readOnly}/>
          </>
          }
          <PV label='Дата первичной регистрации (при перерегистрации)' model={licence} name={'firstOrderDate'} date
              disabled={readOnly} notVisible={!licence.firstOrderDate && readOnly}/>
          <PV label='Основной вид деятельности' model={licence} name={'baseBus'} disabled={readOnly}
              notVisible={!licence.baseBus && readOnly}/>
          <PV label='Код экономической деятельности' model={licence} name={'baseBusCode'} disabled={readOnly}
              notVisible={!licence.baseBusCode && readOnly}/>
          <PV label='Количество учредителей физических лиц' model={licence} name={'indFounders'} disabled={readOnly}
              notVisible={!licence.indFounders && readOnly}/>
          <PV label='Количество учредителей юридических лиц' model={licence} name={'jurFounders'} disabled={readOnly}
              notVisible={!licence.jurFounders && readOnly}/>
          <PV label='Общее количество учредителей' model={licence} name={'totalFounders'} disabled={readOnly}
              notVisible={!licence.totalFounders && readOnly}/>
        </Form>
        <Divider/>
        {!licence.id &&
          <Button
            disabled={!licence.tin}
            onClick={() => {
              licenceStore.orgData = {}; //temporary
              licenceStore.applicationStart()
            }}>Далее</Button>
        }
      </Card>
    </Col>
  )
});*/
