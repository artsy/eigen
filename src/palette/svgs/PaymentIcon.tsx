import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** PaymentIcon */
export const PaymentIcon: React.SFC<IconProps> = ({
  title = "Payment",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 28 28">
      <Title>{title}</Title>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.5 5C2.22386 5 2 5.22386 2 5.5V9.5V11V22.5C2 22.7761 2.22386 23 2.5 23H25.5C25.7761 23 26 22.7761 26 22.5V11V9.5V5.5C26 5.22386 25.7761 5 25.5 5H2.5ZM3.5 21.5V11H24.5V21.5H3.5ZM3.5 9.5H24.5V6.5H3.5V9.5ZM11 14H5V15.5H11V14Z"
        fill={color(props.fill)}
      />
    </Icon>
  )
}
