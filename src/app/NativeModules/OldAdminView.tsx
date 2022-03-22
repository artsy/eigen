import { BackButton } from "app/navigation/BackButton"
import { dismissModal } from "app/navigation/navigate"
import React from "react"
import { requireNativeComponent } from "react-native"

const ARTOldAdminView = requireNativeComponent("ARTOldAdminView")

export const OldAdminView: React.FC = () => {
  return (
    <>
      <ARTOldAdminView // @ts-ignore
        style={{ flex: 1 }}
      />
      <BackButton onPress={() => dismissModal()} showCloseIcon />
    </>
  )
}
