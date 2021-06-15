import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, Flex, Separator, ShareIcon, space, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

export interface FancyModalHeaderProps {
  hideBottomDivider?: boolean
  leftButtonText?: string
  onLeftButtonPress?: () => void
  onRightButtonPress?: () => void
  rightButtonDisabled?: boolean
  rightButtonText?: string
  useXButton?: boolean
  useShareButton?: boolean
}

export const FancyModalHeader: React.FC<FancyModalHeaderProps> = ({
  children,
  hideBottomDivider = false,
  leftButtonText,
  onLeftButtonPress,
  rightButtonText,
  onRightButtonPress,
  rightButtonDisabled,
  useXButton,
  useShareButton,
}) => {
  const leftButton = () => {
    if (!useXButton) {
      return <ArrowLeftIcon fill="black100" />
    } else {
      return <CloseIcon fill="black100" />
    }
  }

  const rightButton = () => {
    if (!useShareButton) {
      return <ArrowRightIcon fill="black100" />
    } else {
      return <ShareIcon fill="black100" height="25px" width="25px" />
    }
  }

  return (
    <Flex>
      <Container alignItems="center" justifyContent="center">
        <Flex position="absolute" left={0} alignItems="flex-start">
          {!!onLeftButtonPress && (
            <LeftButtonContainer
              hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
              onPress={() => onLeftButtonPress()}
            >
              {leftButtonText ? <Text variant="text">{leftButtonText}</Text> : leftButton()}
            </LeftButtonContainer>
          )}
        </Flex>

        <Flex position="absolute" right={0} alignItems="flex-end">
          {!!onRightButtonPress && (
            <RightButtonContainer
              hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
              onPress={() => !rightButtonDisabled && onRightButtonPress()}
            >
              {rightButtonText ? (
                <Text variant="text" color={rightButtonDisabled ? "black30" : "black100"}>
                  {rightButtonText}
                </Text>
              ) : (
                rightButton()
              )}
            </RightButtonContainer>
          )}
        </Flex>

        <Flex position="absolute" left={0} right={0} alignItems="center" pointerEvents="none">
          <Text variant="mediumText" color="black100">
            {children}
          </Text>
        </Flex>
      </Container>

      {!hideBottomDivider && <Separator />}
    </Flex>
  )
}

export const Container = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${space(6)};
`

export const LeftButtonContainer = styled(TouchableOpacity)`
  padding: ${space(2)}px;
`

export const RightButtonContainer = styled(TouchableOpacity)`
  padding: ${space(2)}px;
`
