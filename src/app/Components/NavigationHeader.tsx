import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ShareIcon } from "@artsy/icons/native"
import { Flex, useTheme, Text, Separator } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ResponsiveAlignItemsValue } from "app/Components/Bidding/Elements/types"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

export interface NavigationHeaderProps {
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
  renderRightButton?: () => React.JSX.Element
  alignItems?: ResponsiveAlignItemsValue
}

export const NavigationHeader: React.FC<React.PropsWithChildren<NavigationHeaderProps>> = ({
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
      return <CloseIcon fill="mono100" />
    } else {
      return <ChevronLeftIcon fill="mono100" />
    }
  }

  const rightButton = () => {
    if (useShareButton) {
      return <ShareIcon fill="mono100" height="25px" width="25px" />
    }
    if (rightCloseButton) {
      return <CloseIcon fill="mono100" />
    } else if (renderRightButton) {
      return renderRightButton()
    } else {
      return <ChevronRightIcon fill="mono100" />
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
              accessibilityRole="button"
              accessibilityLabel="Save"
              hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
              onPress={() => !rightButtonDisabled && onRightButtonPress()}
              disabled={rightButtonDisabled}
              aria-disabled={rightButtonDisabled}
              testID="fancy-modal-header-right-button"
            >
              {rightButtonText ? (
                <Text
                  variant="sm"
                  color={rightButtonDisabled ? "mono60" : "mono100"}
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
          <Text variant="sm" color="mono100">
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
` as typeof Flex

export const LeftButtonContainer = styled(TouchableOpacity)`
  padding-left: ${themeGet("space.2")};
  padding-right: ${themeGet("space.2")};
  justify-content: center;
` as typeof TouchableOpacity

export const RightButtonContainer = styled(TouchableOpacity)`
  padding-left: ${themeGet("space.2")};
  padding-right: ${themeGet("space.2")};
  justify-content: center;
` as typeof TouchableOpacity
