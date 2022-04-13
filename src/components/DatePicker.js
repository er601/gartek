import React from 'react';
import {runInAction} from 'mobx';
import {inject, observer} from 'mobx-react';
import moment from 'moment';

import {DatePicker as DPicker} from 'antd';
import constants from "../common/constants";

const {RangePicker} = DPicker;

@inject('appStore')
@observer
export default class DatePicker extends React.Component {

  onChange = item => {
    const {model, name, onChange} = this.props;
    const val = item.format(constants.DB_DATE_FORMAT);
    if (model && name) {
      runInAction(() => (model[name] = val));
    }
    if (onChange) {
      onChange(val);
    }
  };

  render() {
    const {model, name, disabled, placeholder, appStore, value, ...rest} = this.props;
    let val = value ?  moment(value) : null;
    if (model && name && model[name]) {
      val = moment(model[name]);
    }

    return (
      <DPicker
        value={val || null}
        onChange={this.onChange}
        showToday
        placeholderText={placeholder || 'дд.мм.гггг'}
        format="DD.MM.YYYY"
        disabled={disabled || appStore.isBusy}
        {...rest}
      />
    );
  }
}

@inject('appStore')
@observer
export class DateRangePicker extends React.Component {
  componentWillMount() {
    const {
      startDate,
      endDate,
      model,
      modelStartDate,
      modelEndDate,
    } = this.props;
    if (startDate) {
      if (model && modelStartDate)
        if (!model[modelStartDate]) {
          model[modelStartDate] = moment(startDate);
        }
    }

    if (endDate) {
      if (model && modelEndDate)
        if (!model[modelEndDate]) {
          model[modelEndDate] = moment(endDate);
        }
    }
  }

  onChange = date => {
    const dt1 = date[0];
    const dt2 = date[1];

    const {model, modelStartDate, modelEndDate, onChange} = this.props;

    if (model && modelStartDate) {
      runInAction(() => (model[modelStartDate] = dt1));
    }

    if (model && modelEndDate) {
      runInAction(() => (model[modelEndDate] = dt2));
    }

    if (onChange) {
      onChange(dt1, dt2);
    }
  };

  render() {
    let {
      model,
      startDate,
      endDate,
      disabled,
      placeholder,
      appStore,
      value,
      modelStartDate,
      modelEndDate,
      ...rest
    } = this.props;

    if (startDate && Array.isArray(startDate)) {
      endDate = startDate[1];
      startDate = startDate[0];
    }

    let startDt = startDate;
    if (model && modelStartDate && model[modelStartDate]) {
      startDt = moment(model[modelStartDate]);
    }

    if (startDt) startDt = moment(startDt);

    let endDt = endDate;
    if (model && modelEndDate && model[modelEndDate]) {
      endDt = moment(model[modelEndDate]);
    }

    if (endDt) endDt = moment(endDt);

    return (
      <RangePicker
        format="DD.MM.YYYY"
        disabled={disabled || appStore.isBusy}
        value={[startDt, endDt]}
        ranges={{
          Сегодня: [moment(), moment()],
          '1 День': [moment().subtract(1, 'days'), moment()],
          Неделя: [moment().subtract(1, 'week'), moment()],
          Месяц: [moment().subtract(1, 'month'), moment()],
          Год: [moment().subtract(1, 'year'), moment()],
        }}
        onChange={this.onChange}
        {...rest}
      />
    );
  }
}
