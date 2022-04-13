import React from 'react';
import {IconContext} from 'react-icons';

const TableActions = ({children}) => {
  return (
    <IconContext.Provider value={{className: 'react-icons'}}>
      {children}
    </IconContext.Provider>
  );
};

export default TableActions;
