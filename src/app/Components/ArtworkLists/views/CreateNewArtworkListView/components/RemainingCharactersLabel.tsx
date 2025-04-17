import { Text, TextProps } from "@artsy/palette-mobile"

interface RemainingCharactersLabelProps extends TextProps {
  currentLength: number
  maxLength: number
}

export const RemainingCharactersLabel = ({
  currentLength,
  maxLength,
  ...rest
}: RemainingCharactersLabelProps) => {
  const remainingCount = Math.max(maxLength - currentLength, 0)
  const label = `${remainingCount} character${remainingCount === 1 ? "" : "s"} remaining`

  return (
    <Text variant="xs" color="mono60" {...rest}>
      {label}
    </Text>
  )
}
