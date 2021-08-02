import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"

import { Button as ButtonV3, ButtonProps as ButtonPropsV3, ButtonSize, ButtonVariant } from "./Button"
import { ButtonProps as ButtonPropsV2, ButtonV2 } from "./ButtonV2"
export * from "./Button"

export { ButtonV2, ButtonVariant } from "./ButtonV2"

export const Button: React.FC<ButtonPropsV2> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  if (allowV3) {
    return <ButtonV3 {...transformV3Props(props)} />
  }

  return <ButtonV2 {...(props as ButtonPropsV2)} />
}

const transformV3Props = (props: ButtonPropsV2): ButtonPropsV3 => {
  const sizeMap: { [key: string]: ButtonSize } = {
    small: "small",
    medium: "small",
    large: "large",
  }

  const variantMap: { [key: string]: ButtonVariant } = {
    primaryBlack: "fillDark",
    primaryWhite: "fillLight",
    secondaryGray: "fillGray",
    secondaryOutline: "outline",
    secondaryOutlineWarning: "outline",
    noOutline: "text",
  }

  const size = props.size && sizeMap[props.size]
  const variant = props.variant && variantMap[props.variant]

  return { ...props, size, variant } as ButtonPropsV3
}
