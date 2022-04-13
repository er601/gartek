import React, {Component} from 'react';
import ReactSelect from 'react-select';
import {inject, observer} from 'mobx-react';
import {withNamespaces} from 'react-i18next';

@withNamespaces()
@inject('appStore')
@observer
export default class Select extends Component {
  render() {
    const {
      appStore,
      value,
      valueKey,
      labelKey,
      multi,
      placeholder,
      options,
      optionRenderer,
      valueRenderer,
      onChange,
      disabled,
      t,
      ...rest
    } = this.props;
    return (
      <ReactSelect
        value={value}
        valueKey={valueKey}
        multi={multi}
        placeholder={placeholder || 'выбор'}
        labelKey={labelKey}
        loadingPlaceholder={t('loading')}
        noResultsText={t('empty')}
        options={options}
        optionRenderer={optionRenderer}
        valueRenderer={valueRenderer}
        disabled={disabled || appStore.isBusy}
        onChange={val => {
          if (onChange) {
            onChange(val);
          }
        }}
        {...rest}
      />
    );
  }
}
