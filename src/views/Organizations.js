import React from 'react'
import Table from "../components/Table";
import licenceStore from "../store/LicenceStore";

class OrganizationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrganizations: false,
      dataSource:{},
      loading: false,
      pagin: {
        current: 0,
        pageSize: 30,
        total: 0, // Total number of data items
      },
    };

  }
  async componentDidMount() {
    this.getAllOrganizations();
  }

  getAllOrganizations = async () => {
    this.setState({loading: true})
    let data = await licenceStore.getAllOrganizations()
    this.setState({loading: false, dataSource: data})
  }

  render() {

    const columns = [
      {
        title: 'ИНН',
        dataIndex: 'tin',
        key: 'tin',
      },
      {
        title: 'Наименование Лицензиата',
        dataIndex: 'shortNameOl',
        key: 'shortNameOl',
      },
    ]

    return (
      <>
        <div>
          <Table loading={this.state.loading} dataSource={Array.from(this.state.dataSource)} columns={columns}/>
        </div>
      </>
    )
  }
}
export default OrganizationsList;