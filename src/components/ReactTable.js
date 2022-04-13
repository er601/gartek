import React from 'react';
import RT from 'react-table';
import 'react-table/react-table.css';
import {MdArrowBack, MdArrowForward} from 'react-icons/md';

const translations = {
  previousText: <MdArrowBack size="1.6em"/>,
  nextText: <MdArrowForward size="1.6em"/>,
  loadingText: 'ЗАГРУЗКА...',
  rowsText: 'шт',
  pageText: 'Стр.',
  ofText: 'из',
  noDataText: 'Нет данных',
};

export default ({columns, data, sortable, filterable, pageSize, onClick, showRowNumbers, ...rest}) => {

  let c = [];
  if (showRowNumbers === undefined || showRowNumbers) {
    c.push({
      Header: "",
      width: 50,
      Cell: row => <div className="text-center">{row.viewIndex + 1}</div>
    });
  }

  c.push(...columns || []);

  return (
    <RT
      {...translations}
      defaultFilterMethod={(filter, row) =>
        String(row[filter.id]).toLocaleLowerCase().includes(filter.value.toLocaleLowerCase())}
      data={data || []}
      columns={c || []}
      defaultPageSize={pageSize || 25}
      pageSize={pageSize}
      className="-striped -highlight"
      sortable={sortable === undefined ? true : sortable}
      filterable={filterable === undefined ? true : filterable}
      getTdProps={(state, rowInfo, column, instance) => ({
        onClick: (e, handleOriginal) => {
          if (column.expander)
            handleOriginal();

          else if (onClick && rowInfo) {
            onClick(rowInfo.row._original, column, handleOriginal);
          }
        }
      })}

      {...rest}
    />
  )
}
