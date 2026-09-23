import { Text, TextProps } from "@artsy/palette-mobile"

interface TypeEyebrowProps extends TextProps {
  children: string
}

/**
 * The small "Show" / "Event" / "Museum" / "Gallery" label a detail page's title sits under.
 * Shared so every entity header renders the same size and colour for it.
 */
export const TypeEyebrow: React.FC<TypeEyebrowProps> = ({ children, ...rest }) => {
  return (
    <Text variant="xs" color="mono60" {...rest}>
      {children}
    </Text>
  )
}
