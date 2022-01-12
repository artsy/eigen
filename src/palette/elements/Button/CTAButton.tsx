import { Button } from "palette"
import React from "react"
import { ButtonProps } from "react-native-share"

export const CTAButton: React.FC<ButtonProps> = ({ children }, props) => (
  <Button block haptic maxWidth={540} {...props}>
    {children}
  </Button>
)
