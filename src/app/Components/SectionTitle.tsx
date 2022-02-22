import { toTitleCase } from "@artsy/to-title-case"
import { ArrowRightIcon, Flex, Text, useTheme } from "palette"
import React from "react"
import { TouchableOpacity, View } from "react-native"

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
}> = ({ title, subtitle, onPress, RightButtonContent = RightButton }) => {
  const { color, space } = useTheme()

  return (
    <Wrapper onPress={onPress}>
      <Flex mb={2} flexDirection="row" alignItems="center">
        <View style={{ overflow: "hidden", flex: 1 }}>
          <Text lineHeight="20" variant="sm" ellipsizeMode="tail" numberOfLines={1} testID="title">
            {typeof title === "string" ? toTitleCase(String(title)) : title}
          </Text>
          {Boolean(subtitle) && (
            <Text variant="sm" color={color("black60")} lineHeight="20" testID="subtitle">
              {subtitle}
            </Text>
          )}
        </View>
        {!!onPress && (
          <View style={{ flexShrink: 0, paddingLeft: space(1) }}>
            <RightButtonContent />
          </View>
        )}
      </Flex>
    </Wrapper>
  )
}

const RightButton = () => (
  <Flex flexDirection="row" alignContent="center">
    <Text color="black60">View All</Text>
    <Flex my="auto">
      <ArrowRightIcon width={12} fill="black60" ml={0.5} />
    </Flex>
  </Flex>
)
