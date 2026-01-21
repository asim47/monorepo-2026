import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const ListViewIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#fff"
      d="M20 9.999V17a1 1 0 0 1-1 1h-8V9.999h9Zm-11 0V18H1a1 1 0 0 1-1-1V9.999h9ZM9 0v7.999H0V1a1 1 0 0 1 1-1h8Zm10 0a1 1 0 0 1 1 1v6.999h-9V0h8Z"
    />
  </Svg>
)
export default ListViewIcon
