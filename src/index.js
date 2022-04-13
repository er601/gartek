import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import {I18nextProvider} from "react-i18next";
import {ConfigProvider} from "antd";
import ruRu from "antd/es/locale/ru_RU";
import "numeral/locales/ru";
import "moment/locale/ru";
import i18n from "./translate/i18n";
import "antd/dist/antd.css";
import "./styles/style.scss";
import 'react-select/dist/react-select.css';
import stores from "./store/stores";
import Root from "./Root";

const App = () => (
  <Provider {...stores}>
    <I18nextProvider i18n={i18n}>
      <ConfigProvider locale={ruRu}>
          <Root/>
      </ConfigProvider>
    </I18nextProvider>
  </Provider>
);

ReactDOM.render(<App/>, document.getElementById("root"));
