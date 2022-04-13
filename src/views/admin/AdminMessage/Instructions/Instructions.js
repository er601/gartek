import React, {useEffect, useState} from 'react';
import Button from "../../../../components/Button";
import ReactTable from "../../../../components/ReactTable";
import TableActions from "../../../../components/TableActions";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ConfirmButton} from "../../../../components/ButtonConfirm";
import {useHistory} from "react-router-dom";
import adminStore from "../../../../store/AdminStore";
import appStore from "../../../../store/AppStore";


const Instructions = () => {
  const history = useHistory();
  const [state, setState] = useState([]);

  const fetchData = async () => {
    try {
      const res = await appStore.getInstructions();
      setState(res);
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };

  useEffect(() => {
    fetchData().then(() => {
      adminStore.createLog({
        action: 'Перешел на Сообщения/Инструкции'
      });
    });
  }, []);

  const delInstruction = async id => {
    await adminStore.deleteInstruction(id);
    await fetchData();
    await adminStore.createLog({
      action: 'Удалил инструкцию ' + id
    });
  };

  const columns = [
    {
      Header: 'Наименование',
      accessor: 'title',
      headerClassName: 'f-bold',
      className: 'text-left',
      minWidth: 200,
      Cell: ({value, row}) => (
        <div
          style={{color: "blue", cursor: "pointer"}}
          onClick={() => history.push('/instruction/' + row.id)}
        >
          {value}
        </div>
      )
    },
    {
      Header: "Дата добавления",
      accessor: 'date',
      headerClassName: 'f-bold',
      className: 'text-center'
    },
    {
      Header: "Файл",
      accessor: 'fileDownloadUrl',
      className: 'text-center',
      headerClassName: 'f-bold',
      Cell: ({value}) => {
        if (!!value) {
          const fileUrl = value.substring(1);
          return <a target="_blank" href={appStore.getUrl() + fileUrl}>Скачать в виде документа</a>
        } else {
          return <div>Нету файла</div>
        }
      }
    },
    {
      width: 80,
      accessor: 'id',
      Cell: ({value, row}) => <>
        <TableActions>
          <Button
            size="small"
            title="Изменить"
            onClick={() => history.push('/admin/edit/instruction/' + value)}
          >
            <EditOutlined />
          </Button>
          <ConfirmButton
            size="small"
            title="Удалить"
            onConfirm={() => delInstruction(value)}
          >
            <DeleteOutlined />
          </ConfirmButton>
        </TableActions>
      </>
    },
  ];

  return (
    <div>
      <div className="adm-tab-title">
        <h3>Инструкции</h3>
        <Button onClick={() => history.push('create/instruction')}>Добавить</Button>
      </div>
      <ReactTable
        columns={columns}
        defaultPageSize={10}
        showPagination={false}
        data={state}
      />
    </div>
  );
};

export default Instructions;
