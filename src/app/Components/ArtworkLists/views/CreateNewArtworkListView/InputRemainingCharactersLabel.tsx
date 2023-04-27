import { Text, TextProps } from "@artsy/palette-mobile"

interface InputRemainingCharactersLabelProps extends TextProps {
  currentLength: number
  maxLength: number
}

export const InputRemainingCharactersLabel = ({
  currentLength,
  maxLength,
  ...rest
}: InputRemainingCharactersLabelProps) => {
  const remainingCount = maxLength - currentLength

  return (
    <Text variant="xs" color="black60" {...rest}>
      {getLabel(remainingCount)}
    </Text>
  )
}

const getLabel = (count: number) => {
  if (count === 1) {
    return "1 character remaining"
  }

  return `${count} characters remaining`
}
