import React, {useState} from 'react'
import {Button, Card, Checkbox, Form, Input, Select, Row, Col } from 'antd';
import appStore from "../store/AppStore";
import FeedbackStore from "../store/FeedbackStore";
import {PhoneInput} from "../components/Input";

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const tailLayout = {
  wrapperCol: {offset: 6, span: 18},
};

const checkForm = object => {
  for (const key in object) {
    if (key === 'middleName') {
      continue;
    }
    if (!object[key]) {
      return false;
    }
  }
  return true;
};

const Feedback = () => {
  const [state, setState] = useState({
    lastName: '',
    name: '',
    mail: '',
    middleName: '',
    phoneNumber: '',
    message: '',
    agreement: false
  });

  const onFinish = async () => {
    if (checkForm(state)) {
      try {
        await FeedbackStore.postFeedback({...state, date: new Date()});
        appStore.setAlert('success', 'Ваше обращение успешно отправлено администрации сайта.');
        setState({
          lastName: '',
          name: '',
          mail: '',
          middleName: '',
          phoneNumber: '',
          message: '',
          agreement: false
        });
      } catch (e) {
        appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.')
        console.log(e);
      }
    }
  };


  return (
    <div>
      <h2 className="titleCont">Обратная связь</h2>
      <Card style={{padding: "20px 0"}}>
        <Row justify="space-around" gutter={50}>
          <Col span={20} order={2} lg={{span: 14, order: 1}}>

            <Form {...layout}>
              <Form.Item
                name="lastName"
                label="Фамилия"
                rules={[{required: true, message: 'Введите фамилию!'}]}
              >
                <Input
                  placeholder="Введите фамилию"
                  value={state.lastName}
                  onChange={e => setState({...state, lastName: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="Имя"
              >
                <Input
                  placeholder="Введите имя"
                  value={state.name}
                  onChange={e => setState({...state, name: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="middleName"
                label="Отчество"
              >
                <Input
                  placeholder="Введите Отчество"
                  value={state.middleName}
                  onChange={e => setState({...state, middleName: e.target.value})}
                />
              </Form.Item>


              <Form.Item
                name="mail"
                label="Электронная почта"
                rules={[{required: true, message: 'Введите почту!'}]}
              >
                <Input
                  placeholder="Введите почту"
                  value={state.mail}
                  onChange={e => setState({...state, mail: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label="Номер телефона"
                rules={[{required: true, message: 'Введите номер!'}]}
              >
                <PhoneInput
                  placeholder="Введите номер"
                  value={state.phoneNumber}
                  onChange={v => setState({...state, phoneNumber: v})}
                />
              </Form.Item>


              <Form.Item
                name="message"
                label='Ваше сообщение'
                rules={[{required: true, message: 'Введите сообщение'}]}
              >
                <Input.TextArea
                  placeholder="Введите сообщение"
                  value={state.message}
                  onChange={e => setState({...state, message: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                rules={[
                  {
                    validator: (_, value) =>
                      state.agreement ? Promise.resolve() : Promise.reject(new Error('Примите соглашения для отправки обращения')),
                  },
                ]}
                {...tailLayout}
              >
                <Checkbox
                  checked={state.agreement}
                  onChange={() => setState({...state, agreement: !state.agreement})}
                >
                  Я соглашаюсь на обработки своих личных данных
                </Checkbox>
              </Form.Item>

              <Form.Item
              >
                <Button
                  onClick={onFinish}
                  disabled={!checkForm(state)}
                >
                  Отправить
                </Button>
              </Form.Item>

            </Form>
          </Col>

          <Col lg={{span: 10, order: 2}} span={20} order={1} >
            <div className="text-contact">
              <p>
                Заполните форму для отправки вашего сообщения администрации сайта.
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

}

export default Feedback;
