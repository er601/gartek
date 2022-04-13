import React, {useEffect, useState} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {Button, Form, Upload} from "antd";
import {useHistory} from "react-router-dom";
import DatePicker from "../../../../components/DatePicker";
import Input from "../../../../components/Input";
import requester from "../../../../common/requester";
import adminStore from "../../../../store/AdminStore";
import appStore from "../../../../store/AppStore";


const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
};

const config = {
  toolbar: {
    items: [ 'bold', 'italic', 'heading', '|', 'link', 'bulletedList', 'numberedList', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|',
      'toggleImageCaption', 'imageTextAlternative', '|',
      'fontfamily', 'fontsize', '|',
      'alignment', '|',
      'fontColor', 'fontBackgroundColor', '|', 'strikethrough', 'underline', '|',
      'link', '|',
      'outdent', 'indent', '|',
      'bulletedList', 'numberedList', '|',
      'insertTable', '|',
      'uploadImage', 'blockQuote', '|',
      'undo', 'redo' ],
    shouldNotGroupWhenFull: true
  }
};

const uploadAdapter = loader => {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        loader.file.then((file) => {
          formData.append("image", file);
          requester.post('file/upload', formData)
            .then(res => {
              resolve({
                default: res.file
              });
            })
            .catch((err) => {
              appStore.setAlert('error', 'Ошибка при отправке фото на сервер');
              reject(err);
            });
        });
      });
    }
  }
}


const CreatePage = () => {
  const [content, setContent] = useState('');
  const [state, setState] = useState({
    title: '',
    date: '',
    file: ''
  });

  const history = useHistory();

  useEffect(() => {
    adminStore.createLog({
      action: 'Перешал на страницу создания инструкции'
    });
  }, []);

  const onFinish = async e => {
    e.preventDefault();

    const data = {
      ...state,
      date: state?.date?.format('DD-MM-YYYY'),
      content
    };

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (!!data[key]) {
        formData.append(key, data[key]);
      }
    });

    try {
      await adminStore.postInstruction(formData);
      await adminStore.createLog({
        action: 'Создания инструкцию'
      });
      history.goBack();
    } catch (e) {
      appStore.setAlert('error', 'Ошибка при отправке на сервер');
      console.error(e);
    }
  };


  return (
    <div>
      <div className="adm-tab-title">
        <h3>Добавление инструкций</h3>
        <Button type="primary" onClick={() => history.goBack()}>Назад</Button>
      </div>

      <Form onSubmit={onFinish} style={{padding: '15px 0 5px'}} {...layout}>

        <Form.Item
          name="title"
          label='Наименование'
        >
          <Input
            value={state.title}
            onChange={value => setState({...state, title: value})}
          />
        </Form.Item>

        <Form.Item
          label='Дата добавления'
        >
          <DatePicker
            style={{width: "100%"}}
            value={state.date}
            onChange={value => setState({...state, date: value})}
          />
        </Form.Item>

        <Form.Item
          name="file"
          label='Файл'
        >
          <Upload
            getValueFromEvent={normFile}
            listType="fileList"
            beforeUpload={() => false}
            accept=".pdf,.doc,.docx"
            maxCount={1}
            onChange={file => setState({...state, file: file?.file})}
            showUploadList={false}
          >
            <Button>Загрузить файл</Button>
            {!!state.file && 'Файл загружен'}
          </Upload>

        </Form.Item>

        <Form.Item
          name="content"
          label="Editor"
        >
          <div className="add-editor">
            <CKEditor
              data={content}
              config={config}
              onReady={ editor => {
                window.editor = editor;
                // You can store the "editor" and use when it is needed.
                editor.plugins.get("FileRepository").createUploadAdapter = loader => {
                  return uploadAdapter(loader); //TODO uploadAdapter api to gargek
                };

                editor.ui
                  .getEditableElement()
                  .parentElement.insertBefore(
                  editor.ui.view.toolbar.element,
                  editor.ui.getEditableElement()
                );
                // console.log(Array.from( editor.ui.componentFactory.names() ))
              }}
              editor={ DecoupledEditor }
              onChange={ ( event, editor ) => {
                setContent(editor.getData());
              } }
            />
          </div>
        </Form.Item>

        <Form.Item style={{marginTop: 30}} {...tailLayout}>
          <Button onClick={() => history.goBack()}>
            Отмена
          </Button>
          <Button htmlType="submit" type="primary">
            Добавить
          </Button>
        </Form.Item>

      </Form>

    </div>
  );
};

export default CreatePage;
