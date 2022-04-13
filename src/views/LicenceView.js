import React from "react";
import {inject, observer} from "mobx-react";
import License from "./License";

export class LicenceView extends React.Component {

  render() {
    return (
      <License readOnly/>
    )
  }

}
