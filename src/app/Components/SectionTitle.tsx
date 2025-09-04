import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, FlexProps, SpacingUnit, Text, TextProps } from "@artsy/palette-mobile"
import { toTitleCase } from "@artsy/to-title-case"
import { RouterLink } from "app/system/navigation/RouterLink"

export const SectionTitle: React.FC<
  {
    href?: string | null
    title: React.ReactNode
    titleVariant?: TextProps["variant"]
    titleColor?: TextProps["color"]
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
  titleColor = "mono100",
  subtitle,
  onPress,
  RightButtonContent = RightButton,
  capitalized = true,
  ...flexProps
}) => {
  let titleText

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
            color={titleColor}
          >
            {typeof title === "string" ? titleText : title}
          </Text>

          {!!subtitle && (
            <Text variant="sm" color="mono60" lineHeight="20px" testID="subtitle">
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

const Wrapper: React.FC<
  React.PropsWithChildren<{
    onPress?(): void
    href?: string | null
    navigationProps?: object
  }>
> = ({ children, href, navigationProps, onPress }) => {
  if (onPress) {
    return (
      <RouterLink
        onPress={onPress}
        navigationProps={navigationProps}
        to={href}
        testID="touchable-wrapper"
        hitSlop={{ top: 10, bottom: 10 }}
      >
        {children}
      </RouterLink>
    )
  } else {
    return <>{children}</>
  }
}

const RightButton = () => (
  <Flex flexDirection="row" flex={1}>
    <Flex my="auto">
      <ChevronRightIcon width={12} fill="mono60" ml={0.5} />
    </Flex>
  </Flex>
)
