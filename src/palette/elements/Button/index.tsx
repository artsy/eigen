import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"

import { Button as ButtonV3, ButtonProps as ButtonPropsV3 } from "./Button"
import { ButtonProps as ButtonPropsV2, ButtonV2 } from "./ButtonV2"
export * from "./Button"

export const Button: React.FC<ButtonPropsV3 | ButtonPropsV2> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  if (allowV3) {
    const size = props.size === "medium" ? "small" : props.size

    return <ButtonV3 {...({ ...props, size } as ButtonPropsV3)} />
  }

  return <ButtonV2 {...(props as ButtonPropsV2)} />
}
