import { Box, ChevronIcon, Flex, Text, Touchable, useColor } from "palette"

interface SavedSearchListItemProps {
  title: string
  onPress?: () => void
}

const FALLBACK_TITLE = "Untitled Alert"

export const SavedSearchListItem: React.FC<SavedSearchListItemProps> = (props) => {
  const { title, onPress } = props
  const color = useColor()

  return (
    <Touchable onPress={onPress} underlayColor={color("black5")}>
      <Box px="2" py="2">
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flex={1} flexDirection="row" mr="2">
            <Text variant="sm">{title ?? FALLBACK_TITLE}</Text>
          </Flex>
          <ChevronIcon direction="right" fill="black60" />
        </Flex>
      </Box>
    </Touchable>
  )
}
