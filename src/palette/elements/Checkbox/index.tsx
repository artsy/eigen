import React from "react"
import { Checkbox as CheckboxV3, CheckboxProps } from "./Checkbox"
export * from "./Check"

export const Checkbox: React.FC<CheckboxProps> = (props) => <CheckboxV3 {...props} />
