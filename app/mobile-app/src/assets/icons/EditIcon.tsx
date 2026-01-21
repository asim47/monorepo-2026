import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const EditIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#3CB588"
      d="m12.61.825-1.832 1.833H1.833V15.49h12.834V6.547L16.5 4.714v11.694c0 .506-.41.917-.917.917H.917A.917.917 0 0 1 0 16.408V1.74C0 1.235.41.825.917.825H12.61ZM16.029 0l1.297 1.296-8.427 8.427-1.294.002-.002-1.299L16.028 0Z"
    />
  </Svg>
)
export default EditIcon
