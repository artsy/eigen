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
  subtitle?: string
  value?: React.ReactNode
  alignItems?: "center" | "flex-start"
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
  subtitle,
  value,
  alignItems = "center",
}) => {
  return (
    <RouterLink onPress={onPress} to={href} underlayColor="mono5" disabled={disabled}>
      <Flex px={px ?? 2}>
        <Flex
          flexDirection="row"
          alignItems={alignItems}
          opacity={disabled && allowDisabledVisualClue ? 0.5 : 1}
          py={2}
        >
          {!!icon && <Flex mr={1}>{icon}</Flex>}
          <Flex>
            <Flex>
              <Flex flexDirection="row" alignItems="center">
                <Text variant="sm-display" color="mono100">
                  {title}
                </Text>
                {!!subtitle && (
                  <Text color="mono60" ml={1}>
                    {subtitle}
                  </Text>
                )}
              </Flex>
              {!!description && (
                <Text variant="xs" color="mono60">
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
                  color={disabled && allowDisabledVisualClue ? "mono30" : "mono60"}
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
                  fill={disabled && allowDisabledVisualClue ? "mono30" : "mono60"}
                />
              </Flex>
            )}
          </Flex>
        </Flex>

        <Separator borderColor="mono10" />
      </Flex>
    </RouterLink>
  )
}
