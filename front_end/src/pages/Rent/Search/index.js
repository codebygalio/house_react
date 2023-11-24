import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile-v2'

import { getCity,Request } from '../../../utils'

import styles from './index.module.scss'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value
  timerId = null
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  handleSearchText=(searchTxt)=>{
    this.setState({searchTxt})
    if(!searchTxt.trim()) return this.setState({tipsList:[]})
    if(this.timerId)clearTimeout(this.timerId)
    this.timerId = setTimeout(async() => {
      const {data} = await Request.get('/area/community',{params:{name:searchTxt,id:this.cityId}})
    this.setState({tipsList:data.body})
    }, 500);

    // console.log('onChange=',data)
  }
  onTipClick = item => {
    // console.log('ite=',item)
    this.props.history.replace('/rent/add',{name:item.cityName,id:item.community})
  }
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={()=> this.onTipClick(item)}>
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={this.handleSearchText}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
