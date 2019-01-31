import { Flex } from "@artsy/palette"
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
      <Flex justifyContent={"space-between"} flexDirection={"row"} flexWrap={"nowrap"}>
        <CaretButton onPress={() => onViewAllArtistsPressed()} text="All artists" />
        <CaretButton onPress={() => onViewAllExhibitorsPressed()} text="All exhibitors" />
        <CaretButton onPress={() => onViewAllArtworksPressed()} text="All works" />
      </Flex>
    )
  }
}
