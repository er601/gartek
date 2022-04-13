import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import ReactTable from "../../../components/ReactTable";
import appStore from "../../../store/AppStore";

const Instructions = () => {
  const [state, setState] = useState([]);
  const history = useHistory();

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
    fetchData();
  }, []);

  const columns = [
    {
      Header: "",
      accessor: 'id',
      width: 50,
      Cell: row => <div className="text-center">{row.viewIndex + 1}</div>
    },
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
  ];

  return (
    <div>
      <div className="adm-tab-title">
        <h3>Инструкции</h3>
      </div>
      <ReactTable
        columns={columns}
        defaultPageSize={10}
        showPagination={false}
        data={state}
        showRowNumbers={false}
      />
    </div>
  );
};

export default Instructions;
