import { Box, color, Flex, Sans, Separator, space } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface Props {
  onViewAllExhibitorsPressed: () => void
  onViewAllArtworksPressed: () => void
  onViewAllArtistsPressed: () => void
}

// ts-lint:ignore
const TabWrapper = styled(Flex)`
  margin-top: ${space(1)};
  margin-bottom: ${space(2)};
  flex-direction: row;
  justify-content: space-evenly;
`
const LeftTab = styled(Box)`
  border-right-width: 1px;
  padding-right: 25px;
  border-right-color: ${color("black10")};
`

export class ArtistsExhibitorsWorksLink extends React.Component<Props> {
  render() {
    const { onViewAllExhibitorsPressed, onViewAllArtistsPressed, onViewAllArtworksPressed } = this.props
    return (
      <>
        <TabWrapper>
          <TouchableOpacity onPress={() => onViewAllArtistsPressed()}>
            <LeftTab>
              <Sans size="3">Artists</Sans>
            </LeftTab>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onViewAllExhibitorsPressed()}>
            <LeftTab right="3">
              <Sans size="3">Exhibitors</Sans>
            </LeftTab>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onViewAllArtworksPressed()}>
            <Box right="3">
              <Sans size="3">Works</Sans>
            </Box>
          </TouchableOpacity>
        </TabWrapper>
        <Separator mt="1" />
      </>
    )
  }
}
