import {
  ChevronIcon,
  Flex,
  Separator,
  Spacer,
  SpacingUnit,
  SpacingUnitsTheme,
  Text,
  TextProps,
} from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ResponsiveValue } from "styled-system"

export const MenuItem: React.FC<{
  allowDisabledVisualClue?: boolean // grays out with reduced opacity when disabled
  hideShevron?: boolean
  description?: string
  disabled?: boolean
  ellipsizeMode?: TextProps["ellipsizeMode"]
  href?: string | null
  icon?: React.ReactNode
  onPress?: () => void
  px?: ResponsiveValue<SpacingUnit, SpacingUnitsTheme>
  rightView?: React.ReactNode
  title: React.ReactNode
  value?: React.ReactNode
}> = ({
  allowDisabledVisualClue = false,
  disabled = false,
  hideShevron = false,
  description,
  ellipsizeMode,
  href,
  icon,
  onPress,
  px,
  rightView,
  title,
  value,
}) => {
  return (
    <RouterLink onPress={onPress} to={href} underlayColor="black5" disabled={disabled}>
      <Flex px={px ?? 2}>
        <Flex
          flexDirection="row"
          alignItems="center"
          opacity={disabled && allowDisabledVisualClue ? 0.5 : 1}
          py={2}
        >
          {!!icon && (
            <Flex flex={1} flexGrow={1} height="100%">
              {icon}
            </Flex>
          )}
          <Flex flex={7}>
            <Flex>
              <Text variant="sm-display" color="black100">
                {title}
              </Text>
              {!!description && (
                <Text variant="xs" color="black60">
                  {description}
                </Text>
              )}
            </Flex>
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

            {rightView}

            {!!((onPress || href) && !hideShevron) && (
              <Flex ml={1} justifyContent="center">
                <ChevronIcon
                  direction="right"
                  fill={disabled && allowDisabledVisualClue ? "black30" : "black60"}
                />
              </Flex>
            )}
          </Flex>
        </Flex>

        <Separator borderColor="black10" />
      </Flex>
    </RouterLink>
  )
}
