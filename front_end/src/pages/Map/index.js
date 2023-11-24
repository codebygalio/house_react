import React from 'react'
import UtHeader from '../../components/UtHeader'
import { Toast } from 'antd-mobile-v2'
// import { getCurrentCity } from '../../utils'
// import axios from 'axios'
// import { Request } from '../../utils/request'

import './index.scss'
export default class Map extends React.Component {
    async componentDidMount(){

        Toast.info('无开发者账号，无法使用地图功能', 1,null,false);
        // const curCity = await getCurrentCity()
        // console.log('curCit=',curCity)
        // const {data } = await axios.get('http://127.0.0.1:8080/area/map',{params:{id:curCity.value}})
        // console.log('房源数据=',data)
    }
 render() {
    return (<div className='map'>
        <UtHeader >地图找房</UtHeader>
    </div>)
 }
}