import React from "react";
import Table from "./Table"
import {dateFormat} from "../common/utils";
import {Link} from "react-router-dom";
import Button from "./Button";
import {Icon, Input} from "antd";
// import JsonView from "./JsonView";

const translation = {
  tin: 'ИНН',
  id: 'ID',
  shortNameOl: 'наименовании лицензиата',
  status_name: 'статусу',
  licenseIssueDate: 'дате выдачи',
  applicationDate: 'дате подачи',
};

const LicenseListTable = ({data, title, isOwner}) => {
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Поиск по  ${translation[dataIndex]}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => confirm()}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      if (record[dataIndex]) {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      } else {
        return null;
      }
    },
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      width: 75,
      ...getColumnSearchProps('id'),
    },
    {
      title: 'ИНН',
      dataIndex: 'tin',
      width: 140,
      sorter: (a, b) => ('' + a?.tin).localeCompare(b?.tin),
      ...getColumnSearchProps('tin'),
    },
    {
      title: 'Наименование Лицензиата',
      dataIndex: 'shortNameOl',
      sorter: (a, b) => ('' + a?.shortNameOl).localeCompare(b?.shortNameOl),
      ...getColumnSearchProps('shortNameOl'),
    },
    {
      title: 'Вид деятельности',
      dataIndex: 'activity',
      render: (v, row) => <span title={row.activity_id}>{row?.activity?.name}</span>,
      sorter: (a, b) => ('' + a?.activity?.name).localeCompare(b?.activity?.name),

      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder='Поиск по видам деятельности'
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (record?.activity?.name) {
          return record?.activity?.name
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        } else {
          return null;
        }
      },
    },
    // {
    //   title: 'Статус',
    //   dataIndex: 'status_name',
    //   width: 120,
    //   render: (v, row) => <span title={row.status_id}>{v}</span>
    // },
    {
      title: 'Статус',
      dataIndex: 'status_name',
      sorter: (a, b) => ('' + a?.status_name).localeCompare(b?.status_name),
      width: 120,
      ...getColumnSearchProps('status_name'),
    },
    {
      title: 'Дата выдачи',
      dataIndex: 'licenseIssueDate',
      render: val => dateFormat(val),
      sorter: (a, b) => ('' + a?.licenseIssueDate).localeCompare(b?.licenseIssueDate),
      width: 110,
      ...getColumnSearchProps('licenseIssueDate'),
    },
    {
      title: 'Дата подачи',
      dataIndex: 'applicationDate',
      sorter: (a, b) => ('' + a?.applicationDate).localeCompare(b?.applicationDate),
      render: val => dateFormat(val),
      width: 110,
      ...getColumnSearchProps('applicationDate'),
    },
    {
      key: 'actions',
      dataIndex: 'id',
      width: 60,
      render: id =>
        <Link to={`/license/${id}`} type="default">
          <Button icon={'file-text'} outline size="small" />
        </Link>
    }
    /*{
      dataIndex: 'id',
      key: 'action',
      render: (text, record) => (
        <div style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Tooltip title="Просмотр">
            <Button icon={'file-text'} size={'small'} outline onClick={() => {
              this.setState({showLicence: true});
              licenceStore.setReadOnly(true);
              licenceStore.setLicence(record);
            }}/>
          </Tooltip>
          {appStore.user && appStore.user?.role === constants.ROLE_ADMIN &&
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
    },*/
  ];

  return (<>
    {/*<JsonView data={columns}/>*/}
    <Table
      scroll={{x: 1000, y: 1500}}
      // onChange={this.getData}
      columns={columns}
      data={data}
      title={() => title}
      pagination={{
        showSizeChanger: true
      }}
    />
  </>)
}

export default LicenseListTable;
