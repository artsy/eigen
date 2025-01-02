import {
  ArrowRightIcon,
  CloseIcon,
  ArrowLeftIcon,
  ShareIcon,
  Flex,
  useTheme,
  Text,
  Separator,
} from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ResponsiveAlignItemsValue } from "app/Components/Bidding/Elements/types"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

export interface FancyModalHeaderProps {
  hideBottomDivider?: boolean
  leftButtonText?: string
  onLeftButtonPress?: () => void
  onRightButtonPress?: () => void
  rightButtonDisabled?: boolean
  rightButtonText?: string
  rightButtonTestId?: string
  useXButton?: boolean
  useShareButton?: boolean
  rightCloseButton?: boolean
  renderRightButton?: () => JSX.Element
  alignItems?: ResponsiveAlignItemsValue
}

// Beware: If you're using this in the context of a non fancy modal,
// it might break the behaviour of ArtsyKeyboardAvoidingView
export const FancyModalHeader: React.FC<FancyModalHeaderProps> = ({
  children,
  hideBottomDivider = false,
  leftButtonText,
  onLeftButtonPress,
  rightButtonText,
  rightButtonTestId,
  onRightButtonPress,
  rightButtonDisabled,
  useXButton,
  useShareButton,
  rightCloseButton,
  renderRightButton,
  alignItems,
}) => {
  const { space } = useTheme()
  const leftButton = () => {
    if (useXButton) {
      return <CloseIcon fill="black100" />
    } else {
      return <ArrowLeftIcon fill="black100" />
    }
  }

  const rightButton = () => {
    if (useShareButton) {
      return <ShareIcon fill="black100" height="25px" width="25px" />
    }
    if (rightCloseButton) {
      return <CloseIcon fill="black100" />
    } else if (renderRightButton) {
      return renderRightButton()
    } else {
      return <ArrowRightIcon fill="black100" />
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
              testID="fancy-modal-header-left-button"
            >
              {leftButtonText ? <Text variant="sm">{leftButtonText}</Text> : leftButton()}
            </LeftButtonContainer>
          )}
        </Flex>
        <Flex position="absolute" right={0} alignItems="flex-end">
          {!!onRightButtonPress && (
            <RightButtonContainer
              hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
              onPress={() => !rightButtonDisabled && onRightButtonPress()}
              testID="fancy-modal-header-right-button"
            >
              {rightButtonText ? (
                <Text
                  variant="sm"
                  color={rightButtonDisabled ? "black30" : "black100"}
                  testID={rightButtonTestId}
                  disabled={rightButtonDisabled}
                  aria-disabled={rightButtonDisabled}
                >
                  {rightButtonText}
                </Text>
              ) : (
                rightButton()
              )}
            </RightButtonContainer>
          )}
        </Flex>
        <Flex
          position="absolute"
          left={0}
          right={0}
          alignItems={alignItems || "center"}
          pointerEvents="none"
        >
          <Text variant="sm" color="black100">
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
  height: ${themeGet("space.6")};
`

export const LeftButtonContainer = styled(TouchableOpacity)`
  padding-left: ${themeGet("space.2")};
  padding-right: ${themeGet("space.2")};
  justify-content: center;
`

export const RightButtonContainer = styled(TouchableOpacity)`
  padding-left: ${themeGet("space.2")};
  padding-right: ${themeGet("space.2")};
  justify-content: center;
`
