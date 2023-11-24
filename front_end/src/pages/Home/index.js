import React,{lazy} from "react";
import { Route } from "react-router-dom";
// import News from '../News'
import { TabBar } from "antd-mobile-v2";
import "./index.scss";

// import List from "../HouseList";
// import Profile from "../Profile";
// import News from "../News";
import Index from "../Index";
const List = lazy(()=>import("../HouseList"))
const Profile = lazy(()=>import("../Profile"))
const News = lazy(()=>import("../News"))

const tabItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/list",
  },
  {
    title: "资讯",
    icon: "icon-infom",
    path: "/home/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile",
  },
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.location.pathname,
    };
  }

  renderTabBarItem() {
    return tabItems.map((item) => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          });
          this.props.history.push(item.path);
        }}
      ></TabBar.Item>
    ));
  }
  componentDidUpdate(prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname){
      // console.log('z=',prevProps.location.pathname)
      this.setState({selectedTab: this.props.location.pathname})
    }
  }

  render() {
    return (
      <div className="home">
        <Route exact path="/home" component={Index} />
        <Route path="/home/list" component={List} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />
        <TabBar noRenderContent={true} tintColor="#21b97a" barTintColor="white" hidden={this.state.hidden}>
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    );
  }
}
