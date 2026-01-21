import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const EndTimeIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#3CB588"
      d="M10 0c5.52 0 10 4.48 10 10s-4.48 10-10 10S0 15.52 0 10 4.48 0 10 0Zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8Zm3.536-12.95 1.414 1.414-4.95 4.95L8.586 10l4.95-4.95Z"
    />
  </Svg>
)
export default EndTimeIcon
