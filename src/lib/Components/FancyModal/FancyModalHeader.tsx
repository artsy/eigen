import { ArrowLeftIcon, Box, color, Flex, Sans, space } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface FancyModalHeaderProps {
  backNavigationText?: string
  onBackNavigation?: () => void
}

export const FancyModalHeader: React.FC<FancyModalHeaderProps> = props => {
  const { children, backNavigationText, onBackNavigation } = props

  return (
    <Container>
      <Flex mt={0.5} alignContent="center" alignItems="center" flexDirection="column">
        {!!onBackNavigation && (
          <NavigateBackContainer
            hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
            onPress={() => onBackNavigation()}
          >
            {backNavigationText ? (
              <Sans size="3">{backNavigationText}</Sans>
            ) : (
              <ArrowLeftIcon fill="black100" top="2px" />
            )}
          </NavigateBackContainer>
        )}
      </Flex>
      <Sans mt={2} weight="medium" size="4" color="black100">
        {children}
      </Sans>
      <Box></Box>
    </Container>
  )
}

export const Container = styled(Flex)`
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border: solid 0.5px ${color("black10")};
  flex-direction: row;
  justify-content: space-between;
  height: ${space(6)};
`

export const NavigateBackContainer = styled(TouchableOpacity)`
  position: absolute;
  left: ${space(2)};
  top: 16px;
`
