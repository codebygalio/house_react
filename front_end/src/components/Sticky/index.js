import styles from  './index.module.scss'
import PropsTypes from 'prop-types'
import React,{Component, createRef} from 'react'

class Sticky extends Component {
    placeholder = createRef()
    content = createRef()
    handleScroll = ()=>{
        const placeholderEl = this.placeholder.current
        const contentEl = this.content.current
        const {top} = placeholderEl.getBoundingClientRect()
        // console.log('contentEl',contentEl.getBoundingClientRect().top)
        // console.log('top=',top)
        if(top < 0){
            contentEl.classList.add(styles.fixed)
            placeholderEl.style.height = `${contentEl.offsetHeight}px`
        }else{
            contentEl.classList.remove(styles.fixed)
            placeholderEl.style.height = '0px'
        }   
        // console.log('obj=',obj)
    }
    componentDidMount() {
        window.addEventListener('scroll',this.handleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll',this.handleScroll)
    }
    render() {
        return (
            <div>
                <div ref={this.placeholder}></div>
                <div ref={this.content}>{this.props.children}</div>
            </div>
        )
    }
}

Sticky.PropsTypes = {
    height: PropsTypes.number.isRequired 
}
export default Sticky

