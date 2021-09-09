import { ArrowRightIcon, Flex, Text, useSpace } from "palette"
import React from "react"
import { TouchableOpacity, View } from "react-native"

const Wrapper: React.FC<{ onPress?(): any }> = ({ onPress, children }) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} data-test-id="touchable-wrapper">
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
  RightButtonContent?: React.ComponentType<any> | null
}> = ({ title, subtitle, onPress, RightButtonContent }) => {
  const space = useSpace()
  return (
    <Wrapper onPress={onPress}>
      <Flex mb={2} flexDirection="row" alignItems="center">
        <View style={{ overflow: "hidden", flex: 1 }}>
          {/* TODO: look at Figma: app */}
          <Text lineHeight="20" variant="mediumText" ellipsizeMode="tail" numberOfLines={1} data-test-id="title">
            {title}
          </Text>
          {Boolean(subtitle) && (
            <Text variant="mediumText" color="black60" lineHeight="20" data-test-id="subtitle">
              {subtitle}
            </Text>
          )}
        </View>
        {!!onPress && (
          <View style={{ flexShrink: 0, paddingLeft: space(1) }}>
            {RightButtonContent ? <RightButtonContent /> : <ArrowRightIcon />}
          </View>
        )}
      </Flex>
    </Wrapper>
  )
}
