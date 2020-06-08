import { ArrowRightIcon, Flex, Sans, space } from "@artsy/palette"
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

export const SectionTitle: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode; onPress?: () => any }> = ({
  title,
  subtitle,
  onPress,
}) => {
  return (
    <Wrapper onPress={onPress}>
      <Flex mb="1" flexDirection="row" alignItems="center">
        <View style={{ overflow: "hidden", flex: 1 }}>
          <Sans size="4" ellipsizeMode="tail" numberOfLines={1} data-test-id="title">
            {title}
          </Sans>
          {Boolean(subtitle) && (
            <Sans size="3t" color="black60" data-test-id="subtitle">
              {subtitle}
            </Sans>
          )}
        </View>
        {!!onPress && (
          <View style={{ flexShrink: 0, paddingLeft: space(1) }}>
            <ArrowRightIcon />
          </View>
        )}
      </Flex>
    </Wrapper>
  )
}
