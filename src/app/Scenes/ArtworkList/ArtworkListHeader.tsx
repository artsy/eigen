import { MoreIcon, ShareIcon } from "@artsy/icons/native"
import { ArtworkListHeader_me$key } from "__generated__/ArtworkListHeader_me.graphql"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { ManageArtworkListView } from "app/Scenes/ArtworkList/ManageArtworkListView"
import { ShareArtworkListView } from "app/Scenes/ArtworkList/views/ShareArtworkListView/ShareArtworkListView"
import { goBack } from "app/system/navigation/navigate"
import { FC, useCallback, useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { tracks } from "./tracks"
import { HeaderMenuArtworkListEntity } from "./types"

export interface ArtworkListHeaderProps {
  me: ArtworkListHeader_me$key | null | undefined
}

export const ArtworkListHeader: FC<ArtworkListHeaderProps> = ({ me }) => {
  const [isManageViewVisible, setIsManageViewVisible] = useState(false)
  const [isShareViewVisible, setIsShareViewVisible] = useState(false)
  const { trackEvent } = useTracking()
  const data = useFragment(Fragment, me)
  let artworkListEntity: HeaderMenuArtworkListEntity | null = null

  if (data?.artworkList) {
    artworkListEntity = {
      title: data.artworkList.name,
      internalID: data.artworkList.internalID,
      shareableWithPartners: data.artworkList.shareableWithPartners,
      slug: data.artworkList.slug ?? null,
      private: data.artworkList.private,
      default: data.artworkList.default,
    }
  }

  const isDefaultList = !!artworkListEntity?.default

  const openShareArtworkListView = () => {
    if (!artworkListEntity) {
      return
    }

    trackEvent(tracks.clickedShareButton(artworkListEntity))
    setIsShareViewVisible(true)
  }

  const closeShareArtworkListView = useCallback(() => {
    setIsShareViewVisible(false)
  }, [])

  const openManageArtworkListView = () => {
    setIsManageViewVisible(true)
  }

  const closeManageArtworkListView = useCallback(() => {
    setIsManageViewVisible(false)
  }, [])

  return (
    <>
      <NavigationHeader
        onLeftButtonPress={goBack}
        renderRightButton={() => {
          if (!artworkListEntity) {
            return <></>
          }

          if (isDefaultList) {
            return <ShareIcon fill="mono100" width={24} height={24} />
          }

          return <MoreIcon fill="mono100" width={24} height={24} />
        }}
        rightButtonDisabled={!artworkListEntity}
        rightButtonAccessibilityLabel={isDefaultList ? "Share List" : "Contextual Menu Button"}
        onRightButtonPress={isDefaultList ? openShareArtworkListView : openManageArtworkListView}
        hideBottomDivider
      />

      {!!(isManageViewVisible && artworkListEntity) && (
        <ManageArtworkListView
          artworkListEntity={artworkListEntity}
          onDismiss={closeManageArtworkListView}
        />
      )}

      {!!(artworkListEntity && isDefaultList) && (
        <ShareArtworkListView
          visible={isShareViewVisible}
          artworkListEntity={artworkListEntity}
          onDismiss={closeShareArtworkListView}
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
      shareableWithPartners
      slug
      private
    }
  }
`
