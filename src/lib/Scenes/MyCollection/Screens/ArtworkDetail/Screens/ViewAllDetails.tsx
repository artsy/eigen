import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AppStore } from "lib/store/AppStore"
import React from "react"
import { MyCollectionArtworkMetaFragmentContainer as ArtworkMeta } from "../Components/MyCollectionArtworkMeta"

export const ViewAllDetails: React.FC<any /* TODO */> = props => {
  const { artwork: artworkActions, navigation: navActions } = AppStore.actions.myCollection

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={() => navActions.goBack()}
        rightButtonText="Edit"
        onRightButtonPress={() => artworkActions.startEditingArtwork(props.artwork)}
      >
        Artwork Details
      </FancyModalHeader>
      <ArtworkMeta artwork={props.artwork} viewAll />
    </>
  )
}
