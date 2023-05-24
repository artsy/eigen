import { MoreIcon } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ManageArtworkListView } from "app/Scenes/ArtworkList/ManageArtworkListView"
import { goBack } from "app/system/navigation/navigate"
import { FC, useCallback, useState } from "react"
import { HeaderMenuArtworkListEntity } from "./types"

export interface ArtworkListHeaderProps {
  artworkListEntity?: HeaderMenuArtworkListEntity
  canRenderContextualMenuButton?: boolean
}

export const ArtworkListHeader: FC<ArtworkListHeaderProps> = ({
  artworkListEntity,
  canRenderContextualMenuButton,
}) => {
  const [isManageViewVisible, setIsManageViewVisible] = useState(false)

  const openManageArtworkListView = () => {
    if (!artworkListEntity) {
      throw new Error("You need to pass `artworkListEntity` prop")
    }

    setIsManageViewVisible(true)
  }

  const closeManageArtworkListView = useCallback(() => {
    setIsManageViewVisible(false)
  }, [])

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={goBack}
        renderRightButton={() => {
          if (canRenderContextualMenuButton) {
            return (
              <MoreIcon
                fill="black100"
                width={24}
                height={24}
                accessibilityLabel="Contextual Menu Button"
              />
            )
          }

          return <></>
        }}
        rightButtonDisabled={!artworkListEntity}
        onRightButtonPress={openManageArtworkListView}
        hideBottomDivider
      />

      {!!(isManageViewVisible && artworkListEntity) && (
        <ManageArtworkListView
          artworkListEntity={artworkListEntity}
          onDismiss={closeManageArtworkListView}
        />
      )}
    </>
  )
}
