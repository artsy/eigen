import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** CertificateIcon */
export const CertificateIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9.001 4.45a3.73 3.73 0 012.925 6.044v5.347L9 14.281l-2.924 1.56v-5.347A3.73 3.73 0 019.002 4.45zm2.027 9.896V11.31a3.712 3.712 0 01-2.027.599c-.747 0-1.444-.22-2.027-.599v3.036l2.027-1.083 2.027 1.083V11.31zM14.658 2c.742 0 1.345.602 1.345 1.345v8.512c0 .744-.603 1.346-1.346 1.346l-1.793-.001v-.897h1.793c.248 0 .449-.2.449-.448V3.345c0-.247-.201-.448-.449-.448H3.345c-.247 0-.448.2-.448.448v8.512c0 .248.2.449.448.449l1.792-.001v.897H3.345A1.345 1.345 0 012 11.858V3.345C2 2.602 2.602 2 3.345 2h11.312zM9 5.347a2.833 2.833 0 100 5.665 2.833 2.833 0 000-5.665z"
        fill={color(props.fill) || color("black100")}
        fillRule="nonzero"
      />
    </Icon>
  )
}
