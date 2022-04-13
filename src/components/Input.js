import React from 'react';
import {runInAction} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Input as AntInput, Form, InputNumber as AntInputNumber} from 'antd';
import InputMask from "react-input-mask";

@inject('appStore')
@observer
export default class Input extends React.Component {
  static defaultProps = {
    type: 'text',
    readOnly: false,
  };

  onTextChange = event => {
    const {model, name, onChange} = this.props;
    const {value} = event.target;
    if (model && name) {
      model[name] = value;
    }
    if (onChange) onChange(value);
  };

  render() {
    const {
      type,
      placeholder,
      readOnly,
      disabled,
      value,
      model,
      name,
      appStore,
      ...rest
    } = this.props;

    let text = value;
    if (model && name) {
      text = model[name];
      if (!text && value) {
        runInAction(() => (model[name] = value));
      }
    }

    return (
      <AntInput
        name={name}
        type={type}
        placeholder={placeholder}
        value={!text ? '' : String(text)}
        readOnly={readOnly}
        disabled={appStore.isBusy || disabled}
        {...rest}
        onChange={this.onTextChange}
      />
    );
  }
}

export class FG extends React.Component {
  render() {
    const {l, c, f, hasFeedback, layout, valid, ...rest} = this.props;
    const formItemLayout =
      layout === 'horizontal'
        ? {
          labelCol: {span: 6},
          wrapperCol: {span: 16},
        }
        : null;
    return (
      <Form {...rest} layout={layout}>
        <Form.Item
          label={l}
          hasFeedback={hasFeedback}
          validateStatus={valid}
          help={f}
          {...formItemLayout}>
          {c}
        </Form.Item>
      </Form>
    );
  }
}

@inject('appStore')
@observer
export class PhoneInput extends React.Component {
  reformat = val => {
    if (!val) return '';
    let v = val.replace('+', '');

    if (v.startsWith('996')) v = v.replace('996', '');
    return v;
  };

  render() {
    const {
      type,
      placeholder,
      disabled,
      appStore,
      model,
      name,
      value,
      onChange,
      ...rest
    } = this.props;

    let text = value;
    if (model && name) {
      text = model[name];
      if (!text && value) {
        runInAction(() => (model[name] = value));
      }
    }
    text = this.reformat(text);

    return (
      <InputMask
        value={!text ? '' : String(text)}
        mask="0(999) 99 99 99"
        className="ant-input"
        disabled={appStore.isBusy || disabled}
        onChange={e => {
          const v = e.target.value.replace(/\D/g, '');
          if (model && name) {
            model[name] = v;
          }
          if (onChange) {
            onChange(v);
          }
        }}
        // maskChar="_"
        {...rest}
      />
    );
  }
}


@inject('appStore')
@observer
export class NumericInput extends React.Component {
  onChange = value => {
    const {model, name, onChange} = this.props;
    const reg = /^-?\d*\.?\d*$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (model && name) {
        model[name] = value;
      }
      if (onChange) onChange(value);
    }
  };

  render() {
    const {value, onChange, placeholder, model, name, appStore, disabled, ...rest} = this.props;

    let text = value;
    if (model && name) {
      text = model[name];
      if (!text && value) {
        runInAction(() => (model[name] = value));
      }
    }

    return (
      <Input
        value={text}
        onChange={this.onChange}
        onBlur={this.onBlur}
        disabled={appStore.isBusy || disabled}
        placeholder={placeholder}
        maxLength={this.props.maxLength || 25}
        {...rest}
      />
    );
  }
}

@inject('appStore')
@observer
export class InputNumber extends React.Component {

  onChange = value => {
    const {model, name, onChange} = this.props;
    if (model && name) {
      model[name] = value;
    }
    if (onChange) onChange(value);
  };

  render() {
    const {placeholder, disabled, value, model, name, appStore, ...rest} = this.props;

    let text = value;
    if (model && name) {
      text = model[name];
      if (!text && value) {
        runInAction(() => (model[name] = value));
      }
    }

    return (
      <AntInputNumber
        name={name}
        placeholder={placeholder}
        value={!text ? '' : String(text)}
        disabled={appStore.isBusy || disabled}
        {...rest}
        onChange={this.onChange}
      />
    );
  }
}
