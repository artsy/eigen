import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"

// v3
import { Button as ButtonV3, ButtonProps as ButtonV3Props } from "./Button"
export { ButtonV3, ButtonV3Props }

// v2
import { ButtonProps as ButtonV2Props, ButtonV2 } from "./ButtonV2"
export { ButtonV2, ButtonV2Props }

export type ButtonProps = ButtonV2Props | ButtonV3Props

const isV2Props = (props: ButtonProps): props is ButtonV2Props => {
  const v2Variants: Array<ButtonV2Props["variant"]> = [
    "primaryBlack",
    "primaryWhite",
    "secondaryGray",
    "secondaryOutline",
    "secondaryOutlineWarning",
    "noOutline",
  ]
  if (v2Variants.includes(props.variant as any)) {
    return true
  }

  const v3Variants: Array<ButtonV3Props["variant"]> = ["fillDark", "fillLight", "fillGray", "outline", "text"]
  if (v3Variants.includes(props.variant as any)) {
    return false
  }

  if (props.size === "medium") {
    return true
  }

  // if nothing is obviously v2 or v3, assume v2
  return true
}

export const Button: React.FC<ButtonProps> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  if (allowV3) {
    if (isV2Props(props)) {
      return <ButtonV3 {...transformV3Props(props)} />
    } else {
      return <ButtonV3 {...props} />
    }
  }

  if (isV2Props(props)) {
    return <ButtonV2 {...props} />
  }
  throw new Error("ButtonV2 used with v3 props. Don't do that.")
}

const transformV3Props = (props: ButtonV2Props): ButtonV3Props => {
  const sizeMap: { [key: string]: ButtonV3Props["size"] } = {
    small: "small",
    medium: "small",
    large: "large",
  }

  const variantMap: { [key: string]: ButtonV3Props["variant"] } = {
    primaryBlack: "fillDark",
    primaryWhite: "fillLight",
    secondaryGray: "fillGray",
    secondaryOutline: "outline",
    secondaryOutlineWarning: "outline",
    noOutline: "text",
  }

  const size = props.size && sizeMap[props.size]
  const variant = props.variant && variantMap[props.variant]

  return { ...props, size, variant } as ButtonV3Props
}
