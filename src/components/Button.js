import React from 'react';
import {Button as AntButton, Popconfirm} from 'antd';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';

@inject('appStore')
@observer
export default class Button extends React.Component {
  render() {
    const {
      appStore,
      onClick,
      shape,
      type,
      disabled,
      children,
      loading,
      outline,
      ...rest
    } = this.props;
    return (
      <AntButton
        onClick={onClick}
        type={type || 'primary'}
        ghost={outline}
        shape={shape}
        disabled={disabled || appStore.isBusy}
        loading={loading && appStore.isBusy}
        {...rest}>
        {children}
      </AntButton>
    );
  }
}
Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'dashed', 'danger', 'default', 'link']),
  size: PropTypes.oneOf(['large', 'default', 'small']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: 'primary',
  size: 'default',
};

export class ConfirmButton extends React.Component {
  render() {
    const {question, onConfirm, onCancel, children} = this.props;
    const btnProps = {...this.props};
    delete btnProps.onConfirm; // onConfirm вызывает warning в AppButton

    return (
      <Popconfirm
        title={question || 'Вы уверены'}
        onConfirm={onConfirm}
        onCancel={onCancel}
        okText="Да"
        cancelText="Нет">
        <Button {...btnProps}>{children}</Button>
      </Popconfirm>
    );
  }
}

ConfirmButton.propTypes = {
  type: PropTypes.oneOf(['primary', 'dashed', 'danger', 'default']),
  size: PropTypes.oneOf(['large', 'default', 'small']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  question: PropTypes.string,
};

ConfirmButton.defaultProps = {
  type: 'primary',
  size: 'default',
};
