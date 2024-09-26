import { ArrowRightIcon, Flex, SpacingUnit, Text, TextProps, useTheme } from "@artsy/palette-mobile"
import { toTitleCase } from "@artsy/to-title-case"
import { TouchableOpacity } from "react-native"

const Wrapper: React.FC<{ onPress?(): any }> = ({ onPress, children }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        testID="touchable-wrapper"
        hitSlop={{ top: 10, bottom: 10 }}
      >
        {children}
      </TouchableOpacity>
    )
  } else {
    return <>{children}</>
  }
}

export const SectionTitle: React.FC<{
  title: React.ReactNode
  titleVariant?: TextProps["variant"]
  subtitle?: React.ReactNode
  onPress?: () => any
  RightButtonContent?: React.FC
  mb?: SpacingUnit
  capitalized?: boolean
}> = ({
  title,
  titleVariant = "sm-display",
  subtitle,
  onPress,
  RightButtonContent = RightButton,
  mb = 2,
  capitalized = true,
}) => {
  const { color } = useTheme()
  let titleText

  if (typeof title === "string") {
    titleText = capitalized ? toTitleCase(title) : title
  }

  return (
    <Wrapper onPress={onPress}>
      <Flex mb={mb} flexDirection="row" alignItems="flex-start">
        <Flex flex={1} overflow="hidden">
          <Text
            lineHeight="20px"
            variant={titleVariant}
            ellipsizeMode="tail"
            numberOfLines={1}
            testID="title"
          >
            {typeof title === "string" ? titleText : title}
          </Text>
          {Boolean(subtitle) && (
            <Text variant="sm" color={color("black60")} lineHeight="20px" testID="subtitle">
              {subtitle}
            </Text>
          )}
        </Flex>
        {!!onPress && (
          <Flex flexShrink={0} pl={1}>
            <RightButtonContent />
          </Flex>
        )}
      </Flex>
    </Wrapper>
  )
}

const RightButton = () => (
  <Flex flexDirection="row" flex={1}>
    <Flex my="auto">
      <ArrowRightIcon width={12} fill="black60" ml={0.5} />
    </Flex>
  </Flex>
)
