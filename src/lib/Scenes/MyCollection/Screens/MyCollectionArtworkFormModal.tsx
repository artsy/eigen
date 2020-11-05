import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { MyCollectionArtworkForm } from "./MyCollectionArtworkForm"

export type ArtworkFormMode = "add" | "edit"

export const MyCollectionArtworkFormModal: React.FC<{
  mode: ArtworkFormMode
  visible: boolean
  onDismiss: () => void
}> = ({ mode, visible, onDismiss }) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={() => onDismiss()}>
      <NavigatorIOS
        navigationBarHidden={true}
        style={{ flex: 1 }}
        initialRoute={{
          title: "Artwork form",
          component: MyCollectionArtworkForm,
          passProps: { mode },
        }}
      />
    </FancyModal>
  )
}
