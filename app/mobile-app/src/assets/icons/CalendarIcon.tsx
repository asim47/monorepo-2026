import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const CalendarIcon = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      d="M5 0v2H1a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h7.755A8 8 0 0 1 20 8.755V3a1 1 0 0 0-1-1h-4V0h-2v2H7V0H5Zm16 15a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-7-4v4.414l2.293 2.293 1.414-1.414L16 14.586V11h-2Z"
    />
  </Svg>
)
export default CalendarIcon
