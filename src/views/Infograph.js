import React from "react";
import {observer, inject} from "mobx-react";
import {Card, Typography, Row, Col} from "antd";
import Chart from "react-google-charts";
import "../styles/style.scss";
import licenceStore from '../store/LicenceStore';

const {Title} = Typography;

const Infograph = () => {
  return <InfoComponents/>
}

@inject('licenceStore')
@observer
class InfoComponents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showLogin: false};
  }

  componentDidMount() {
    this.getLicences();
  }

  getLicences = () => {
    this.props.licenceStore.getAllLicences();
  };

  render() {
    const {licenceStore} = this.props;
    const data = licenceStore.licences;

    if (!data)
      return null

    const ownersDataPrivate = licenceStore.licences.filter(l =>
      ['частная', 'частная ', 'Частная'].includes(l.ownership));
    const ownersDataGov = licenceStore.licences.filter(l =>
      ['Государственная ', 'Государственная', 'государственная '].includes(l.ownership));

    const statusInActive = licenceStore.licences.filter(lic => lic.status.id === 30);
    const statusActive = licenceStore.licences.filter(lic => lic.status.id === 20);

    let yearsHash = {},
      licSerYearHash = {}, licSerData = [['Год', 'Серия II ГАЭ', 'Серия I ГАЭ', "Серия ГОСАГЕНСТВО ТЭК"]],
      activTypeHash = {};

    data.forEach((lic) => {
      if (lic.dateOrderIssueLicense) {
        // Данные о лицензиях по годам
        let year = lic.dateOrderIssueLicense.slice(0, 4);
        yearsHash.hasOwnProperty(year) ? yearsHash[year] += 1 : yearsHash[year] = 1;

        // Данные о лицензиях по сериям Лицензий
        if (lic.seriesNumbLicense) {
          let str = lic.seriesNumbLicense.replace(/-/g, " ");
          let matched = str.match(/II.ГАЭ/) || str.match(/I.ГАЭ/) || str.match(/ТЭК/); // важно чтобы ГАЭ 2 был вначале поиска т.к. у них схожи I.ГАЭ и II.ГАЭ
          try {
            !licSerYearHash[year] ? licSerYearHash[year] = {[matched[0]]: 1} : !licSerYearHash[year][matched[0]] ? licSerYearHash[year][matched[0]] = 1 : licSerYearHash[year][matched[0]] += 1;
          } catch (e) {console.log(e.message)}
        }
      }

      // Данные о видах деятельности фирм
      let actName = lic.activity?.name;
      if (actName) {
        activTypeHash[actName] ? activTypeHash[actName] += 1 : activTypeHash[actName] = 1;
      }
    });

    let activTypeData = Object.entries(activTypeHash);
    activTypeData.unshift(['Виды деятельности', 'Количество фирм']);

    let yearsData = Object.entries(yearsHash);
    yearsData.unshift(['Год выдачи', 'Количество лицензий']);

    for (let licYear in licSerYearHash) {
      let {"II ГАЭ": g2 = 0, "I ГАЭ": g1 = 0, "ТЭК": tk = 0} = licSerYearHash[licYear];
      licSerData.push([licYear, g2, g1, tk]);
    }

    return (
      <div className={'charts-main-container'} style={{background: 'transparent'}}>

        <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
          <Col className="gutter-row" span={24}>
            <Title style={{textAlign: 'center'}}>Инфографика</Title>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col className="gutter-row" sm={12} md={12} lg={12} xs={24}>
            <Card>
              <ChartElement
                chartType="PieChart"
                data={[
                  ['name', 'value'],
                  ['Частная', ownersDataPrivate.length],
                  ['Государственная', ownersDataGov.length],
                ]}
                chartTitle="По форме собственности организации"
              />
            </Card>
          </Col>
          <Col className="gutter-row" sm={12} md={12} lg={12} xs={24}>
            <Card>
              <ChartElement
                chartType="PieChart"
                data={[
                  ['name', 'value'],
                  ['Действует', statusActive.length],
                  ['Не действует', statusInActive.length],
                ]}
                chartTitle="По статусу действия лицензии"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col className="gutter-row" sm={12} md={12} lg={12} xs={24}>
            <Card>
              <ChartElement
                chartType="BarChart"
                data={yearsData}
                chartTitle="По году выдачи лицензии"
              />
            </Card>
          </Col>
          <Col className="gutter-row" sm={12} md={12} lg={12} xs={24}>
            <Card>
              <ChartElement
                chartType="AreaChart"
                data={licSerData}
                chartTitle="По виду выданной лицензии в год"
                hAxis={{title: 'Год выдачи', titleTextStyle: {color: '#333'}}}
                vAxis={{minValue: 0, title: 'Количество выданнных лицензий'}}
                legend={{position: 'top'}}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col className="gutter-row" sm={24} md={24} lg={24} xs={24}>
            <Card>
              <ChartElement
                chartType="ColumnChart"
                data={activTypeData}
                chartTitle="По видам деятельности"
                hAxis={{
                  title: 'Виды деятельности',
                  // showTextEvery: 1,
                  // slantedText: true,
                  // slantedTextAngle: 45,
                  titleTextStyle: {color: '#333', fontSize: 18, bold: true, italic: false},
                }}
                vAxis={{title: 'Количество лицензий'}}
                isStacked={true}
                legend={'none'}
                height={'500px'}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const ChartElement = (props) => (
  <Chart
    width={props.width || '100%'}
    height={props.height || '350px'}
    chartType={props.chartType}
    loader={<div>Загрузка данных . . .</div>}
    data={props.data}
    options={{
      legend: props.legend || {position: 'bottom', maxLines: 3},
      title: props.chartTitle,
      chartArea: {width: '85%'},
      is3D: true,
      pointSize: 10,
      hAxis: props.hAxis,
      vAxis: props.vAxis,
      isStacked: props.isStacked,
    }}
    style={{marginBottom: '20px', ...props.style}} // задает дефолтные значения, и ...props.style для дочерних элементов
  />
);

export default Infograph;
