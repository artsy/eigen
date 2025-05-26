import { ChevronIcon, Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"

export const DevMenuButtonItem: React.FC<{
  disabled?: boolean
  onPress?: () => void
  title: React.ReactNode
  titleColor?: string
  value?: React.ReactNode
  direction?: "right" | "left" | "up" | "down"
}> = ({ disabled = false, onPress, title, titleColor = "mono100", value, direction = "right" }) => {
  const color = useColor()
  return (
    <Touchable
      accessibilityRole="button"
      onPress={onPress}
      underlayColor={color("mono30")}
      disabled={disabled}
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        py="7.5px"
        px={2}
        pr="15px"
      >
        <Flex flexDirection="row" mr={2} flex={5}>
          <Text variant="sm-display" color={titleColor}>
            {title}
          </Text>
        </Flex>
        {!!value && (
          <Flex flex={3} flexDirection="row" alignItems="center">
            <Flex flex={3}>
              <Text variant="sm-display" color="mono60" numberOfLines={1} textAlign="right">
                {value}
              </Text>
            </Flex>
            <Flex ml={1} flex={1}>
              <ChevronIcon left={0.5} height={20} width={20} direction={direction} fill="mono60" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Touchable>
  )
}
