import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const CarIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill="#3CB588"
      d="M17 16H3v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7l2.48-5.788A2 2 0 0 1 4.32 0h11.36a2 2 0 0 1 1.839 1.212L20 7v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1Zm1-7H2v5h16V9ZM2.176 7h15.648l-2.143-5H4.32L2.176 7ZM4.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
    />
  </Svg>
)
export default CarIcon
