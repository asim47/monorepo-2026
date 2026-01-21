import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const MapIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#fff"
      d="m0 3 7-3 6 3L19.303.299a.5.5 0 0 1 .697.46V17l-7 3-6-3-6.303 2.701a.5.5 0 0 1-.697-.46V3Zm13 14.764V5.176l-.065.028L7 2.236v12.588l.065-.028L13 17.764Z"
    />
  </Svg>
)
export default MapIcon
