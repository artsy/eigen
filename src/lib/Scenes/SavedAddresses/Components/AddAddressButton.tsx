import { Button } from "palette"
import React from "react"

interface Props {
  title: string
  handleOnPress: () => void
  disabled?: boolean
}

export const AddAddressButton: React.FC<Props> = (props) => {
  const { handleOnPress, disabled, title } = props
  return (
    <Button
      block
      borderRadius={50}
      variant="primaryBlack"
      width={100}
      disabled={disabled}
      onPress={() => {
        handleOnPress()
      }}
    >
      {title}
    </Button>
  )
}
