import { ArrowRightIcon, Flex, Sans, space } from "@artsy/palette"
import React from "react"
import { TouchableOpacity, View } from "react-native"

export const SectionTitle: React.FC<{ title: React.ReactChild; subtitle?: React.ReactChild; onPress?: () => any }> = ({
  title,
  subtitle,
  onPress,
}) => {
  const Wrapper: React.ComponentType = onPress
    ? ({ children }) => (
        <TouchableOpacity onPress={onPress} data-test-id="touchable-wrapper">
          {children}
        </TouchableOpacity>
      )
    : React.Fragment
  return (
    <Wrapper>
      <Flex mt="3" mb="1" flexDirection="row" alignItems="center">
        <View style={{ overflow: "hidden", flex: 1 }}>
          <Sans size="4" ellipsizeMode="tail" numberOfLines={1} data-test-id="title">
            {title}
          </Sans>
          {subtitle && (
            <Sans size="2" color="black60" data-test-id="subtitle">
              {subtitle}
            </Sans>
          )}
        </View>
        {onPress && (
          <View style={{ flexShrink: 0, paddingLeft: space(1) }}>
            <ArrowRightIcon></ArrowRightIcon>
          </View>
        )}
      </Flex>
    </Wrapper>
  )
}
