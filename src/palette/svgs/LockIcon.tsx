import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const LockIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M5.45 8l.004-3.067C5.711 3.026 6.946 2.023 9 2.023c2.058 0 3.278 1.008 3.5 2.977v3h.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h.45zm1 0h5.05l.003-2.943c-.159-1.39-.938-2.034-2.503-2.034-1.568 0-2.367.648-2.55 1.977v3zM5 9v6h8V9H5zm3.5 2.046a.5.5 0 1 1 1 0V13a.5.5 0 1 1-1 0v-1.954z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
