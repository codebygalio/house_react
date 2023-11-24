import "./index.scss";
import { Flex } from "antd-mobile-v2";
import { withRouter } from "react-router-dom";
import propTypes from 'prop-types'

function SearchHeader({ cityName, leftClick, history, className }) {
  return (
      <Flex className={["search-box",className&&className]}>
        <Flex className="search">
          <div className="location" onClick={() => leftClick && leftClick()}>
            <span className="name">{cityName}</span>
            <i className="iconfont icon-arrow" />
          </div>
          {/* 输入框 */}
          <div className="form" onClick={() => history.push("/search")}>
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区或地址</span>
          </div>
        </Flex>
        {/* 右侧地图图标 */}
        <i className="iconfont icon-map" onClick={() => history.go(-1)} />
      </Flex>
  );
}
SearchHeader.propTypes = {
    cityName: propTypes.string.isRequired,
    className: propTypes.string
}
export default withRouter(SearchHeader);
