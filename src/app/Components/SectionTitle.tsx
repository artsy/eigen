import { Flex, FlexProps, SpacingUnit, Text, TextProps } from "@artsy/palette-mobile"
import { toTitleCase } from "@artsy/to-title-case"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"

export const SectionTitle: React.FC<
  {
    href?: string | null
    title: React.ReactNode
    titleVariant?: TextProps["variant"]
    subtitle?: React.ReactNode
    navigationProps?: object
    onPress?: () => any | null
    RightButtonContent?: React.FC
    mb?: SpacingUnit
    capitalized?: boolean
  } & FlexProps
> = ({
  href,
  navigationProps,
  title,
  titleVariant = "sm-display",
  subtitle,
  onPress,
  RightButtonContent = RightButton,
  capitalized = true,
  ...flexProps
}) => {
  let titleText
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  if (typeof title === "string") {
    titleText = capitalized ? toTitleCase(title) : title
  }

  return (
    <Wrapper onPress={onPress} href={href} navigationProps={navigationProps}>
      <Flex mb={2} flexDirection="row" alignItems="flex-start" {...flexProps}>
        <Flex flex={1}>
          <Text
            variant={titleVariant}
            ellipsizeMode="tail"
            numberOfLines={1}
            testID="title"
            fontWeight={theme === "dark" ? "500" : undefined}
          >
            {typeof title === "string" ? titleText : title}
          </Text>

          {!!subtitle && (
            <Text variant="sm" color="black60" lineHeight="20px" testID="subtitle">
              {subtitle}
            </Text>
          )}
        </Flex>

        {(!!href || !!onPress) && (
          <Flex flexShrink={0} pl={1}>
            <RightButtonContent />
          </Flex>
        )}
      </Flex>
    </Wrapper>
  )
}

const Wrapper: React.FC<{ onPress?(): void; href?: string | null; navigationProps?: object }> = ({
  children,
  href,
  navigationProps,
  onPress,
}) => {
  if (onPress) {
    return (
      <RouterLink
        onPress={onPress}
        navigationProps={navigationProps}
        to={href}
        testID="touchable-wrapper"
        hitSlop={{ top: 10, bottom: 10 }}
        activeOpacity={0.65}
      >
        {children}
      </RouterLink>
    )
  } else {
    return <>{children}</>
  }
}

const RightButton = () => {
  return (
    <Flex flexDirection="row" flex={1}>
      <Flex my="auto">
        <Text variant="xs" underline>
          View all
        </Text>
      </Flex>
    </Flex>
  )
}
