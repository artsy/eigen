import { useColor } from "palette/hooks"
import { ClipPath, Defs } from "react-native-svg"
import { G, Icon, IconProps, Path } from "./Icon"

export const Tag2Icon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <G clipPath="url(#clip0_2381_10824)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.276 3.759a1 1 0 01.774.29l6.557 6.558a1 1 0 010 1.414l-4.95 4.95a1 1 0 01-1.414 0l-6.557-6.557a1 1 0 01-.291-.774L3.705 5c.004-.067.014-.131.031-.193l-.918-.918a.5.5 0 01.707-.707l.918.918c.062-.017.126-.027.193-.032l4.64-.31zm-4.618 1.97l-.265 3.977 6.557 6.558 4.95-4.95-6.558-6.557-3.977.265L7.12 6.778a1.5 1.5 0 11-.707.707L4.658 5.729zm3.463 2.05a.5.5 0 10-.707.706.5.5 0 00.707-.707z"
          fill={color(props.fill)}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2381_10824">
          <Path fill="#fff" d="M0 0H18V18H0z" />
        </ClipPath>
      </Defs>
    </Icon>
  )
}
