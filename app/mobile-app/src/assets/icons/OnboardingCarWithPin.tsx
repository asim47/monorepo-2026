import * as React from "react"
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  SvgProps,
} from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={294}
    height={223}
    fill="none"
    {...props}
  >
    <Ellipse
      cx={147}
      cy={213}
      fill="#d9d9d9"
      fillOpacity={0.2}
      rx={147}
      ry={10}
    />
    <Path
      fill="url(#a)"
      d="M81.007 138.228c-.503-.535-50.38-54.15-50.38-87.541C30.626 22.737 53.363 0 81.312 0S132 22.738 132 50.687c0 33.991-49.878 87.016-50.381 87.541l-.306.328zm.306-119.38c-17.537 0-31.795 14.258-31.795 31.795S63.776 82.44 81.313 82.44s31.795-14.26 31.795-31.796S98.85 18.848 81.313 18.848"
    />
    <Path
      fill="url(#b)"
      d="M81.313.415c-27.763 0-50.271 22.508-50.271 50.272 0 33.609 50.271 87.257 50.271 87.257s50.272-53.036 50.272-87.257c0-27.764-22.508-50.272-50.272-50.272m0 82.439c-17.788 0-32.21-14.423-32.21-32.21 0-17.789 14.422-32.211 32.21-32.211s32.211 14.422 32.211 32.21-14.423 32.21-32.21 32.21"
    />
    <Path fill="url(#c)" d="M209.192 184.546H80.194v13.787h128.998z" />
    <Path
      fill="url(#d)"
      d="M64.889 182.339H87.91v23.392c0 2.334-1.9 4.221-4.222 4.221H69.123a4.226 4.226 0 0 1-4.221-4.221v-23.392z"
    />
    <Path
      fill="url(#e)"
      d="M223.591 209.978h-14.565a4.227 4.227 0 0 1-4.222-4.222v-23.391h23.022v23.391c0 2.334-1.9 4.222-4.222 4.222z"
    />
    <Path
      fill="#3cb588"
      d="m83.791 129.358-13.685-.676a4.972 4.972 0 0 1 .255-9.936h4.425a6.33 6.33 0 0 1 5.79 3.763l1.149 2.576h6.415zm125.108 0 13.685-.676a4.972 4.972 0 0 0-.255-9.936h-4.426a6.33 6.33 0 0 0-5.79 3.763l-1.148 2.576h-6.416z"
    />
    <Path
      fill="#3cb588"
      d="M230.211 154.382v26.643c0 1.697-.395 3.368-1.122 4.898l-1.531 3.201a11.31 11.31 0 0 1-10.203 6.403h-20.522c-1.403 0-2.781-.255-4.082-.765l-3.175-1.225a26.8 26.8 0 0 0-9.796-1.836h-66.871c-3.367 0-6.683.612-9.808 1.836l-3.176 1.225a11.2 11.2 0 0 1-4.081.765H75.322c-4.35 0-8.316-2.487-10.178-6.403l-1.543-3.201a11.4 11.4 0 0 1-1.11-4.898v-26.643c0-2.896 1.11-5.689 3.112-7.793l4.197-4.413s0-.013.012-.039l.217-.216 13.788-14.515s4.744-13.634 14.897-28.48c0 0 6.798-3.036 46.196-3.176l2.857-.013c39.411.14 46.209 3.189 46.209 3.189 10.152 14.846 14.897 28.48 14.897 28.48l14.91 15.701h.013l3.29 3.469a11.36 11.36 0 0 1 3.112 7.793z"
    />
    <Path
      fill="#3cb588"
      d="M230.211 154.382v26.643c0 1.697-.395 3.368-1.122 4.898l-1.531 3.201a11.31 11.31 0 0 1-10.203 6.403h-20.522c-1.403 0-2.781-.255-4.082-.765l-3.175-1.225a26.8 26.8 0 0 0-9.796-1.836h-66.871c-3.367 0-6.683.612-9.808 1.836l-3.176 1.225a11.2 11.2 0 0 1-4.081.765H75.322c-4.35 0-8.316-2.487-10.178-6.403l-1.543-3.201a11.4 11.4 0 0 1-1.11-4.898v-26.643c0-2.896 1.11-5.689 3.112-7.793l4.197-4.413c-1.722 3.022 26.605 13.749 39.64 14.642 13.405.905 60.8.484 73.835 0 13.035-.511 37.23-8.584 40.533-13.699h.013l3.291 3.47a11.37 11.37 0 0 1 3.112 7.793z"
    />
    <Path
      fill="url(#f)"
      d="M204.996 127.176c-4.349-.242-11.454-.471-19.259-.688-2.819-.064-5.74-.141-8.648-.217-9.502-.217-18.953-.357-25.037-.434a422 422 0 0 0-5.714-.051c-6.772 0-45.418.638-58.657 1.378 2.015-7.104 8.916-18.558 12.576-24.935 2.551-.842 6.084-1.467 10.267-1.9 4.018-.434 8.622-.715 13.507-.88 3.788-.128 7.729-.217 11.696-.243 3.558-.05 7.142-.05 10.624-.05 1.786 0 3.61 0 5.446.012 1.301 0 2.615 0 3.916.013 10.854.076 21.67.408 29.462 1.492 2.883.408 5.357.905 7.258 1.543 1.25 2.181 2.895 4.962 4.604 7.972a201 201 0 0 1 4.018 7.499c.982 1.952 1.875 3.852 2.589 5.625.574 1.365 1.046 2.666 1.365 3.839z"
    />
    <Path
      fill="url(#g)"
      d="M183.262 156.818s-22.664 1.313-36.911 1.313c-16.198 0-36.911-1.313-36.911-1.313s-12.257 4.617-12.257 9.872c0 4.043 7.092 14.948 10.369 19.769a5.34 5.34 0 0 0 4.439 2.347h68.733c1.786 0 3.444-.88 4.439-2.347 3.278-4.821 10.369-15.726 10.369-19.769 0-5.255-12.257-9.872-12.257-9.872z"
    />
    <Path
      fill="url(#h)"
      d="M79.71 185.043a5.114 5.114 0 0 1-5.115 5.115 5.12 5.12 0 0 1-5.114-5.115 5.12 5.12 0 0 1 5.114-5.114 5.12 5.12 0 0 1 5.115 5.114"
    />
    <Path
      fill="url(#i)"
      d="M74.595 188.372a3.329 3.329 0 1 0 0-6.657 3.329 3.329 0 0 0 0 6.657"
    />
    <Path
      fill="url(#j)"
      d="M212.992 185.043a5.114 5.114 0 0 0 5.115 5.115 5.12 5.12 0 0 0 5.114-5.115 5.12 5.12 0 0 0-5.114-5.114 5.12 5.12 0 0 0-5.115 5.114"
    />
    <Path
      fill="url(#k)"
      d="M218.107 188.372a3.33 3.33 0 1 0 0-6.658 3.33 3.33 0 0 0 0 6.658"
    />
    <Path
      fill="url(#l)"
      d="M72.223 145.249c-2.475-.306-5.306 1.518-6.632 5.026-.753 1.989-.778 4.77-.6 7.384 6.365 6.365 21.249 6.531 25.139 6.123 3.89-.409 12.729-5.332 13.685-7.475s-27.766-10.586-31.592-11.058"
    />
    <Path
      fill="url(#m)"
      d="M75.386 159.088a5.05 5.05 0 1 0 0-10.101 5.05 5.05 0 0 0 0 10.101"
      
    />
    <Path
      fill="url(#n)"
      d="M91.112 156.818a4.22 4.22 0 0 1-4.222 4.221 4.22 4.22 0 0 1-4.221-4.221 4.22 4.22 0 0 1 4.221-4.222 4.22 4.22 0 0 1 4.222 4.222"
    />
    <Path
      fill="url(#o)"
      d="M220.479 145.249c2.475-.306 5.306 1.518 6.633 5.026.752 1.989.778 4.77.599 7.384-6.364 6.365-21.249 6.531-25.139 6.123-3.89-.409-12.729-5.332-13.685-7.475s27.766-10.586 31.592-11.058"
    />
    <Path
      fill="url(#p)"
      d="M217.304 159.088a5.05 5.05 0 1 0 0-10.1 5.05 5.05 0 0 0 0 10.1"
    />
    <Path
      fill="url(#q)"
      d="M201.577 156.818a4.22 4.22 0 0 0 4.222 4.221 4.22 4.22 0 0 0 4.222-4.221 4.22 4.22 0 0 0-4.222-4.222 4.22 4.22 0 0 0-4.222 4.222"
    />
    <Path
      fill="url(#r)"
      d="M166.286 175.018h-39.168a.574.574 0 0 0-.574.574v8.877c0 .317.257.574.574.574h39.168a.574.574 0 0 0 .574-.574v-8.877a.574.574 0 0 0-.574-.574"
    />
    <Path
      fill="url(#s)"
      d="M150.024 167.786h-7.333a2.906 2.906 0 0 1-2.908-2.908 2.907 2.907 0 0 1 2.908-2.908h7.333a2.906 2.906 0 0 1 2.908 2.908c0 1.608-1.3 2.908-2.908 2.908"
    />
    <Path
      fill="url(#t)"
      d="M201.578 123.414c-5.753.791-15.675 1.709-26.81.676-15.471-1.467-31.44-14.336-36.835-23.277 3.342-.051 6.696-.051 9.949-.051 1.671 0 3.38 0 5.101.013 1.225 0 2.449 0 3.674.013 10.165.076 20.305.382 27.613 1.403 2.704.382 5.012.854 6.798 1.454 1.173 2.04 2.717 4.655 4.311 7.474a197 197 0 0 1 3.763 7.027c.918 1.824 1.747 3.61 2.423 5.281z"
    />
    <Path
      fill="url(#u)"
      d="M82.682 130.684c-5.893 5.892-10.88 9.527-8.916 11.504 1.964 1.965 30.075 13.329 44.87 13.329s54.576 2.576 65.876-.944 33.187-9.196 35.011-11.02-10.344-12.869-10.344-12.869z"
    />
    <Path
      fill="url(#v)"
      d="M220.326 127.495h2.398a3.96 3.96 0 0 0 3.954-3.954 3.957 3.957 0 0 0-3.954-3.953h-2.398a3.956 3.956 0 0 0-3.953 3.953 3.957 3.957 0 0 0 3.953 3.954"
    />
    <Path
      fill="url(#w)"
      d="M70.067 127.495h2.398a3.957 3.957 0 0 0 3.954-3.954 3.957 3.957 0 0 0-3.954-3.953h-2.398a3.957 3.957 0 0 0-3.953 3.953 3.957 3.957 0 0 0 3.953 3.954"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={38.624}
        x2={111.142}
        y1={26.879}
        y2={86.317}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#f2b90f" />
        <Stop offset={1} stopColor="#f27405" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={81.313}
        x2={81.313}
        y1={-2.196}
        y2={137.638}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#f2b90f" />
        <Stop offset={1} stopColor="#f27405" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={144.693}
        x2={144.693}
        y1={198.869}
        y2={191.025}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={76.393}
        x2={76.393}
        y1={209.48}
        y2={191.777}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="e"
        x1={216.309}
        x2={216.309}
        y1={209.48}
        y2={191.777}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="f"
        x1={184.155}
        x2={105.525}
        y1={95.558}
        y2={143.336}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="g"
        x1={146.568}
        x2={146.287}
        y1={188.525}
        y2={160.848}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="h"
        x1={74.646}
        x2={74.557}
        y1={189.979}
        y2={181.306}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="i"
        x1={74.621}
        x2={74.57}
        y1={188.257}
        y2={182.62}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </LinearGradient>
      <LinearGradient
        id="j"
        x1={218.056}
        x2={218.132}
        y1={189.979}
        y2={181.306}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="k"
        x1={218.069}
        x2={218.12}
        y1={188.257}
        y2={182.62}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </LinearGradient>
      <LinearGradient
        id="l"
        x1={84.442}
        x2={84.276}
        y1={163.59}
        y2={147.635}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </LinearGradient>
      <LinearGradient
        id="o"
        x1={208.274}
        x2={208.427}
        y1={163.59}
        y2={147.635}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </LinearGradient>
      <LinearGradient
        id="r"
        x1={169.794}
        x2={109.134}
        y1={166.715}
        y2={201.7}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </LinearGradient>
      <LinearGradient
        id="s"
        x1={146.351}
        x2={146.351}
        y1={161.945}
        y2={165.465}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </LinearGradient>
      <LinearGradient
        id="t"
        x1={169.641}
        x2={169.845}
        y1={123.975}
        y2={104.091}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} stopColor="#13192e" />
      </LinearGradient>
      <LinearGradient
        id="u"
        x1={146.389}
        x2={146.606}
        y1={155.81}
        y2={133.592}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#3cb588" />
        <Stop offset={1} stopColor="#3cb588"/>
      </LinearGradient>
      <LinearGradient
        id="v"
        x1={221.525}
        x2={221.525}
        y1={119.741}
        y2={126.437}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} />
      </LinearGradient>
      <LinearGradient
        id="w"
        x1={71.266}
        x2={71.266}
        y1={119.741}
        y2={126.437}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#2c3e63" />
        <Stop offset={1} />
      </LinearGradient>
      <RadialGradient
        id="m"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="translate(75.386 154.037) scale(5.05073)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </RadialGradient>
      <RadialGradient
        id="n"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="translate(86.903 156.818) scale(4.22169)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </RadialGradient>
      <RadialGradient
        id="p"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(180 108.658 -3.531) scale(5.05073)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </RadialGradient>
      <RadialGradient
        id="q"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(180 102.9 78.409) scale(4.22169)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ebeff7" />
        <Stop offset={1} stopColor="#b3b6c2" />
      </RadialGradient>
    </Defs>
  </Svg>
)
export default SvgComponent
