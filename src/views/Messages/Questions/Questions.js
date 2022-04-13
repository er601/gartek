import React, {useEffect, useState} from 'react';
import {Collapse} from "antd";
import appStore from "../../../store/AppStore";


const { Panel } = Collapse;

const Questions = () => {
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
    fetchData();
  }, []);

  return (
    <div>
      <p><b>Вопросы и ответы</b></p>
      <Collapse>
        {
          questions.map(question => (
            <Panel header={question.question} key={question.id}>
              {question.answer}
            </Panel>
          ))
        }
      </Collapse>

    </div>
  );
};

export default Questions;
