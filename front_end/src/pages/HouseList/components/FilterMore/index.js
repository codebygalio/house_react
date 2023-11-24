import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue,
  };
  onTagClick = (value) => {
    const { selectedValues } = this.state;
    const newSelectedValues = [...selectedValues]
    const index = selectedValues.indexOf(value);
    if (index > -1) {
      newSelectedValues.splice(index, 1);
    } else {
      newSelectedValues.push(value);
    }

    this.setState({
      selectedValues:newSelectedValues,
    });
    // console.log("item=", value);
  };
  // 渲染标签
  renderFilters(data) {
    const { selectedValues } = this.state;
    // 高亮类名： styles.tagActive
    return data.map((item, index) => {
      const isSelected = selectedValues.includes(item.value);
      return (
        <span
          onClick={() => this.onTagClick(item.value)}
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")}
        >
          {item.label}
        </span>
      );
    });
    // return (

    // )
  }
  onCancel=()=>{
    this.setState({
      selectedValues:[]
    })
  }
  onOk= ()=>{
    const {type, onSave} = this.props
    onSave(type,this.state.selectedValues)
  }

  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      onCancel,
    } = this.props;
    // console.log('data=',data)
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onCancel}  />
        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter onOk={()=>this.onOk()} cancelText='清除' onCancel={this.onCancel} className={styles.footer} />
      </div>
    );
  }
}
