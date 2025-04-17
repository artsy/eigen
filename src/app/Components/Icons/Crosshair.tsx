import { useColor, Color } from "@artsy/palette-mobile"
import Svg, { Circle, G, Path } from "react-native-svg"

const Crosshair: React.FC<{ color?: Color }> = (props) => {
  const color = useColor()
  return (
    <Svg width={22} height={22} {...props}>
      <G fill="#000" fillRule="evenodd">
        <Circle cx={10.631} cy={10.631} r={2.858} />
        <Path
          d="M20.488 10.168h-1.87a7.991 7.991 0 0 0-7.525-7.524V.752a.466.466 0 0 0-.462-.462.466.466 0 0 0-.463.462v1.892c-4.077.231-7.335 3.531-7.524 7.63H.774a.466.466 0 0 0-.463.462c0 .252.21.462.462.462h1.871a7.99 7.99 0 0 0 7.503 7.42v1.89c0 .253.21.463.463.463.252 0 .462-.21.462-.462v-1.892a7.994 7.994 0 0 0 7.545-7.524h1.87c.253 0 .463-.21.463-.462a.466.466 0 0 0-.462-.463zm-9.752 7.525c-.042 0-.063-.021-.105-.021-.042 0-.084 0-.105.02-3.847-.041-6.957-3.194-6.957-7.061a7.064 7.064 0 0 1 7.062-7.062 7.064 7.064 0 0 1 7.062 7.062c0 3.867-3.111 7.02-6.957 7.062z"
          stroke={color(props.color ?? "mono100")}
          strokeWidth={0.15}
          fillRule="nonzero"
        />
      </G>
    </Svg>
  )
}

export default Crosshair
