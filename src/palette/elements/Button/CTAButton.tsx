import { Button } from "palette"
import { ButtonProps } from "palette"
import React from "react"

export const CTAButton: React.FC<ButtonProps> = (props) => (
  <Button block haptic maxWidth={540} {...props} />
)
