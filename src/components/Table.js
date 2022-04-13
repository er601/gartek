import React from "react"
import {Table as AntTable} from "antd";
import {observer} from "mobx-react";

const Table = ({columns, data, loading, bordered, dontShowTableWhenEmpty, ...rest}) => {
    if ((!data || data.length === 0) && dontShowTableWhenEmpty) return null;
    return (
      <AntTable
        columns={columns}
        dataSource={data}
        size='small'
        bordered={bordered === undefined ? true : bordered}
        loading={loading}
        rowKey={record => record.id}
        {...rest}
      />
    )
  }
;

export default observer(Table);
