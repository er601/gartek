import React from 'react';
import {inject, observer} from 'mobx-react';
import {action} from 'mobx';
import {Checkbox as AntCheckbox} from 'antd';

@inject('appStore')
@observer
export default class Checkbox extends React.Component {
  onChange = val => {
    const {model, name, onChange, disabled} = this.props;
    if (disabled) return;
    if (model && name) {
      action('set', () => (model[name] = val))();
    }
    if (onChange) {
      onChange(val);
    }
  };

  render() {
    const {model, name, checked, label, disabled} = this.props;
    let ch = checked;
    if (model && name) {
      ch = model[name];
    }

    return (
      <AntCheckbox
        disabled={disabled || this.props.appStore.isBusy}
        checked={ch}
        onChange={e => this.onChange(e.target.checked)}>
        {label}
      </AntCheckbox>
    );
  }
}
