import { ThemeV3 } from "palette/Theme"
import React from "react"

// v3
import { Button as ButtonV3, ButtonProps as ButtonV3Props } from "./Button"
export { ButtonV3, ButtonV3Props }

// v2
import { ButtonProps as ButtonV2Props, ButtonV2 } from "./ButtonV2"
export { ButtonV2, ButtonV2Props }

export type ButtonProps = ButtonV2Props | ButtonV3Props
export type ButtonVariant = ButtonV2Props["variant"] | ButtonV3Props["variant"] // remove once it's not imported

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
  if (isV2Props(props)) {
    return (
      <ThemeV3>
        <ButtonV3 {...transformV3Props(props)} />
      </ThemeV3>
    )
  } else {
    return (
      <ThemeV3>
        <ButtonV3 {...props} />
      </ThemeV3>
    )
  }
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
