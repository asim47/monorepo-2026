import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const ChatIcon = (props: SvgProps) => (
<Svg
    width={props.width}
    height={props.height}
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      d="M10 1c.906 0 1.783.122 2.617.348a6 6 0 0 0 7.294 8.339c.057.43.089.868.089 1.313 0 5.523-4.477 10-10 10a9.956 9.956 0 0 1-4.709-1.176L0 21l1.176-5.291A9.957 9.957 0 0 1 0 11C0 5.477 4.477 1 10 1Zm7.53-.68a.507.507 0 0 1 .94 0l.254.61a4.366 4.366 0 0 0 2.25 2.327l.717.32a.53.53 0 0 1 0 .962l-.758.338a4.363 4.363 0 0 0-2.22 2.251l-.246.565a.506.506 0 0 1-.934 0l-.247-.565a4.363 4.363 0 0 0-2.219-2.251l-.76-.338a.53.53 0 0 1 0-.963l.718-.32A4.367 4.367 0 0 0 17.276.932l.253-.612Z"
    />
  </Svg>
)
export default ChatIcon
