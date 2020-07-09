import { FancyModal } from "lib/Components/FancyModal"
import React from "react"
import { MyCollectionAddArtwork } from "../Screens/MyCollectionAddArtwork/MyCollectionAddArtwork"
import { useStoreActions, useStoreState } from "../State/hooks"

export const Modal: React.FC = () => {
  const modalType = useStoreState(state => state.navigation.modalType)
  const navActions = useStoreActions(state => state.navigation)

  const getModalView = () => {
    switch (modalType) {
      case "add":
        return <MyCollectionAddArtwork />
      case "edit":
        // FIXME: Wire up edit
        return <MyCollectionAddArtwork />
      default:
        return null
    }
  }

  const modalView = getModalView()

  return (
    <FancyModal visible={!!modalView} onBackgroundPressed={() => navActions.dismissModal()}>
      {modalView}
    </FancyModal>
  )
}
