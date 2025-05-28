import { Touchable } from "@artsy/palette-mobile"
import React, { useEffect, useMemo } from "react"
import { Animated, StyleProp, ViewStyle } from "react-native"
import styled from "styled-components/native"

export const BottomButtonContainer = styled(Animated.View)`
  position: absolute;
  bottom: 20px;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

interface AnimatedBottomButtonProps {
  isVisible: boolean
  onPress?: () => void
  buttonStyles?: StyleProp<ViewStyle>
}

export const AnimatedBottomButton: React.FC<AnimatedBottomButtonProps> = ({
  isVisible,
  buttonStyles = {},
  onPress,
  children,
}) => {
  const topOffset = useMemo(() => {
    return new Animated.Value(100)
  }, [])

  useEffect(() => {
    Animated.spring(topOffset, {
      toValue: isVisible ? 0 : 100,
      useNativeDriver: true,
      bounciness: -7,
      speed: 13,
    }).start()
  }, [isVisible])

  return (
    <BottomButtonContainer style={{ transform: [{ translateY: topOffset }] }}>
      <Touchable accessibilityRole="button" haptic onPress={onPress} style={buttonStyles}>
        {children}
      </Touchable>
    </BottomButtonContainer>
  )
}
