import * as React from "react"
import Svg, { Circle, Path, Rect, SvgProps } from "react-native-svg"
const VerifyOTPIcon = (props: SvgProps) => (
  <Svg
    width={102}
    height={74}
    fill="none"
    {...props}
  >
    <Path
      fill="#373d49"
      fillOpacity={0.2}
      d="M3.7 0h44.4a3.7 3.7 0 0 1 3.7 3.7v66.6a3.7 3.7 0 0 1-3.7 3.7H3.7A3.7 3.7 0 0 1 0 70.3V3.7A3.7 3.7 0 0 1 3.7 0m22.2 55.5a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4"
    />
    <Rect
      width={81.4}
      height={27.133}
      x={19.733}
      y={16.033}
      fill="#3cb588"
      rx={13.567}
    />
    <Circle cx={36.383} cy={28.983} r={4.317} fill="#fff" />
    <Circle cx={52.417} cy={28.983} r={4.317} fill="#fff" />
    <Circle cx={68.45} cy={28.983} r={4.317} fill="#fff" />
    <Circle cx={84.483} cy={28.983} r={4.317} fill="#fff" />
  </Svg>
)
export default VerifyOTPIcon
