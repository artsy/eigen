import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { AppStore } from "lib/store/AppStore"
import React, { useEffect } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { MyCollectionAddArtwork } from "../Screens/AddArtwork/MyCollectionAddArtwork"

export const Modal: React.FC = () => {
  const modalType = AppStore.useAppState(state => state.myCollection.navigation.sessionState.modalType)
  const artworkActions = AppStore.actions.myCollection.artwork
  const navActions = AppStore.actions.myCollection.navigation

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
            useEffect(() => {
              navActions.setNavigator(navigator)
            }, [])

            return <MyCollectionAddArtwork mode={modalType} />
          },
          title: "",
        }}
      />
    </FancyModal>
  )
}
