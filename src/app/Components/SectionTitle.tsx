import { toTitleCase } from "@artsy/to-title-case"
import { ArrowRightIcon, Flex, Text, useTheme } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"

const Wrapper: React.FC<{ onPress?(): any }> = ({ onPress, children }) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} testID="touchable-wrapper">
        {children}
      </TouchableOpacity>
    )
  } else {
    return <>{children}</>
  }
}

export const SectionTitle: React.FC<{
  title: React.ReactNode
  subtitle?: React.ReactNode
  onPress?: () => any
  RightButtonContent?: React.FC
  mb?: number
  capitalized?: boolean
}> = ({
  title,
  subtitle,
  onPress,
  RightButtonContent = RightButton,
  mb = 2,
  capitalized = true,
}) => {
  const { color, space } = useTheme()
  let titleText

  if (typeof title === "string") {
    titleText = capitalized ? toTitleCase(title) : title
  }

  return (
    <Wrapper onPress={onPress}>
      <Flex mb={mb} flexDirection="row" alignItems="flex-start">
        <Flex flex={1} overflow="hidden">
          <Text lineHeight="20" variant="sm" ellipsizeMode="tail" numberOfLines={1} testID="title">
            {typeof title === "string" ? titleText : title}
          </Text>
          {Boolean(subtitle) && (
            <Text variant="sm" color={color("black60")} lineHeight="20" testID="subtitle">
              {subtitle}
            </Text>
          )}
        </Flex>
        {!!onPress && (
          <Flex flexShrink={0} pl={space(1)}>
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
