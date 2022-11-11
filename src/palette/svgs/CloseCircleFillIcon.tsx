import { useColor } from "palette/hooks"
import { Icon, IconProps, Path } from "./Icon"

/** CloseCircleIcon */
export const CloseCircleFillIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17ZM12.502 6.28005L9.78199 9.00005L12.502 11.72L11.72 12.502L8.99999 9.78205L6.27999 12.502L5.49799 11.72L8.21799 9.00005L5.49799 6.28005L6.27999 5.49805L8.99999 8.21805L11.72 5.49805L12.502 6.28005Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={color(props.fill)}
      />
    </Icon>
  )
}
