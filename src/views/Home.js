import React from "react";
import LicencesList from "../components/LicencesList";
import appStore from "../store/AppStore";
import {observer} from "mobx-react";
import {Link, Redirect} from 'react-router-dom';
import Button from "../components/Button";

const Home = () => {
  if (appStore.isUser)
    return <Redirect to="/licenses"/>

  if (appStore.isAdmin)
    return <Redirect to="/admin/licenses"/>

  return (<>
    <Button>
      <Link to="/organizations">Все Лицензиаты</Link>
    </Button>
    <br/>
    <LicencesList hideColumns={['tin', 'id', 'applicate_date']}
                  hideByStatus={[20, 30]}
                  statusId={20}
    />
  </>)
}

export default observer(Home);
