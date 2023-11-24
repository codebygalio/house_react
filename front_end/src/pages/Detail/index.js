import React, { Component } from "react";

import { Carousel, Flex, Toast, Modal } from "antd-mobile-v2";

import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";
import HousePackage from "../../components/HousePackage";

import { getToken, BASE_URL, Request } from "../../utils";

import styles from "./index.module.css";

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + "/img/message/1.png",
    desc: "72.32㎡/南 北/低楼层",
    title: "安贞西里 3室1厅",
    price: 4500,
    tags: ["随时看房"],
  },
  {
    id: 2,
    src: BASE_URL + "/img/message/2.png",
    desc: "83㎡/南/高楼层",
    title: "天居园 2室1厅",
    price: 7200,
    tags: ["近地铁"],
  },
  {
    id: 3,
    src: BASE_URL + "/img/message/3.png",
    desc: "52㎡/西南/低楼层",
    title: "角门甲4号院 1室1厅",
    price: 4300,
    tags: ["集中供暖"],
  },
];

// const labelStyle = {
//   position: "absolute",
//   zIndex: -7982820,
//   backgroundColor: "rgb(238, 93, 91)",
//   color: "rgb(255, 255, 255)",
//   height: 25,
//   padding: "5px 10px",
//   lineHeight: "14px",
//   borderRadius: 3,
//   boxShadow: "rgb(204, 204, 204) 2px 2px 2px",
//   whiteSpace: "nowrap",
//   fontSize: 12,
//   userSelect: "none",
// };

export default class HouseDetail extends Component {
  state = {
    isLoading: false,

    houseInfo: {
      // 房屋图片
      houseImg: [],
      slides: [],
      // 标题
      title: "",
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: "两室一厅",
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: "精装",
      // 朝向
      oriented: [],
      // 楼层
      floor: "",
      // 小区名称
      community: "",
      // 地理位置
      coord: {
        latitude: "39.928033",
        longitude: "116.529466",
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: "",
      // 房屋描述
      description: "",
    },
    isFavorite: false,
  };

  componentDidMount() {
    this.getHouseDetail();
    this.renderMap("天山星城", {
      latitude: "31.219228",
      longitude: "121.391768",
    });
    this.checkFavorite();
  }
  getHouseDetail = async () => {
    const { id } = this.props.match.params;
    const { data } = await Request.get(`/houses/${id}`);
    this.setState({ houseInfo: data.body });
    console.log("data=", data.body);
  };
  async checkFavorite() {
    if (!getToken()) return;
    const { id } = this.props.match.params;
    const { data } = await Request.get(`/user/favorites/${id}`);
    if (data.status === 200) this.setState({ isFavorite: data.body.isFavorite });
  }

  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg: slides },
    } = this.state;

    return slides.map((item) => (
      // eslint-disable-next-line
      <a key={item} href="javascript:;" style={{ display: "inline-block", width: "100%", height: 252 }}>
        <img
          src={BASE_URL + item}
          alt=""
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
          }}
          style={{ width: "100%", verticalAlign: "top", objectFit: "fill", height: "100%" }}
        />
      </a>
    ));
  }

  // 渲染地图
  renderMap(community, coord) {
    // const { latitude, longitude } = coord
    // const map = new BMap.Map('map')
    // const point = new BMap.Point(longitude, latitude)
    // map.centerAndZoom(point, 17)
    // const label = new BMap.Label('', {
    //   position: point,
    //   offset: new BMap.Size(0, -36)
    // })
    // label.setStyle(labelStyle)
    // label.setContent(`
    //   <span>${community}</span>
    //   <div class="${styles.mapArrow}"></div>
    // `)
    // map.addOverlay(label)
  }
  handleFavorite = async () => {
    if (getToken()) {
      const { isFavorite } = this.state;
      const { id } = this.props.match.params;
      const { data } = await Request({ url: `/user/favorites/${id}`, method: isFavorite ? "delete" : "post" });
      if (data.status === 200) {
        this.setState({ isFavorite: !isFavorite });
        Toast.success(isFavorite ? "取消收藏" : "添加收藏", 1, null, false);
      }
    } else {
      const { pathname } = this.props.location;
      Modal.alert("提示", "登陆后才可以收录房源,是否去登陆?", [
        { text: "取消" },
        {
          text: "确定",
          onPress: () =>
            this.props.history.push(`/login?redirect=${encodeURIComponent(pathname)}`, { from: this.props.location }),
        },
      ]);
    }
  };

  render() {
    const { houseInfo, isFavorite } = this.state;
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader className={styles.navHeader} rightContent={[<i key="share" className="iconfont icon-share" />]}>
          {houseInfo.community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {houseInfo.houseImg.length ? (
            // <Carousel autoplay infinite autoplayInterval={5000}></Carousel>
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>{houseInfo.title}</h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              {houseInfo.tags.map((item, index) => {
                const tagIndex = index + 1 <= 3 ? index + 1 : 3;
                return (
                  <span key={item} className={[styles.tag, styles["tag" + tagIndex]].join(" ")}>
                    {item}
                  </span>
                );
              })}
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {houseInfo.price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{houseInfo.roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{houseInfo.size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {houseInfo.floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {houseInfo.oriented.join("、")}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{houseInfo.community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {houseInfo.supporting.length > 0 ? (
            <HousePackage list={houseInfo.supporting} />
          ) : (
            <div className="title-empty">暂无数据</div>
          )}
          {/* <div className="title-empty">暂无数据</div> */}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + "/img/avatar.png"} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {/* {description || '暂无房屋描述'} */}
              {houseInfo.description || "暂无房屋描述"}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map((item) => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handleFavorite}>
            <img src={BASE_URL + (isFavorite ? "/img/star.png" : "/img/unstar.png")} alt="img" className={styles.favoriteImg} />
            <span className={styles.favorite}>{isFavorite ? "已收藏" : "收藏"}</span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}
