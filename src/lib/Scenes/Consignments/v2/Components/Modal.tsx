import { FancyModal } from "lib/Components/FancyModal"
import React from "react"
import { MyCollectionAddArtwork } from "../Screens/MyCollectionAddArtwork/MyCollectionAddArtwork"
import { useStoreActions, useStoreState } from "../State/hooks"

export const Modal: React.FC = () => {
  const modalViewType = useStoreState(state => state.navigation.modalViewType)
  const navActions = useStoreActions(state => state.navigation)

  const getModalView = () => {
    switch (modalViewType) {
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
