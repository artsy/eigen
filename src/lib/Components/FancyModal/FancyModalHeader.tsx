import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, Flex, Sans, Separator, space } from "palette"
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
  useXButton?: boolean
}> = ({
  children,
  hideBottomDivider = false,
  leftButtonText,
  onLeftButtonPress,
  rightButtonText,
  onRightButtonPress,
  rightButtonDisabled,
  useXButton,
}) => {
  const leftButton = () => {
    if (!useXButton) {
      return <ArrowLeftIcon fill="black100" top="2" />
    } else {
      return <CloseIcon fill="black100" top="2" />
    }
  }

  return (
    <Flex>
      <Container>
        <Flex mt="0.5" flexDirection="column" alignContent="center" alignItems="center">
          {!!onLeftButtonPress && (
            <LeftButtonContainer
              hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
              onPress={() => onLeftButtonPress()}
            >
              {leftButtonText ? <Sans size="3">{leftButtonText}</Sans> : leftButton()}
            </LeftButtonContainer>
          )}
        </Flex>

        <Sans mt="2" weight="medium" size="4" color="black100">
          {children}
        </Sans>

        <Flex mt="0.5" flexDirection="column" alignContent="center" alignItems="center">
          {!!onRightButtonPress && (
            <RightButtonContainer
              hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
              onPress={() => !rightButtonDisabled && onRightButtonPress()}
            >
              {rightButtonText ? (
                <Sans size="3" color={`black${rightButtonDisabled ? "30" : "100"}`}>
                  {rightButtonText}
                </Sans>
              ) : (
                <ArrowRightIcon fill="black100" top="2" />
              )}
            </RightButtonContainer>
          )}
        </Flex>
      </Container>
      {!hideBottomDivider && <Separator />}
    </Flex>
  )
}

export const Container = styled(Flex)`
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
