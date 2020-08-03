import { ArrowLeftIcon, Box, color, Flex, Sans, space } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

export const FancyModalHeader: React.FC<{
  backButtonText?: string
  onBackPress?: () => void
}> = ({ children, backButtonText, onBackPress }) => {
  return (
    <Container>
      <Flex mt={0.5} flexDirection="column" alignContent="center" alignItems="center">
        {!!onBackPress && (
          <NavigateBackContainer
            hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
            onPress={() => onBackPress()}
          >
            {backButtonText ? <Sans size="3">{backButtonText}</Sans> : <ArrowLeftIcon fill="black100" top="2px" />}
          </NavigateBackContainer>
        )}
      </Flex>
      <Sans mt={2} weight="medium" size="4" color="black100">
        {children}
      </Sans>
      {/* Needed so that the layout distributes correctly, and future place for
          righthand button */}
      <Box />
    </Container>
  )
}

export const Container = styled(Flex)`
  border: solid 0.5px ${color("black10")};
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  flex-direction: row;
  justify-content: space-between;
  height: ${space(6)};
`

export const NavigateBackContainer = styled(TouchableOpacity)`
  position: absolute;
  left: ${space(2)};
  top: 16px;
`
