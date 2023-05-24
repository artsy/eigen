import { MoreIcon } from "@artsy/palette-mobile"
import { ArtworkListHeader_me$key } from "__generated__/ArtworkListHeader_me.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ManageArtworkListView } from "app/Scenes/ArtworkList/ManageArtworkListView"
import { goBack } from "app/system/navigation/navigate"
import { FC, useCallback, useState } from "react"
import { graphql, useFragment } from "react-relay"
import { HeaderMenuArtworkListEntity } from "./types"

export interface ArtworkListHeaderProps {
  me: ArtworkListHeader_me$key | null
}

export const ArtworkListHeader: FC<ArtworkListHeaderProps> = ({ me }) => {
  const [isManageViewVisible, setIsManageViewVisible] = useState(false)
  const data = useFragment(Fragment, me)
  let artworkListEntity: HeaderMenuArtworkListEntity | null = null

  if (data?.artworkList) {
    artworkListEntity = {
      title: data.artworkList.name,
      internalID: data.artworkList.internalID,
    }
  }

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
        renderRightButton={() => {
          if (!data?.artworkList?.default) {
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

const Fragment = graphql`
  fragment ArtworkListHeader_me on Me @argumentDefinitions(listID: { type: "String!" }) {
    artworkList: collection(id: $listID) {
      default
      name
      internalID
    }
  }
`
