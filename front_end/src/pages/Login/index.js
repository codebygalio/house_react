import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile-v2'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'
import {Request} from '../../utils/request'
import {setToken} from '../../utils'

import { withFormik,Form,Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';


import styles from './index.module.scss'


// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state= {}
    handleSubmit= async(e) => {
    }
    
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage name="username" className={styles.error} component="div"/>
            {/* {errors.username && touched.username && <div className={styles.error}>{errors.username}</div>} */}
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage name="password" className={styles.error} component="div"/>
            {/* {errors.password && touched.password && <div className={styles.error}>{errors.password}</div>} */}
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  mapPropsToValues: ()=> ({
    username: '',
    password: ''
  }),
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),
  handleSubmit: async(values,{props}) => {
    // e.preventDefault()
      const {data} = await Request({url:'/user/login',data:values,method: 'POST'})
      if(data.status === 200){
        setToken(data.body.token)
        Toast.success('登陆成功')
        const beforeRedirect = props.location.state
        if(beforeRedirect) return props.history.replace(beforeRedirect.from)
        // if(this.props.)
        // console.log('beforeRedirect=',beforeRedirect)
        props.history.replace('/home/profile')
        // props.history.go(-1)
      }else{
        Toast.info(data.description,2,null, false)
      }
      console.log('data=',data)
  }
})(Login)

export default Login
