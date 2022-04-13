import React from 'react'
import ReactTable from "../components/ReactTable";








const Instruction = () => {



  const columns = [
    {
      Header: 'Наименование',
      accessor: 'title',
      headerClassName: 'f-bold',
      className: 'text-left',
      minWidth: 200,
      Cell: ({value}) => (
        <div
          style={{color: "blue", cursor: "pointer"}}
        >
          {value}
        </div>
      )
    },
    {
      Header: "Тип",
      accessor: 'type',
      headerClassName: 'f-bold',
      className: 'text-center',
      Cell: ({value}) => {
        if (value === 'PURCHASER') {
          return 'Закупщик'
        } else if (value === 'SUPPLIER') {
          return 'Поставщик'
        } else {
          return null
        }
      }
    },
    {
      Header: "Дата добавления",
      accessor: 'date',
      headerClassName: 'f-bold',
      className: 'text-center'
    },
    {
      Header: "Файл",
      accessor: 'file',
      className: 'text-center',
      headerClassName: 'f-bold',
      Cell: ({value}) => {
        if (!!value) {
          return <a target="_blank">Скачать в виде документа</a>
        } else {
          return <div>Нету файла</div>
        }
      }
    }
  ]



  return (
    <>
      <div className="adm-tab-title">
        <h3>Инструкции</h3>
      </div>
      <ReactTable
        columns={columns}
        defaultPageSize={50}
      />

    </>
  )
}

export default Instruction;