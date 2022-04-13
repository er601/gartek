import React from 'react';
import {Popconfirm} from 'antd';
import Button from './Button';

export class ConfirmButton extends React.Component {
  render() {
    const {question, onConfirm, onCancel, placement, children} = this.props;
    const btnProps = {...this.props};
    delete btnProps.onConfirm; // onConfirm вызывает warning в AppButton

    return (
      <Popconfirm
        title={question || 'Вы уверены?'}
        onConfirm={onConfirm}
        placement={placement || "left"}
        onCancel={onCancel}
        okText="Да"
        cancelText="Нет">
        <Button {...btnProps} type="danger">{children}</Button>
      </Popconfirm>
    );
  }
}

// ConfirmButton.propTypes = {
//   type: PropTypes.oneOf(['primary', 'dashed', 'danger', 'default', 'link']),
//   size: PropTypes.oneOf(['large', 'default', 'small']),
//   loading: PropTypes.bool,
//   disabled: PropTypes.bool,
//   outline: PropTypes.bool,
//   onConfirm: PropTypes.func,
//   onCancel: PropTypes.func,
//   question: PropTypes.string,
// };

ConfirmButton.defaultProps = {
  type: 'primary',
  size: 'default',
};
