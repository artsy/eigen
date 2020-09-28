import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { AppStore } from "lib/store/AppStore"
import React from "react"
import { AddEditArtwork } from "../Screens/AddArtwork/AddEditArtwork"
import { Navigator } from "./Navigator"

export const Modal: React.FC = () => {
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
