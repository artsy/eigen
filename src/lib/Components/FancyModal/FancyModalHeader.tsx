import { ArrowLeftIcon, ArrowRightIcon, color, Flex, Sans, space } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

export const FancyModalHeader: React.FC<{
  hideBottomDivider?: boolean
  leftButtonText?: string
  onLeftButtonPress?: () => void
  rightButtonText?: string
  rightButtonDisabled?: boolean
  onRightButtonPress?: () => void
}> = ({
  children,
  hideBottomDivider = false,
  leftButtonText,
  onLeftButtonPress,
  rightButtonText,
  rightButtonDisabled,
  onRightButtonPress,
}) => {
  return (
    <Container hideBottomDivider={hideBottomDivider}>
      <Flex mt={0.5} flexDirection="column" alignContent="center" alignItems="center">
        {!!onLeftButtonPress && (
          <LeftButtonContainer
            hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
            onPress={() => onLeftButtonPress()}
          >
            {leftButtonText ? <Sans size="3">{leftButtonText}</Sans> : <ArrowLeftIcon fill="black100" top="2px" />}
          </LeftButtonContainer>
        )}
      </Flex>

      <Sans mt={2} weight="medium" size="4" color="black100">
        {children}
      </Sans>

      <Flex mt={0.5} flexDirection="column" alignContent="center" alignItems="center">
        {!!onRightButtonPress && (
          <RightButtonContainer
            hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
            onPress={() => !rightButtonDisabled && onRightButtonPress()}
          >
            {rightButtonText ? <Sans size="3" color={`black${rightButtonDisabled ? "30" : "100"}` }>{rightButtonText}</Sans> : <ArrowRightIcon fill="black100" top="2px" />}
          </RightButtonContainer>
        )}
      </Flex>
    </Container>
  )
}

export const Container = styled(Flex)<{ hideBottomDivider?: boolean }>`
  border: ${props => (props.hideBottomDivider ? `0` : `solid 0.5px ${color("black10")}`)};
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  flex-direction: row;
  justify-content: space-between;
  height: ${space(6)};
`

export const LeftButtonContainer = styled(TouchableOpacity)`
  position: absolute;
  left: ${space(2)};
  top: 16px;
`

export const RightButtonContainer = styled(TouchableOpacity)`
  position: absolute;
  right: ${space(2)};
  top: 16px;
`
