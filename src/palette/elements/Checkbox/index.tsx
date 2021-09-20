import { ThemeV3 } from "palette"
import React from "react"
import { Checkbox as CheckboxV3, CheckboxProps } from "./Checkbox"
export * from "./Check"

export const Checkbox: React.FC<CheckboxProps> = (props) => (
  <ThemeV3>
    <CheckboxV3 {...props} />
  </ThemeV3>
)
