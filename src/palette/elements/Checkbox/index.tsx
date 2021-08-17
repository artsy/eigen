import { ThemeV3 } from "palette"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"
import { Checkbox as CheckboxV3, CheckboxProps } from "./Checkbox"
import { Checkbox as CheckboxV2, CheckboxProps as CheckboxV2Props } from "./CheckboxV2"
export * from "./Check"

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  if (allowV3) {
    return (
      <ThemeV3>
        <CheckboxV3 {...props} />
      </ThemeV3>
    )
  }

  return <CheckboxV2 {...(props as CheckboxV2Props)} />
}
