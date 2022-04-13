import React, {useEffect} from "react";
import {Card, Tabs, Typography} from "antd";
import LicencesList from "../../components/LicencesList";
import Button from "../../components/Button";
import adminStore from "../../store/AdminStore";
import {useHistory} from "react-router-dom";
import appStore from "../../store/AppStore";

const {TabPane} = Tabs;


const AdminLicenses = () => {
  const history = useHistory();
  console.log(appStore.user);

  useEffect(() => {
    adminStore.createLog({
      action: 'Перешел на страницу реестр лицензий'
    });
  }, []);

  return (
    <>
      <Typography.Title level={3} className="text-center">РЕЕСТР ЛИЦЕНЗИЙ</Typography.Title>

      <Card>
        <Tabs defaultActiveKey="20" destroyInactiveTabPane>
          <TabPane tab="Все" key="20">
            <LicencesList title={null} />
          </TabPane>

          <TabPane tab="Новые" key="10">
            <LicencesList hideColumns={['status_name']} statusId="10" title={<div>
              <Button onClick={() => history.push('/license/new/')}>
                Создать
              </Button>
            </div>} />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};

export default AdminLicenses;
