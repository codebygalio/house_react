import React from "react";
import "./index.scss";
import UtHeader from '../../components/UtHeader'
import {  Toast } from "antd-mobile-v2";
import { List, AutoSizer } from "react-virtualized";
import axios from "axios";
import { getCurrentCity, setCurrentCity } from "../../utils";
import { BASE_URL } from '../../utils/url'

const TITLE_HEIGHT = 36;
const NAME_HEIGHT = 50;

const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase(letter);
  }
};
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0
    }
    this.cityListComponent = React.createRef()
  }
  
    async componentDidMount() {
    // const city =  getCurrentCity()
      await this.getCityList()
      this.cityListComponent.current && this.cityListComponent.current.measureAllRows()
  }
  changeCity = ({label, value }) =>{
    if(HOUSE_CITY.indexOf(label) > -1){
      setCurrentCity({label, value })
      this.props.history.go(-1)
    }else{
      Toast.info('此城市暂无数据',1, null,false);
    }
    // console.log('changeCity=',item)
  }
  rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];
    // console.log(cityList[letter]);
    // console.log("cityIndex=", cityIndex);
    // console.log("key=", key);
    // console.log("index=", index);
    // console.log("letter=", letter);
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item, index) => (
          <div className="name" key={index} onClick={()=>this.changeCity(item)}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  formatCityData = async (list) => {
    const cityList = {};
    list.forEach((item) => {
      const first = item.short.substr(0, 1);
      if (cityList[first]) {
        cityList[first].push(item);
      } else {
        cityList[first] = [item];
      }
    });
    const cityIndex = Object.keys(cityList).sort();
    const hotRes = await axios.get(`${BASE_URL}/area/hot`);
    const curCity = await getCurrentCity();
    cityList["hot"] = hotRes.data.body;
    cityIndex.unshift("hot");
    cityList["#"] = [curCity];
    cityIndex.unshift("#");
    this.setState({
      cityList,
      cityIndex,
    });
    
  };
  async getCityList() {
    const { data } = await axios.get(`${BASE_URL}/area/city?level=1`);
    // this.setState({ city: data.body });
    await this.formatCityData(data.body); 
  }
  getRowHeight = ({index}) => {
    const { cityIndex, cityList } = this.state
    return cityList[cityIndex[index]].length * NAME_HEIGHT + TITLE_HEIGHT
    // return 100
  }
  renderCityIndex() {
    return this.state.cityIndex.map((item,index) => <li className="city-index-item" key={item} onClick={()=>{ 
      this.cityListComponent.current.scrollToRow(index)
    }}>
    <span className={this.state.activeIndex===index?'index-active':''}>{item === 'hot'? '热': item.toUpperCase()}</span>
  </li> )
  }
  onRowsRendered= ({startIndex}) => {
    if(this.state.activeIndex !== startIndex) {
      this.setState({activeIndex: startIndex})
    }
    // console.log('容器块块下标= ',startIndex)
  }
  render() {
    return (
      <div className="citylist">
        <UtHeader/>
        <AutoSizer>
          {({ height, width }) => (
            (<List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />)
          )}
        </AutoSizer>
        <div className="city-index">
          {this.renderCityIndex()}
          {/* <li className="city-index-item">
            <span className="index-active">#</span>
          </li> */}
        </div>
      </div>
    );
  }
}
