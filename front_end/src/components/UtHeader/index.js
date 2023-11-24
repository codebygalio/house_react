import React from "react";
import { NavBar } from "antd-mobile-v2";
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import './index.scss'


function UtHeader(props) {
    const defaultOnleftClick = ()=> props.history.go(-1)
    return (
        <div>
            <NavBar
          className="navbar"
          icon={<i className="iconfont icon-back" />}
        //   onLeftClick={() => this.props.history.go(-1)}
        onLeftClick={props.onLeftClick || defaultOnleftClick}
        >
            {props.children?props.children: '城市选择'}
        </NavBar>
        </div>
    )
}
UtHeader.propTypes = {
    children: propTypes.string,
    onLeftClick: propTypes.func
}
export default withRouter(UtHeader)