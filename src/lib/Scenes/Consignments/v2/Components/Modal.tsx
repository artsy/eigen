import { FancyModal } from "lib/Components/FancyModal"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { MyCollectionAddArtwork } from "../Screens/MyCollectionAddArtwork/MyCollectionAddArtwork"
import { useStoreActions, useStoreState } from "../State/hooks"

export const Modal: React.FC = () => {
  const modalType = useStoreState(state => state.navigation.modalType)
  const navActions = useStoreActions(state => state.navigation)

  const getModalContent = () => {
    switch (modalType) {
      case "add":
        return MyCollectionAddArtwork
      case "edit":
        // FIXME: Wire up edit
        return MyCollectionAddArtwork
      default:
        return null
    }
  }

  const ModalContent = getModalContent()

  return (
    <FancyModal visible={!!ModalContent} onBackgroundPressed={() => navActions.dismissModal()}>
      {/* TODO: Think about way to allow modal show / hide animations without needed to persist
          component to view.
      */}
      {ModalContent != null ? (
        <NavigatorIOS
          style={{ flex: 1 }}
          navigationBarHidden={true}
          initialRoute={{
            component: ModalContent,
            title: "",
          }}
        />
      ) : null}
    </FancyModal>
  )
}
