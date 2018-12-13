import { Box, color, Flex, Sans, Separator, space } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface Props {
  onViewAllExhibitorsPressed: () => void
}

// ts-lint:ignore
const TabWrapper = styled(Flex)`
  margin-top: ${space(3)};
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
  handlePress(navigateToView) {
    navigateToView()
  }
  render() {
    const { onViewAllExhibitorsPressed } = this.props
    return (
      <>
        <TabWrapper>
          <TouchableOpacity>
            <LeftTab>
              <Sans size="3">Artists</Sans>
            </LeftTab>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handlePress(onViewAllExhibitorsPressed)}>
            <LeftTab right="3">
              <Sans size="3">Exhibitors</Sans>
            </LeftTab>
          </TouchableOpacity>
          <TouchableOpacity>
            <Box right="3">
              <Sans size="3">Works</Sans>
            </Box>
          </TouchableOpacity>
        </TabWrapper>
        <Separator />
      </>
    )
  }
}
