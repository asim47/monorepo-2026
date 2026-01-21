import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const LocationIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#808898"
      d="m13.273-2 .001 3.897a10.187 10.187 0 0 1 8.829 8.83H26v2.546l-3.897.001a10.187 10.187 0 0 1-8.829 8.829L13.273 26h-2.546v-3.897a10.187 10.187 0 0 1-8.83-8.829L-2 13.273v-2.546h3.897a10.187 10.187 0 0 1 8.83-8.83V-2h2.546ZM12 4.364a7.636 7.636 0 1 0 0 15.272 7.636 7.636 0 0 0 0-15.272Zm0 5.09a2.545 2.545 0 1 1 0 5.091 2.545 2.545 0 0 1 0-5.09Z"
    />
  </Svg>
)
export default LocationIcon
