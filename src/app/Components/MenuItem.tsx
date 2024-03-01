import {
  ChevronIcon,
  Flex,
  Spacer,
  SpacingUnit,
  SpacingUnitsTheme,
  Text,
  TextProps,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { StyleProp, ViewStyle } from "react-native"
import { ResponsiveValue } from "styled-system"

export const MenuItem: React.FC<{
  allowDisabledVisualClue?: boolean // grays out with reduced opacity when disabled
  chevron?: React.ReactNode
  description?: string
  disabled?: boolean
  ellipsizeMode?: TextProps["ellipsizeMode"]
  icon?: React.ReactNode
  isBeta?: boolean
  onPress?: () => void
  noFeedback?: boolean
  px?: ResponsiveValue<SpacingUnit, SpacingUnitsTheme>
  py?: ResponsiveValue<SpacingUnit, SpacingUnitsTheme>
  rightView?: React.ReactNode
  style?: StyleProp<ViewStyle>
  text?: string
  title: React.ReactNode
  value?: React.ReactNode
}> = ({
  allowDisabledVisualClue = false,
  disabled = false,
  chevron = (
    <ChevronIcon
      direction="right"
      fill={disabled && allowDisabledVisualClue ? "black30" : "black60"}
    />
  ),
  description,
  ellipsizeMode,
  icon,
  isBeta,
  noFeedback = false,
  onPress,
  px,
  py,
  rightView,
  style,
  text,
  title,
  value,
}) => {
  const color = useColor()

  return (
    <Touchable noFeedback={noFeedback} onPress={onPress} underlayColor="black5" disabled={disabled}>
      <Flex
        flexDirection="row"
        alignItems="center"
        py={py ?? "7.5px"}
        px={px ?? 2}
        style={style}
        opacity={disabled && allowDisabledVisualClue ? 0.5 : 1}
      >
        {!!icon && (
          <Flex flex={1} flexGrow={1} height="100%">
            {icon}
          </Flex>
        )}
        <Flex flex={7}>
          <Flex>
            <Text variant="sm-display">{title}</Text>
            {!!description && (
              <Text variant="xs" color="black60">
                {description}
              </Text>
            )}
          </Flex>
          {!!isBeta && (
            <Flex px={0.5} mx={1} backgroundColor={color("black10")}>
              <Text
                variant="sm"
                color={disabled && allowDisabledVisualClue ? "black30" : "black60"}
              >
                Beta
              </Text>
            </Flex>
          )}
        </Flex>

        <Spacer x={2} />

        <Flex flexDirection="row" justifyContent="flex-end" flex={1} flexGrow={3} height="100%">
          {!!value && (
            <Flex width={200}>
              <Text
                variant="sm-display"
                color={disabled && allowDisabledVisualClue ? "black30" : "black60"}
                numberOfLines={1}
                ellipsizeMode={ellipsizeMode}
                textAlign="right"
              >
                {value}
              </Text>
            </Flex>
          )}

          {!!text && (
            <Text
              variant="sm-display"
              color={disabled && allowDisabledVisualClue ? "black30" : "black60"}
            >
              {text}
            </Text>
          )}

          {rightView}

          {!!(onPress && chevron) && (
            <Flex ml={1} justifyContent="center">
              {chevron}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}
