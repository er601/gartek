import {inject, observer} from "mobx-react";
import React from "react";
import {Card, Col, Divider, Form, Tooltip} from "antd";
import Button, {ConfirmButton} from "../Button";
import Select from "../Select";
import Input from "../Input";
import Table from "../Table";

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
export class BankRequisites extends React.Component {

    componentDidMount() {
        const {licenceStore} = this.props;
        if (!licenceStore.readOnly) {
            licenceStore.getBanks();
            licenceStore.getCurrencies();
        }
        licenceStore.getAccountList();
    }

    render() {
        const {licenceStore} = this.props;
        const {account, readOnly} = licenceStore;

        // 'zzz'
        // licenceStore.accounts
        // debugger

        // "accountNumber": "string",
        // "licenceId": 0,
        // "bankId": 0,
        // "currencyId": 0,
        // "name": "string",
        // "bic": "string"

        const columns = [
            {
                key: 'bank',
                title: 'Банк',
                dataIndex: 'bankName',
                render: (text, record) => record.bank.name
            },
            {
                key: 'accountNumber',
                title: 'Счет',
                dataIndex: 'accountNumber',
            },
            {
                key: 'bic',
                title: 'Бик',
                dataIndex: 'bic',
            },
            {
                key: 'name',
                title: 'Владелец счета',
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
                    !readOnly &&
                    <div style={{width: 65}}>
                        <Tooltip title="Изменить">
                            <Button icon={'edit'} size={'small'} outline
                                    onClick={() => licenceStore.setAccount(record)}/>
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

        return (
            <Col sm={12} md={12} lg={12} xs={24}>
                <Card size="small" title='Реквизиты банка'>
                    {!readOnly && <>
                        <Form {...formItemLayout}>
                            <Form.Item label={'Выберите банк'}>
                                <Select options={licenceStore.banks}
                                        clearable={false}
                                        labelKey="name"
                                        valueKey="id"
                                        value={account && account.bank}
                                        onChange={(bank) => {
                                            licenceStore.setAccountBank(bank)
                                        }}/>
                            </Form.Item>

                            <Form.Item label={'Введите расчетный счет'}>
                                <Input model={account} name={'accountNumber'}/>
                            </Form.Item>

                            <Form.Item label={'Введите БИК'}>
                                <Input model={account} name={'bic'}/>
                            </Form.Item>

                            <Form.Item label={'Введите владельца счета'}>
                                <Input model={account} name={'name'}/>
                            </Form.Item>

                            <Form.Item label={'Введите валюту счета'}>
                                <Select options={licenceStore.currencies}
                                        clearable={false}
                                        searchable={false}
                                        labelKey="name"
                                        valueKey="id"
                                        value={account && account.currency}
                                        onChange={(currency) => {
                                            licenceStore.setAccountCurrency(currency)
                                        }}/>
                            </Form.Item>
                        </Form>

                        <Button style={{marginTop: 15}}
                                block
                                disabled={!licenceStore.canAddAccount}
                                onClick={() => {
                                    licenceStore.saveAccount();
                                }}
                        >
                            Добавить/Изменить
                        </Button>
                    </>
                    }

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
                </Card>
            </Col>
        )
    }
}