import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import { Request } from "../../../../utils/request";
import Opacity from '../../../../components/Opacity'
import styles from "./index.module.scss";


const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: [],
};

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: "",
    filtersData: {},
    selectedValues,
  };
  componentDidMount() {
    this.htmlBody = document.body
    this.getFiltersData();
  }
  getFiltersData() {
    const { cityId } = this.props;
    Request({ url: `/houses/condition?id=${cityId}` }).then((res) => {
      // console.log('res = ',res.data.body )
      const {
        data: { body: filtersData },
      } = res;
      // 测试
      this.setState({ filtersData });
      // console.log('data=',cityData)
    });
  }
  updateTitleSelectedStatus(type = "") {
    const { selectedValues, titleSelectedStatus } = this.state;
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    Object.keys(selectedValues).forEach((key) => {
      if (key === type) {
        newTitleSelectedStatus[key] = true;
        return;
      }
      const selectVal = selectedValues[key];
      if (key === "area" && (selectVal.length !== 2 || selectVal[0] !== "area")) {
        newTitleSelectedStatus[key] = true;
        return;
      }
      // console.log('selectVal[0]=',selectVal[0])
      if ((key === "mode" || key === "price") && selectVal[0] !== "null") {
        newTitleSelectedStatus[key] = true;
        return;
      }
      if (key === "more" && selectVal[0] !== undefined) {
        newTitleSelectedStatus[key] = true;
        return;
      }
      newTitleSelectedStatus[key] = false;
    });
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus,
    });

    // console.log('newTitleSelectedStatus=',newTitleSelectedStatus)
  }

  onTitleClick = (type) => {
    this.htmlBody.classList.add('body-fixed')
    this.updateTitleSelectedStatus(type);
  };
  onCancel = () => {
    this.updateTitleSelectedStatus();
    this.htmlBody.classList.remove('body-fixed')
  };
  getHouseList = () => {
    const { getHouseList } = this.props;
    const {
      selectedValues: { area, mode, price, more },
    } = this.state;
    const filter = {};

    if (area.length === 3) {
      area[2] !== "null" ? (filter.area = area[2]) : (filter.area = area[1]);
    }
    if (area.length === 2 && area[1] !== "null") {
      filter.area = area[1];
    }
    if (area.length === 2 && area[0] !== "area") {
      filter.area = area[0];
    }
    if (mode[0] !== "null") {
      filter.mode = mode[0];
    }
    if (price[0] !== "null") {
      filter.price = price[0];
    }
    if (more.length > 0) {
      filter.more = more.join(",");
    }
    // ?newMode=mode[0]:'';
    // if(newArea.length ===)
    // console.log("filter=", filter);
    getHouseList(filter)
  };

  onSave = (type, value) => {
    this.htmlBody.classList.remove('body-fixed')
    this.setState({ openType: "", selectedValues: { ...this.state.selectedValues, [type]: value } });
    window.setTimeout(() => {
      this.updateTitleSelectedStatus();
      this.getHouseList();
    }, 0);
  };
  renderMask() {
    const { openType } = this.state;
    const isHide = openType === '' || openType === 'more'
    return (
      <Opacity isShow={!isHide}>
      <div className={styles.mask} onClick={() => this.onCancel()} />
      </Opacity>
    )
   
  }
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues,
    } = this.state;
    // console.log('rentType测试1=',rentType)
    // console.log('price测试2=',price)
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    let data = [];
    let cols = 3;
    let defaultValue = selectedValues[openType];
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        cols = 1;
        break;
      case "price":
        data = price;
        cols = 1;
        break;
      default:
        break;
    }
    // console.log('data1=',data)
    return (
      <FilterPicker
        type={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
      />
    );
  }

  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic },
    } = this.state;
    if (openType !== "more") return;
    const data = { roomType, oriented, floor, characteristic };
    // console.log('data=',data)
    const defaultValue = selectedValues.more;
    return (
      <FilterMore
        onCancel={this.onCancel}
        data={data}
        type={openType}
        onSave={this.onSave}
        defaultValue={defaultValue}
      />
    );
  }
  render() {
    const { openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        
        {this.renderMask()}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            key={openType}
            titleSelectedStatus={this.state.titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
