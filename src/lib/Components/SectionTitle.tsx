import { ArrowRightIcon, Flex, space, Text } from "palette"
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
  return (
    <Wrapper onPress={onPress}>
      <Flex mb="1" flexDirection="row" alignItems="center">
        <View style={{ overflow: "hidden", flex: 1 }}>
          <Text variant="subtitle" ellipsizeMode="tail" numberOfLines={1} data-test-id="title">
            {title}
          </Text>
          {Boolean(subtitle) && (
            <Text variant="text" color="black60" data-test-id="subtitle">
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
