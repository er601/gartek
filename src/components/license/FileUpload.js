import Button from "../Button";
import {Icon} from "antd";
import InputFiles from "react-input-files";
import React from "react";
import {observer} from "mobx-react";
import licenceStore from "../../store/LicenceStore";

const FileUpload = ({docId, btnTitle = 'Загрузить',  accept = '.pdf,.doc,.docx,.xls,.xlsx,image/!*'}) => {
  const onChange = async (files) => {
    for (let file of files) {
      await licenceStore.uploadFile(file, docId);
    }

    await licenceStore.getAttachments();
  };

  return (
    <InputFiles multiple accept={accept} onChange={onChange}>
      <Button>
        <Icon type="upload"/>
        {btnTitle}
      </Button>
    </InputFiles>
  )
}

export default observer(FileUpload)