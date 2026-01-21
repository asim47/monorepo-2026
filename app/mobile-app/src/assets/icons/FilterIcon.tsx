import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const FilterIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#fff"
      d="M4.518 17.333a3.251 3.251 0 0 1 6.13 0h11.019V19.5H10.648a3.251 3.251 0 0 1-6.13 0H0v-2.167h4.518Zm6.5-7.583a3.251 3.251 0 0 1 6.13 0h4.519v2.167h-4.519a3.251 3.251 0 0 1-6.13 0H0V9.75h11.018Zm-6.5-7.583a3.251 3.251 0 0 1 6.13 0h11.019v2.166H10.648a3.251 3.251 0 0 1-6.13 0H0V2.167h4.518Z"
    />
  </Svg>
)
export default FilterIcon
