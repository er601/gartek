import React from 'react';
import {Icon, Input, Modal, Tooltip} from 'antd';
import Highlighter from 'react-highlight-words';
import Table from "./Table";
import {dateFormat} from "../common/utils";
import {inject, observer} from "mobx-react";
import Button from "./Button";
import constants from "../common/constants";
import {withRouter} from "react-router-dom";
import License from "../views/License";
import adminStore from '../store/AdminStore'
import licenceStore from "../store/LicenceStore";
import LicenseListTable from "./LicenseListTable";
// import JsonView from "./JsonView";

@inject('licenceStore', 'appStore', 'adminStore')
@observer
class LicencesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      showLicence: false,
      loading: false,
      pagin: {
        current: 0,
        pageSize: 30,
        total: 0, // Total number of data items
      },
    };

    this.setPagin = newPagin => {
      this.setState({
        pagin: {
          ...this.state.pagin,
          ...newPagin,
        }
      })
    }
  }

  async componentDidMount() {
    this.getData();
  }

  getData = async () => {
    let {userId, statusId} = this.props;
    let param = {userId, statusId};

    this.setState({loading: true})
    let data = await licenceStore.getLicensesFilter(param)
    this.setState({loading: false, data})
  }

  getData1 = async (pagination = {}, filters, sorter) => {
    // debugger
    const {
      pageSize = this.state.pagin.pageSize,
      current = this.state.pagin.current
    } = pagination;

    this.setState({loading: true})

    try {
      this.setPagin({
        pageSize,
        current,
      })

      let res = await this.props.licenceStore.getLicences({
        page: current ? current - 1 : void 0,
        size: pageSize,
      });

      if (res) {
        let {page, size, totalElements, totalPages, content} = res;

        this.setPagin({
          pageSize: size,
          current: page + 1,
          total: totalElements
        });

      }
    } catch (e) {
      console.warn(e)
    }

    this.setState({loading: false})
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`поиск`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{width: 90, marginRight: 8}}
        >
          Поиск
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
          Сброс
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({searchText: ''});
  };

  render() {
    const {hideColumns, hideByStatus, title, onRefresh, onNew, licenceStore, appStore, history, onView,
      isOwner} = this.props;

    // TODO: hideByStatus 10, 20, 30
    // TODO: hideColumns

    // licenceStore.statuses.filter(s => s.id >= 10).map(l => statuses.push({text: l.name, value: l.name}));
    // licenceStore.activities.map(a => activities.push({text: a.name, value: a.name}));

    // const data = licenceStore.licences;
    const {data} = this.state;

    return <>
      {/*<JsonView data={data}/>*/}
      <LicenseListTable {...{data, title, isOwner}} />
    </>

    const columns = [
      {
        title: '№',
        dataIndex: 'id',
        // sorter: (a, b) => a.id - b.id,
        width: 50,
      },
      {
        title: 'ИНН',
        dataIndex: 'tin',
        // ...this.getColumnSearchProps('tin'),
        // sorter: (a, b) => (a.tin || '').localeCompare(b.tin || ''),
        width: 140,
      },
      {
        title: 'Наименование Лицензиата',
        dataIndex: 'shortNameOl',
        // ...this.getColumnSearchProps('shortNameOl'),
        // sorter: (a, b) => (a.shortNameOl || '').toLocaleLowerCase().localeCompare((b.shortNameOl || '').toLocaleLowerCase()),
      },
      {
        title: 'Вид деятельности1',
        dataIndex: ['activity', 'name'],
        // sorter: (a, b) => (a.activity_name || '').toLocaleLowerCase().localeCompare((b.activity_name || '').toLocaleLowerCase()),
        // filters: activities,
        // onFilter: (value, record) => record.activity_name === value,
        // render: (v, row) => <span title={row.activity_id}>{v}</span>
      },
      {
        title: 'Статус',
        dataIndex: 'status_name',
        // filters: statuses,
        // onFilter: (value, record) => record.status_name === value,
        width: 120,
        render: (v, row) => <span title={row.status_id}>{v}</span>
      },
      {
        title: 'Дата выдачи',
        dataIndex: 'licenseIssueDate',
        render: (text, record) => dateFormat(text),
        // sorter: (a, b) => moment(a.license_issue_date).diff(moment(b.license_issue_date)),
        width: 110,
        // onFilter: (value, record) => {
        //   return record.license_issue_date ? record.license_issue_date.slice(0, 4) === value : null;
        // },
      },
      {
        title: 'Дата подачи',
        dataIndex: 'applicationDate',
        render: (val, record) => dateFormat(val),
        // sorter: (a, b) => moment(a.applicate_date).diff(moment(b.applicate_date)),
        width: 100,
      },
      {
        dataIndex: 'id',
        render: (text, record) => (
          <div style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Tooltip title="Просмотр">
              <Button icon={'file-text'} size={'small'} outline onClick={() => {
                this.setState({showLicence: true});
                licenceStore.setReadOnly(true);
                licenceStore.setLicence(record);
              }}/>
            </Tooltip>
            {appStore.isAdmin &&
            <>
              &nbsp;
              &nbsp;
              <Tooltip title="Изменить">
                <Button icon={'edit'} size={'small'} outline onClick={() => {
                  licenceStore.setLicence(record);
                  history.push('/licence');
                }}/>
              </Tooltip>
            </>
            }
          </div>
        ),
        width: 70,
      },
    ];

    let cls = hideColumns ? columns.filter(c => !hideColumns.includes(c.key)) : columns;

    return (
      <>
        <Table
          // scroll={{x: 1000, y: 1500}}
          // title={
          //   <div style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          //     <Button type="link" onClick={this.getData}>
          //       Обновить
          //     </Button>
          //
          //     {!!onNew &&
          //     <Button onClick={onNew}>
          //       Создать
          //     </Button>}
          //   </div>
          // }
          /*onChange={this.getData}
          pagination={{
            ...this.state.pagin,
            position: 'both',
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50', '100', '150', '200'],
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
          }}*/
          loading={this.state.loading}
          columns={cls}
          data={data || []}
        />

        <Modal
          width="100%"
          visible={this.state.showLicence}
          header={null}
          footer={null}
          onCancel={() => {
            licenceStore.setReadOnly(false);
            this.setState({showLicence: false});
          }}
        >
          {this.state.showLicence &&
          <License/>
          }
        </Modal>
      </>
    )
  }
}

export default withRouter(LicencesList);
