import React, {useEffect, useState} from 'react';
import {CKEditor} from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import appStore from "../../../store/AppStore";

const InfoPage = props => {
  const [state, setState] = useState({
    title: '',
    date: '',
    fileDownloadUrl: '',
    content: ''
  });

  useEffect(() => {
    fetchData();
  }, [props.match.params.id]);

  const fetchData = async () => {
    try {
      const res = await appStore.getInstructionById(props.match.params.id);
      setState(res);
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };

  return (
    <div>
      <div className="adm-tab-title">
        <h3>{state?.title}</h3>
        {!!state.fileDownloadUrl ? <div>
          <a
            href={appStore.getUrl() + state.fileDownloadUrl.substring(1)}
            download target="_blank"
          >
            Скачать в виде файла
          </a>
        </div> : <div>
          Дата добавления: {state.date}
        </div>}
      </div>

      <div>
        <CKEditor
          editor={DecoupledEditor}
          data={state?.content}
          disabled={true}
          config={{
            toolbar: null,
            heading: null,
            border: null
          }}
          border={null}
        />
      </div>

    </div>
  );
};

export default InfoPage;
