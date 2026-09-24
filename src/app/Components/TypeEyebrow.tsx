import { Text, TextProps } from "@artsy/palette-mobile"

interface TypeEyebrowProps extends TextProps {
  children: string
}

/**
 * A small grey label naming what the title below it is — a detail page's "Show", or a stop
 * card's free-text event kind ("Closing Reception"). Shared so every caller renders it at the
 * same size and colour.
 */
export const TypeEyebrow: React.FC<TypeEyebrowProps> = ({ children, ...rest }) => {
  return (
    <Text variant="xs" color="mono60" {...rest}>
      {children}
    </Text>
  )
}
