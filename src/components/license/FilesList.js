import React from "react";
import licenceStore from "../../store/LicenceStore";
import {dateFormat} from "../../common/utils";
import {ConfirmButton} from "../Button";
import Table from "../Table";
import {observer} from "mobx-react";
import FileUpload from "./FileUpload";
import {FileLink} from "./FileLink";

const FilesList = ({docId, readOnly, btnTitle, showDocName = true}) => {
  const files = docId ? licenceStore.attachments.filter(f => f.docId === docId) : licenceStore.attachments;
  console.log('files', docId, files, licenceStore.attachments)

  // if (!files || !files.length)
  //   return null;

  const columns = [
    {
      title: 'Наименование файла',
      dataIndex: ['file', 'fileName'],
      render: (text, record) => <FileLink record={record}/>
    },
  ];

  // if (showDocName) {
  //   columns.push({
  //     title: 'Наименование документа',
  //     dataIndex: ['file', 'name'],
  //   })
  // }

  columns.push({
    title: 'Дата загрузки',
    dataIndex: 'createdDate',
    render: (text, record) => dateFormat(text)
  });

  if (!readOnly) {
    columns.push({
      dataIndex: 'id',
      width: 30,
      render: (text, record) => (
        <ConfirmButton icon={'delete'} type={'danger'} size={'small'} outline title="Удалить"
                       onConfirm={async () => {
                         await licenceStore.deleteAttachment(record.file?.id);
                         await licenceStore.getAttachments();
                       }}/>
      ),
    })
  }

  return <>
    {files?.length > 0 &&
      <Table columns={columns}
             data={files}
        // bordered={false}
             pagination={false}
             showHeader={false}
             style={{marginBottom: 15}}
      />
    }

    {!readOnly &&
      <FileUpload docId={docId} btnTitle={btnTitle}/>
    }
  </>
}

export default observer(FilesList)

