import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const CrossIcon = (props: SvgProps) => (
  <Svg
    width={19}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      fill={props.fill ?? "#fff"}
      d="M9.167 18.333A9.167 9.167 0 1 1 9.167 0a9.167 9.167 0 0 1 0 18.333Zm0-10.463L6.574 5.278 5.278 6.574 7.87 9.167l-2.592 2.592 1.296 1.297 2.593-2.593 2.592 2.593 1.297-1.297-2.593-2.592 2.593-2.593-1.297-1.296L9.167 7.87Z"
    />
  </Svg>
)
export default CrossIcon
