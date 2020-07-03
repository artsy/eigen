import { ArrowLeftIcon, Box, color, Flex, Sans, space } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface ArtworkFilterHeaderProps {
  filterName: string
  handleBackNavigation: () => void
}

export const ArtworkFilterHeader: React.FC<ArtworkFilterHeaderProps> = props => {
  const { filterName, handleBackNavigation } = props

  return (
    <FilterHeader>
      <Flex alignItems="flex-end" mt={0.5} mb={2}>
        <NavigateBackIconContainer
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => handleBackNavigation()}
        >
          <ArrowLeftIcon fill="black100" />
        </NavigateBackIconContainer>
      </Flex>
      <Sans mt={2} weight="medium" size="4" color="black100">
        {filterName}
      </Sans>
      <Box></Box>
    </FilterHeader>
  )
}

export const FilterHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: ${space(2)}px;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
`
export const NavigateBackIconContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`
