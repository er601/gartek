import React from 'react';
import {NumericInput} from "../Input";
import Button from "../Button";
import licenceStore from "../../store/LicenceStore";
import {Form, Typography} from "antd";
import {observable} from "mobx";
import {observer} from "mobx-react";
import LicenseListTable from "../LicenseListTable";
import {Link} from "react-router-dom";
// import JsonView from "../JsonView";


@observer
export class OrgInnForm extends React.Component {
  @observable inn = '';

  searchInn = async e => {
    e.preventDefault();

    await licenceStore.checkInn(this.inn);
  }

  render() {
    let {licences, orgData, inn} = licenceStore
    return (<>
      <div>
        {/*<JsonView data={{inn, orgData, licences}}/>*/}

        <Typography.Title level={3}>
          Поиск организации
        </Typography.Title>

        <Form layout="inline" onSubmit={this.searchInn}>
          <Form.Item label="Введите ИНН организации" layout="inline">
            <NumericInput
              placeholder="14 цифр"
              maxLength={14}
              value={this.inn}
              onChange={inn => this.inn = inn}
            />
          </Form.Item>

          <Form.Item>
            <Button icon="search" htmlType="submit" disabled={this.inn.length !== 14}>
              Поиск
            </Button>
          </Form.Item>
        </Form>

        {orgData && <>
          <Typography.Title level={4}>
            {orgData.fullNameGl}
          </Typography.Title>

          {licences && <div>
            <h4>
              Найдено лицензий: {licences.length}
            </h4>

            <LicenseListTable data={licences}/>
          </div>}

          <Button>
            <Link to={`/license/new/${this.inn}`}>
              Новая заявка
            </Link>
          </Button>
        </>}

      </div>
    </>)
  }
}