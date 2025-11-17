import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, FlexProps, SpacingUnit, Text, TextProps } from "@artsy/palette-mobile"
import { toTitleCase } from "@artsy/to-title-case"
import { RouterLink } from "app/system/navigation/RouterLink"

type SectionTitleVariants = "small" | "default" | "large"

const STATES: Record<
  SectionTitleVariants,
  { titleVariant: TextProps["variant"]; iconSize: number }
> = {
  small: {
    titleVariant: "xs",
    iconSize: 12,
  },
  default: {
    titleVariant: "sm-display",
    iconSize: 12,
  },
  large: {
    titleVariant: "md",
    iconSize: 24,
  },
}

export const SectionTitle: React.FC<
  {
    capitalized?: boolean
    href?: string | null
    mb?: SpacingUnit
    navigationProps?: object
    onPress?: () => any | null
    RightButtonContent?: React.FC
    subtitle?: React.ReactNode
    title: React.ReactNode
    titleColor?: TextProps["color"]
    variant?: SectionTitleVariants
  } & FlexProps
> = ({
  capitalized = true,
  href,
  navigationProps,
  onPress,
  subtitle,
  title,
  titleColor = "mono100",
  variant = "default",
  RightButtonContent = () => <RightButton variant={variant} />,
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
            variant={STATES[variant].titleVariant as TextProps["variant"]}
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

const RightButton = ({ variant }: { variant: SectionTitleVariants }) => (
  <Flex flexDirection="row" flex={1}>
    <Flex my="auto">
      <ChevronRightIcon width={STATES[variant].iconSize} fill="mono60" ml={0.5} />
    </Flex>
  </Flex>
)
