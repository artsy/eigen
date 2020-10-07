import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { Navigator } from "lib/Scenes/MyCollection/Components/Navigator"
import { AddEditArtwork } from "lib/Scenes/MyCollection/Screens/AddArtwork/AddEditArtwork"
import { AppStore } from "lib/store/AppStore"
import React from "react"

export const AddEditModal: React.FC = () => {
  const modalType = AppStore.useAppState((state) => state.myCollection.navigation.sessionState.modalType)
  const artworkActions = AppStore.actions.myCollection.artwork

  return (
    <FancyModal visible={!!modalType} onBackgroundPressed={() => artworkActions.cancelAddEditArtwork()}>
      <Navigator name="modal">
        <AddEditArtwork />
      </Navigator>
    </FancyModal>
  )
}
