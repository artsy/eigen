import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { navigate } from "lib/navigation/navigate"
import { Box, Flex } from "palette"
import React from "react"

interface ArtistsExhibitorsWorksLinkProps {
  fairID: string
}

export class ArtistsExhibitorsWorksLink extends React.Component<ArtistsExhibitorsWorksLinkProps> {
  onViewAllArtistsPressed() {
    navigate(`/fair/${this.props.fairID}/artists`)
  }

  onViewAllExhibitorsPressed() {
    navigate(`/fair/${this.props.fairID}/exhibitors`)
  }

  onViewAllArtworksPressed() {
    navigate(`/fair/${this.props.fairID}/artworks`)
  }

  render() {
    return (
      <Box mb={1}>
        <Flex justifyContent={"space-between"} flexDirection={"row"} flexWrap={"nowrap"}>
          <CaretButton onPress={this.onViewAllArtistsPressed.bind(this)} text="Artists" />
          <CaretButton onPress={this.onViewAllExhibitorsPressed.bind(this)} text="Exhibitors" />
          <CaretButton onPress={this.onViewAllArtworksPressed.bind(this)} text="Works" />
        </Flex>
      </Box>
    )
  }
}
