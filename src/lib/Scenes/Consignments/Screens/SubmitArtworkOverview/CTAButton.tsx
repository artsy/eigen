import { Button } from "palette"
import React from "react"

export const CTAButton = ({ onPress, text }: { onPress: () => void; text: string }) => (
  <Button block haptic maxWidth={540} onPress={onPress}>
    {text}
  </Button>
)
