import Svg, { Path } from "react-native-svg"

type CameraIconProps = React.ComponentProps<typeof Svg> & {
  fill?: string
}

const CameraIcon = ({ fill = "#666", ...props }: CameraIconProps) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" {...props}>
    <Path
      d="M9.4 3l-1.83 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.57L14.6 3H9.4zM12 18c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      fill={fill}
      fillRule="nonzero"
    />
  </Svg>
)

export default CameraIcon
