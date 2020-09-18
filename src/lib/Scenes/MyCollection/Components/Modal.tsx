import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { AppStore } from "lib/store/AppStore"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { AddEditArtwork } from "../Screens/AddArtwork/AddEditArtwork"
import { useNavigator } from "../utils/useNavigator"

export const Modal: React.FC = () => {
  const modalType = AppStore.useAppState((state) => state.myCollection.navigation.sessionState.modalType)
  const artworkActions = AppStore.actions.myCollection.artwork

  return (
    <FancyModal visible={!!modalType} onBackgroundPressed={() => artworkActions.cancelAddEditArtwork()}>
      <NavigatorIOS
        style={{ flex: 1 }}
        navigationBarHidden={true}
        initialRoute={{
          component: ({ navigator }) => {
            if (!modalType) {
              return null // if null, we're closing the modal
            }
            useNavigator(navigator)

            return <AddEditArtwork />
          },
          title: "",
        }}
      />
    </FancyModal>
  )
}
