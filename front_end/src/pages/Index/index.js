import React from "react";
import axios from "axios";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile-v2";
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
import "./index.scss";
import { getCurrentCity } from '../../utils'
import { BASE_URL } from '../../utils/url'

const navs = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: "/home/list",
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/home/list",
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map",
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/rent/add",
  },
];


navigator.geolocation.getCurrentPosition(obj => {
  // console.log('test地理')
  // console.log('obj=',obj)
})
export default class Index extends React.Component {
  state = {
    swipers: [],
    isSwiperLoaded: false,
    groups: [],
    news: [],
    curCityName: ''
  };

  async componentDidMount() {
    const curCity =await getCurrentCity()
    this.setState({curCityName: curCity.label})
    this.getSwipers();
    this.getGroups()
    this.getNews()
    // console.log('测试')

  }
  async getSwipers() {
    const { data } = await axios.get(`${BASE_URL}/home/swiper`);
    //  console.log('res=',data)
    this.setState({ swipers: data.body, isSwiperLoaded: true });
  }
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a key={item.id} href="http://baidu.com" style={{ display: "inline-block", width: "100%", height: 212 }}>
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
          }}
          style={{ width: "100%", verticalAlign: "top" }}
        />
      </a>
    ));
  }
  renderNavs() {
    return navs.map((item) => (
      <Flex.Item key={item.id}>
        <img src={item.img} alt="" onClick={() => this.props.history.push(item.path)} />
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }

  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={BASE_URL + item.imgSrc}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  async getNews() {
    const {data} =await axios.get(`${BASE_URL}/home/news`,{params:{area:'AREA%7C88cff55c-aaa4-e2e0'}})
    this.setState({news: data.body})
  }

  async getGroups() {
    const { data } = await axios.get(`${BASE_URL}/home/groups`,{
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      groups: data.body
    })

  }
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
        {this.state.swipers.length ? (
          <Carousel autoplay infinite>
            {this.renderSwipers()}
          </Carousel>
        ) : ("")
        }
        {/* {this.state.isSwiperLoaded ? (
          <Carousel autoplay infinite>
            {this.renderSwipers()}
          </Carousel>
        ) : ("")
        } */}
        {/* 搜索框 */}
        <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className="name">{this.state.curCityName}</span>
                <i className="iconfont icon-arrow" />
              </div>

              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => this.props.history.push('/search')}
              >
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => this.props.history.push('/map')}
            />
          </Flex>
        </div>
        {/* nav */}
        <Flex className="nav">{this.renderNavs()}</Flex>
        {/* 租房小组 */}
        <div className="group">
          <div className="group-title">租房小组<span className="more">更多</span></div>
          <Grid data={this.state.groups} activeStyle={false} columnNum={2} square={false} hasLine={false}
          renderItem={item => (
            <Flex className="group-item" justify="around" key={item.id}>
              <div className="desc">
                <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
              </div>
              <img src={BASE_URL + item.imgSrc} alt="" />
            </Flex>
          )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
       
      </div>
    );
  }
}
