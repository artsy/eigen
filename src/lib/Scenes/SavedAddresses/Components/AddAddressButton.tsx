import { Button, ButtonVariant } from "palette"
import React from "react"

interface Props {
  title: string
  handleOnPress: () => void
  disabled?: boolean
  variant?: ButtonVariant
  block?: boolean
}

export const AddAddressButton: React.FC<Props> = (props) => {
  const { handleOnPress, disabled, title, variant = "primaryBlack", block = true } = props
  return (
    <Button block={block} variant={variant} disabled={disabled} onPress={handleOnPress}>
      {title}
    </Button>
  )
}
