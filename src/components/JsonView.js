import React from 'react'
import ReactJson from 'react-json-view';

export default ({data, name = 'data', ...rest}) => {
  const props = {
    src: data,
    name: `${name} [${typeof data} ${data?.constructor?.name}]`,
    indentWidth: 2,
    collapsed: true,
    collapseStringsAfterLength: 50,
    enableClipboard: true,
    displayDataTypes: false,
    ...rest
  }
  return <ReactJson {...props}/>
}
