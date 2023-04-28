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
  const remainingCount = Math.max(maxLength - currentLength, 0)
  const label = `${remainingCount} character${remainingCount === 1 ? "" : "s"} remaining`

  return (
    <Text variant="xs" color="black60" {...rest}>
      {label}
    </Text>
  )
}
