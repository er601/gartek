import React, {useEffect, useState} from 'react';
import {Card, Modal} from "antd";
import ReactTable from "../../../components/ReactTable";
import adminStore from "../../../store/AdminStore";
import appStore from "../../../store/AppStore";


const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: -1,
    totalPages: -1,
    last: false
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
      headerClassName: 'f-bold',
      className: 'text-left',
      width: 100,
    },
    {
      Header: "ФИО",
      accessor: 'userFullName',
      headerClassName: 'f-bold',
      className: 'text-center'
    },
    {
      Header: "Дата входа",
      accessor: 'createdDate',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    {
      Header: "Действие",
      accessor: 'action',
      className: 'text-center',
      headerClassName: 'f-bold',
      Cell: ({value, original}) => (
        <span
          onClick={() => setModal(original)}
          style={{color: 'blue', cursor: "pointer"}}
        >
        {value}
      </span>
      )
    },
  ];

  useEffect(() => {
    const getLogs = async () => {
      try {
        setLoading(true);
        const arr = [];
        for (let i = 0; i < pagination.page * pagination.size; i++) {
          arr.push(0); // filling trash (react-table problem)
        }
        const res = await adminStore.getLogs({
          page: pagination.page,
          size: pagination.size
        });
        setLogs([...arr, ...res.content]);
        delete res.content;
        setPagination(res);

        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
        appStore.setAlert('error', 'Ошибка при получении данных с сервера');
      }
    };

    getLogs();
  }, [pagination.page, pagination.size]);

  useEffect(() => {
    adminStore.createLog({
      action: 'Перешел на страницу Логи'
    });
  }, []);

  return (
    <Card
      title="Логи"
    >
      <ReactTable
        columns={columns}
        defaultPageSize={pagination.size}
        data={logs}
        onPageChange={page => {
          setPagination({
            ...pagination,
            page
          });
        }}
        onPageSizeChange={size => {
          setPagination({
            ...pagination,
            size
          });
        }}
        loading={loading}
        pages={pagination.totalPages}
        page={pagination.page}
        pageSizeOptions={[5, 10, 20, 25, 50]}
        sortable={false}
        filterable={false}
      />

      <Modal
        title={modal?.userFullName}
        visible={!!modal}
        width={600}
        destroyOnClose
        onCancel={() => setModal(null)}
        maskClosable
        footer={false}
      >
        <div className="text-center">
          {modal?.action}
        </div>
      </Modal>
    </Card>
  );
};

export default Logs;
