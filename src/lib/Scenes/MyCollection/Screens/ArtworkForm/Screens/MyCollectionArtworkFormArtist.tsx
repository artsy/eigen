import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { GlobalStore } from "lib/store/GlobalStore"
import React from "react"
import { ScrollView } from "react-native"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArtistAutosuggest } from "../Components/ArtistAutosuggest"

import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

export const MyCollectionArtworkFormArtist: React.FC<StackScreenProps<ArtworkFormScreen, "ArtworkFormArtist">> = ({
  route,
  navigation,
}) => {
  const modalType = route.params.mode
  const addOrEditLabel = modalType === "edit" ? "Edit" : "Add"

  const handleResultPress = async (result: AutosuggestResult) => {
    // TODO: Add tracking

    await GlobalStore.actions.myCollection.artwork.setArtistSearchResult(result)

    navigation.navigate("ArtworkFormArtwork", { ...route.params })
  }

  return (
    <>
      <FancyModalHeader hideBottomDivider onLeftButtonPress={route.params.onHeaderBackButtonPress}>
        {addOrEditLabel} Artwork
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <ScreenMargin>
          <ArtistAutosuggest onResultPress={handleResultPress} />
        </ScreenMargin>
      </ScrollView>
    </>
  )
}
