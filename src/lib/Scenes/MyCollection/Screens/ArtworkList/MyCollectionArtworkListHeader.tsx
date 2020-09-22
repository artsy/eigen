import { AppStore } from "lib/store/AppStore"
import { Sans, Separator } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"

interface MyCollectionArtworkListHeaderProps {
  id: string
}

export const MyCollectionArtworkListHeader: React.FC<MyCollectionArtworkListHeaderProps> = ({ id }) => {
  const { navigation: navActions, artwork: artworkActions } = AppStore.actions.myCollection

  return (
    <>
      <TouchableOpacity
        style={{ alignSelf: "flex-end" }}
        onPress={() => {
          // Store the global me.id identifier so that we know where to add / remove
          // edges after we add / remove artworks.
          // TODO: This can be removed once we update to relay 10 mutation API
          artworkActions.setMeGlobalId(id)
          navActions.navigateToAddArtwork()
        }}
      >
        <Sans size="3" m={2}>
          Add artwork
        </Sans>
      </TouchableOpacity>
      <Sans ml={2} mb={2} size="8">
        Artwork Insights
      </Sans>
      <Separator />
    </>
  )
}
