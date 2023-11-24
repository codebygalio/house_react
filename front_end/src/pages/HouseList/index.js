import React from "react";
import { Flex, Toast } from "antd-mobile-v2";
import { List, AutoSizer, WindowScroller, InfiniteLoader } from "react-virtualized";
import { Request } from "../../utils/request";
import { BASE_URL } from "../../utils/url";
import SearchHeader from "../../components/SearchHeader";
import Filter from "./components/Filter/index.js";
import HouseItem from "../../components/HouseItem";
import { getCurrentCity } from "../../utils";
import Sticky from '../../components/Sticky'
import styles from "./index.module.scss";
import NoHouse from '../../components/NoHouse'

const queryHouseList = {
  cityId:'',
  start: 1,
  end: 20,
};
export default class HouseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityData: {},
      queryHouseList,
      list: [],
      count: 0,
      loading: true
    };
    this.filters = {}
  }
  // 初始化获取数据
  getHouseList = async (filter) => {
    this.setState({loading: true})
    Toast.loading('Loading...', 0);
    window.scrollTo(0,0);
    const { queryHouseList } = this.state;
    const { data } = await Request({ url: "/houses", params: { ...queryHouseList, ...filter } });
    const { list, count } = data.body;
    this.setState({ list, count, loading:false });
    count > 0 ? Toast.info(`共有${count}条数据`,2,null,false):Toast.hide()
    // console.log("data=", data);
  };
  // 100%一样
  async searchHouseList() {
    // 获取当前定位城市id

    const res = await Request.get('/houses', {
      params: {
        ...queryHouseList,
        start: 1,
        end: 20
      }
    })
    const { list, count } = res.data.body

    this.setState({
      list,
      count,
      'lock':false
    })
  }
 
  async componentDidMount() {
    const cityData = await getCurrentCity();
    const { queryHouseList } = this.state;
    this.setState({ cityData, queryHouseList: { ...queryHouseList, cityId: cityData.value } });
    this.getHouseList()
  }
  fixedFilterDom = ()=>{
    console.log(this.filterDom.current)
  }
  renderHouseList = ({ key, index, style }) => {
    const { list } = this.state
    const house = list[index]
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    return (
      <HouseItem
      onClick={()=> this.props.history.push(`/detail/${house.houseCode}`)}
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  }
   


   isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  
 
  loadMoreRows = ({ startIndex, stopIndex }) => {
    const {queryHouseList} = this.state
    return new Promise(resolve => {
      Request.get('/houses', {
        params: {
          ...queryHouseList,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        // console.log('loadMoreRows：', res)
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })

        // 数据加载完成时，调用 resolve 即可
        resolve()
      })
    })
  }
      
    renderList() {
      const { count, loading } = this.state;
      if(count === 0 && !loading){
        return <NoHouse children={'没有找到房源，请您换个搜索条件吧～'}></NoHouse>
      }
      return (<InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
         {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
          {({ height, isScrolling, scrollTop }) => (
            <AutoSizer>
             {({ width }) => (
             <List
             onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    width={width}
                    height={height}
             rowCount={count}
             rowHeight={120}
             rowRenderer={this.renderHouseList}
             isScrolling={isScrolling}
                    scrollTop={scrollTop}
           />
           )
           }
         </AutoSizer>)}
         </WindowScroller>
        )}
      </InfiniteLoader>)
    }
    
  render() {
     const { label: cityName, value: cityId } = this.state.cityData;
    //  const { count, list } = this.state;
    return cityId ? (
      <div className={styles.houseList}>
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
          <SearchHeader
            leftClick={() => this.props.history.push('/citylist')}
            className={styles.searchHeader}
            cityName={cityName}
          />
        </Flex>
        <Sticky >
        <Filter cityId={cityId} getHouseList={this.getHouseList}  />
        </Sticky>
           {/* 列表数据 */}

        <div className={styles.houseItems}>
         {this.renderList()}
        </div>   
      </div>
    ) : (
      ""
    );
  }
}
