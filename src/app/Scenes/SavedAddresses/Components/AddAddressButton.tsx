import { Button, ButtonProps } from "@artsy/palette-mobile"

interface Props {
  title: string
  handleOnPress: () => void
  disabled?: boolean
  variant?: ButtonProps["variant"]
  block?: boolean
}

export const AddAddressButton: React.FC<Props> = (props) => {
  const { handleOnPress, disabled, title, variant = "fillDark", block = true } = props
  return (
    <Button block={block} variant={variant} disabled={disabled} onPress={handleOnPress}>
      {title}
    </Button>
  )
}
