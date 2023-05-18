import { MoreIcon } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ManageArtworkListView } from "app/Scenes/ArtworkList/ManageArtworkListView"
import { goBack } from "app/system/navigation/navigate"
import { useCallback, useState } from "react"

const EditHeaderButton = () => <MoreIcon fill="black100" width={24} height={24} />

export const ArtworkListHeader = () => {
  const [isManageViewVisible, setIsManageViewVisible] = useState(false)

  const openManageArtworkListView = () => {
    setIsManageViewVisible(true)
  }

  const closeManageArtworkListView = useCallback(() => {
    setIsManageViewVisible(false)
  }, [])

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={goBack}
        renderRightButton={EditHeaderButton}
        onRightButtonPress={openManageArtworkListView}
        hideBottomDivider
      />

      {!!isManageViewVisible && <ManageArtworkListView onDismiss={closeManageArtworkListView} />}
    </>
  )
}
