import React, {useEffect, useState} from 'react'
import ReactTable from "../../components/ReactTable";
import {Form, Typography} from "antd";
import appStore from "../../store/AppStore";
import adminStore from "../../store/AdminStore";


const AdminOrganization = () =>{

  const [tableData, setTableData] = useState([]);

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminStore.getUsersOrg();
        setTableData(response.reverse());
        await adminStore.createLog({
          action: 'Перешал на страницу об организации'
        });
      } catch (e) {
        appStore.setAlert('error', 'Ошибка при обращении на сервер');
        console.log(e);
      }
    };

    fetchData();
  }, []);




  const columns = [
    {
      Header: "№",
      accessor: 'id',
    },


    {
      Header: "ИНН",
      accessor: 'tin',
      headerClassName: 'f-bold',
      className: 'text-center',
    },

    {
      Header: "Организация",
      accessor: 'org',
      headerClassName: 'f-bold',
      className: 'text-center',
    },
    {
      Header: "ПИН",
      accessor: 'pin',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    {
      Header: "ФИО",
      accessor: 'surname',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    {
      Header: 'Должность',
      accessor: 'position',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    {
      Header: "Номер телефона",
      accessor: 'phone',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    {
      Header: "E-MAIL",
      accessor: 'email',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    {
      Header: 'Статус',
      accessor: 'status_name',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    {
      Header: 'Сертификат',
      accessor: 'certification',
      className: 'text-center',
      headerClassName: 'f-bold',
    },
    ]

    return (
     <>
      <div>
        <Form {...formItemLayout} style={{maxWidth: 500}}>
          <Form.Item label="Организация">
            <p>Государственное агентство по регулированию
              топливно-энергетического комплекса при Министерстве энергетики и промышленности Кыргызской Республики</p>
          </Form.Item>
              <Form.Item label="ИИН организации">
               <p>00406200710110</p>
              </Form.Item>
              <Form.Item label="Пин руководителя">
              <p>21405198000475</p>
              </Form.Item>
          <Form.Item label={"Фамилия"}>
            <p>Ишеналиев</p>
          </Form.Item>
          <Form.Item label="Должность">
                <p>Директор</p>
          </Form.Item>
          <Form.Item label="Роль">
                <p>ROLE_MAIN_ADMIN</p>
          </Form.Item>
          <Form.Item label='Email'>
            <p>admin@admin.kg</p>
          </Form.Item>
          <Form.Item label='Номер телефона'>
            <p>0550 92 36 14</p>
          </Form.Item>
          <Form.Item label='Адрес'>
                <p>Бишкек, ул. Горького 142</p>
          </Form.Item>
        </Form>

      </div>

      <div className="adm-tab-title">

        <Typography.Title level={3}>Об организации</Typography.Title>
      </div>
      <ReactTable
        columns={columns}
        data={tableData}
        defaultPageSize={10}
      />

    </>
  )


}

export default AdminOrganization;
