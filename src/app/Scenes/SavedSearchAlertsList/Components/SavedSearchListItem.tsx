import { ChevronIcon, Flex, Box, useColor, Text, Touchable } from "@artsy/palette-mobile"

interface SavedSearchListItemProps {
  title: string
  subtitle?: string
  onPress?: () => void
}

const FALLBACK_TITLE = "Untitled Alert"

export const SavedSearchListItem: React.FC<SavedSearchListItemProps> = (props) => {
  const { title, subtitle, onPress } = props
  const color = useColor()

  return (
    <Touchable onPress={onPress} underlayColor={color("black5")}>
      <Box px={2} py={2}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flex={1} flexDirection="column">
            <Text variant="sm" fontWeight="bold">
              {title ?? FALLBACK_TITLE}
            </Text>
            {!!subtitle && (
              <Text variant="sm" color="black60">
                {subtitle}
              </Text>
            )}
          </Flex>
          <ChevronIcon direction="right" fill="black60" />
        </Flex>
      </Box>
    </Touchable>
  )
}
