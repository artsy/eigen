import { Box, Flex } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import React from "react"

interface Props {
  onViewAllExhibitorsPressed: () => void
  onViewAllArtworksPressed: () => void
  onViewAllArtistsPressed: () => void
}

export class ArtistsExhibitorsWorksLink extends React.Component<Props> {
  render() {
    const { onViewAllExhibitorsPressed, onViewAllArtistsPressed, onViewAllArtworksPressed } = this.props
    return (
      <Box mb={1}>
        <Flex justifyContent={"space-between"} flexDirection={"row"} flexWrap={"nowrap"}>
          <CaretButton onPress={() => onViewAllArtistsPressed()} text="Artists" />
          <CaretButton onPress={() => onViewAllExhibitorsPressed()} text="Exhibitors" />
          <CaretButton onPress={() => onViewAllArtworksPressed()} text="Works" />
        </Flex>
      </Box>
    )
  }
}
