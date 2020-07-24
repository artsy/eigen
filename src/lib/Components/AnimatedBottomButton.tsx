import _ from "lodash"
import React, { useEffect, useMemo } from "react"
import { Animated, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

export const BottomButtonContainer = styled(Animated.View)`
  position: absolute;
  bottom: 20;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

export const AnimatedBottomButton: React.FC<{ isVisible: boolean; onPress: () => void }> = ({
  isVisible,
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
      <TouchableWithoutFeedback onPress={onPress}>{children}</TouchableWithoutFeedback>
    </BottomButtonContainer>
  )
}
