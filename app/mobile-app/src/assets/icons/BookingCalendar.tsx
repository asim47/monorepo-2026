import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const BookingCalendar = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#3CB588"
      d="M7 0v2h6V0h2v2h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4V0h2Zm11 9H2v9h16V9Zm-4.964 1.136 1.414 1.414L9.5 16.5l-3.536-3.536L7.38 11.55l2.12 2.122 3.536-3.536ZM5 4H2v3h16V4h-3v1h-2V4H7v1H5V4Z"
    />
  </Svg>
)
export default BookingCalendar
