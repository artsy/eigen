import {
  ChevronIcon,
  Flex,
  Spacer,
  SpacingUnit,
  SpacingUnitsTheme,
  Text,
  TextProps,
  useColor,
} from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { StyleProp, ViewStyle } from "react-native"
import { ResponsiveValue } from "styled-system"

export const MenuItem: React.FC<{
  allowDisabledVisualClue?: boolean // grays out with reduced opacity when disabled
  chevron?: React.ReactNode
  description?: string
  disabled?: boolean
  ellipsizeMode?: TextProps["ellipsizeMode"]
  href?: string | null
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
      fill={disabled && allowDisabledVisualClue ? "mono30" : "mono60"}
    />
  ),
  description,
  ellipsizeMode,
  href,
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
    <RouterLink
      noFeedback={noFeedback}
      onPress={onPress}
      to={href}
      underlayColor="mono5"
      disabled={disabled}
    >
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
            <Text variant="sm-display" color="mono100">
              {title}
            </Text>
            {!!description && (
              <Text variant="xs" color="mono60">
                {description}
              </Text>
            )}
          </Flex>
          {!!isBeta && (
            <Flex px={0.5} mx={1} backgroundColor={color("mono10")}>
              <Text variant="sm" color={disabled && allowDisabledVisualClue ? "mono30" : "mono60"}>
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
                color={disabled && allowDisabledVisualClue ? "mono30" : "mono60"}
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
              color={disabled && allowDisabledVisualClue ? "mono30" : "mono60"}
            >
              {text}
            </Text>
          )}

          {rightView}

          {!!((onPress || href) && chevron) && (
            <Flex ml={1} justifyContent="center">
              {chevron}
            </Flex>
          )}
        </Flex>
      </Flex>
    </RouterLink>
  )
}
