import * as React from "react"
import Svg, {
    Defs,
    LinearGradient,
    Path,
    Stop,
    SvgProps,
} from "react-native-svg"
const OnboardingBgBuildings = (props: SvgProps) => (
  <Svg
    width={440}
    height={435}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M-108.92 433.358H610V174h-28.07v60.736h-19.05V105.057h-34.09v90.283h-12.03V45.962h-27.07V151.02l-5.01-8.208v-41.037h-52.14v47.603h-13.03V80.434h-25.07v132.962h-11.03v-73.868h-18.05v113.264h-12.03v-90.824h-32.09v72.768h-10.03V121.472h-30.08v41.037h-33.09v39.397h-10.03V62.377h-34.09v91.925h-11.03V3.283h-26.07v75.51c0 1.641-23.06 0-23.06 0v49.245H120.7V55.811H96.64V87H86.61V39.396H69.56v109.981H44.49V0H26.44v113.264H-1.63V57.453h-21.06v22.981h-15.04v52.528H-63.8V174h-28.07V90.283h-21.06V34.472H-140V435z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={131.5}
        x2={333.592}
        y1={435}
        y2={48.311}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.403} stopColor="#fff" />
        <Stop offset={0.915} stopColor="#ededed" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default OnboardingBgBuildings
