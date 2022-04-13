import React, {useEffect, useState} from 'react';
import {Button, Collapse, Form, Input, Modal} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ConfirmButton} from "../../../../components/ButtonConfirm";
import appStore from "../../../../store/AppStore";
import adminStore from "../../../../store/AdminStore";


const { Panel } = Collapse;

const Questions = () => {
  const [modal, setModal] = useState(false);
  const [createState, setCreateState] = useState({
    question: '',
    answer: ''
  });
  const [editQuestion, setEditQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);


  const fetchData = async () => {
    try {
      const res = await appStore.getQuestions();
      setQuestions(res);
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };

  useEffect(() => {
    fetchData().then(() => {
      adminStore.createLog({
        action: 'Перешел на Сообщения/Вопросы и ответы'
      });
    });
  }, []);


  const reset = () => {
    setModal(false);
    setCreateState({
      question: '',
      answer: ''
    });
  };

  const onFinish = async e => {
    e.preventDefault();
    try {
      await adminStore.postQuestions(createState);
      await fetchData();
      await adminStore.createLog({
        action: 'Создал вопрос и ответ'
      });
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    } finally {
      setModal(false);
      setCreateState({
        question: '',
        answer: ''
      });
    }
  };

  const deleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      await adminStore.deleteQuestions(id);
      await fetchData();
      await adminStore.createLog({
        action: 'Удалил вопрос и ответ'
      });
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    }
  };



  const edit = async e => {
    e.preventDefault();
    try {
      await adminStore.putQuestions(editQuestion);
      await fetchData();
      await adminStore.createLog({
        action: 'Отредактировал вопрос и ответ'
      });
    } catch (e) {
      console.log(e);
      appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.');
    } finally {
      setEditQuestion(null);
    }

  };

  const editClicked = (e, question) => {
    e.stopPropagation();
    setEditQuestion(question);
  };

  return (
    <div>
      <div className="adm-tab-title">
        <h3>Вопросы и ответы</h3>
        <Button onClick={() => setModal(true)}>Добавить</Button>
      </div>
      <Collapse>

        {
          questions.map(question => (
            <Panel
              key={question.id}
              header={question.question}
              extra={
                <div>
                  <Button
                    size="small" title="Изменить"
                    onClick={e => editClicked(e, question)}
                  >
                    <EditOutlined/>
                  </Button>
                  <ConfirmButton size="small" title="Удалить"
                    onClick={e => e.stopPropagation()}
                    onConfirm={e => deleteItem(e, question.id)}
                    onCancel={e => e.stopPropagation()}
                  >
                    <DeleteOutlined />
                  </ConfirmButton>
                </div>
              }
            >
              {question.answer}
            </Panel>
          ))
        }

      </Collapse>


      <Modal
        title='Вопрос и ответ'
        visible={modal}
        width={600}
        destroyOnClose
        onCancel={() => setModal(false)}
        maskClosable
        footer={false}
      >
        <Form onSubmit={onFinish}>

          <Form.Item
            name="question"
            label='Вопрос'
          >
            <Input
              value={createState.question}
              onChange={e => setCreateState({...createState, question: e.target.value})}
            />
          </Form.Item>

          <Form.Item
            name="answer"
            label='Ответ'
          >
            <Input.TextArea
              rows={4}
              value={createState.answer}
              onChange={e => setCreateState({...createState, answer: e.target.value})}
            />
          </Form.Item>

          <Form.Item style={{marginTop: 30}}>
            <Button onClick={reset}>Отмена</Button>
            <Button type="primary" htmlType="submit">Добавить</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Изменить'
        visible={!!editQuestion}
        width={600}
        destroyOnClose
        onCancel={() => setEditQuestion(null)}
        maskClosable
        footer={false}
      >
        <Form onSubmit={edit}>

          <Form.Item
            name="question"
            label='Вопрос'
          >
            <Input
              value={editQuestion?.question}
              onChange={e => setEditQuestion({...editQuestion, question: e.target.value})}
            />
          </Form.Item>

          <Form.Item
            name="answer"
            label='Ответ'
          >
            <Input.TextArea
              rows={4}
              value={editQuestion?.answer}
              onChange={e => setEditQuestion({...editQuestion, answer: e.target.value})}
            />
          </Form.Item>

          <Form.Item style={{marginTop: 30}}>
            <Button onClick={() => setEditQuestion(null)}>Отмена</Button>
            <Button type="primary" htmlType="submit">Добавить</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Questions;
