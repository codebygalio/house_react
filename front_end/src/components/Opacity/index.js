import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'

export default function Opacity({children, isShow}) {
  const [open, toggle] = useState(isShow)
    const props = useSpring({
        from: { opacity: 0 },
        to: { opacity: isShow?1:0 },
        onRest: resetProps=>{
          const {opacity} = resetProps.value
          toggle(opacity)
        }
      })    
      return (
        <animated.div style={props}>
            {isShow || open?children:null}
            </animated.div>
      )
}
 