import { ChevronSmallRightIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"

interface CustomShareSheetItemProps {
  title: string
  Icon: React.ReactNode
  onPress?: () => void
}

export const CustomShareSheetItem: React.FC<CustomShareSheetItemProps> = ({
  title,
  Icon,
  onPress,
}) => {
  return (
    <Touchable accessibilityRole="button" onPress={onPress}>
      <Flex width="100%" height={60} flexDirection="row" alignItems="center" px={2}>
        {Icon}
        <Text variant="sm" ml="2">
          {title}
        </Text>
        <Flex flex={1} />
        <ChevronSmallRightIcon />
      </Flex>
    </Touchable>
  )
}
