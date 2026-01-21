import * as React from "react";
import Svg, { Defs, LinearGradient, Rect, Stop, SvgProps } from "react-native-svg";

type Props = SvgProps & { children?: React.ReactNode };

/**
 * Scalable gradient background.
 * Use with `style={StyleSheet.absoluteFill}` and `pointerEvents="none"`
 * to act as a background layer behind normal React Native content.
 */
const GradientContainer = (props: Props) => (
  <Svg viewBox="0 0 120 80" preserveAspectRatio="none" fill="none" {...props}>
    <Rect width="100%" height="100%" fill="url(#a)" fillOpacity={0.1} rx={12} />
    <Defs>
      <LinearGradient
        id="a"
        x1={60}
        x2={60}
        y1={0}
        y2={80}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#3CB588" />
        <Stop offset={1} stopColor="#fff" />
      </LinearGradient>
    </Defs>
    {props.children}
  </Svg>
);

export default GradientContainer;
