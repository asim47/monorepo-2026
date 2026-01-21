import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const HomeIcon = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      d="M10.662.186a1 1 0 0 0-1.162 0L0 6.972l1.162 1.627 8.92-6.37L19 8.599l1.163-1.627-9.5-6.786Zm7 10-7-5a1 1 0 0 0-1.162 0l-7 5a1 1 0 0 0-.419.814v6.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V11a1 1 0 0 0-.418-.814Z"
    />
  </Svg>
)
export default HomeIcon
