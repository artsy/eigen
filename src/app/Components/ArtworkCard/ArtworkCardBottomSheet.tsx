import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { useColor } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { ArtworkCardBottomSheetBackdrop } from "app/Components/ArtworkCard/ArtworkCardBottomSheetBackdrop"
import { ArtworkCardBottomSheetFooterQueryRenderer } from "app/Components/ArtworkCard/ArtworkCardBottomSheetFooter"
import { ArtworkCardBottomSheetHandle } from "app/Components/ArtworkCard/ArtworkCardBottomSheetHandle"
import {
  ArtworkCardBottomSheetTabs,
  ArtworkCardBottomSheetTabsSkeleton,
} from "app/Components/ArtworkCard/ArtworkCardBottomSheetTabs"
import { FC, useEffect, useState } from "react"
import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkCardBottomSheetProps {
  artworkID: string
  artworkSlug: string
  artistIDs: string[]
  contextModule: ContextModule
}

export const ArtworkCardBottomSheet: FC<ArtworkCardBottomSheetProps> = ({
  artworkID,
  artworkSlug,
  artistIDs,
  contextModule,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { bottom } = useSafeAreaInsets()
  const [footerVisible, setFooterVisible] = useState(true)
  const color = useColor()
  const { trackEvent } = useTracking()

  useEffect(() => {
    setFooterVisible(true)
  }, [artworkID])

  const handleOnTabChange = () => {
    setFooterVisible((prev) => !prev)
  }

  return (
    <>
      <BottomSheet
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        snapPoints={[bottom + 60, height * 0.88]}
        index={0}
        backdropComponent={(props) => {
          return (
            <ArtworkCardBottomSheetBackdrop {...props} disappearsOnIndex={0} appearsOnIndex={1} />
          )
        }}
        backgroundStyle={{
          backgroundColor: color("mono0"),
        }}
        handleComponent={ArtworkCardBottomSheetHandle}
        footerComponent={(props) => {
          if (!footerVisible) {
            return null
          }

          return <ArtworkCardBottomSheetFooterQueryRenderer artworkID={artworkID} {...props} />
        }}
        onChange={(index) => {
          const maxSnapPointIndex = 1
          if (index === maxSnapPointIndex) {
            setIsExpanded(true)
            trackEvent(tracks.swipedUp(artworkID, artworkSlug, contextModule))
          } else {
            setIsExpanded(false)
          }
        }}
      >
        {!!isExpanded ? (
          <ArtworkCardBottomSheetTabs
            artistIDs={artistIDs}
            artworkID={artworkID}
            onTabChange={handleOnTabChange}
            // this key resets the state of the tabs when the artwork changes
            key={`artwork_card_bottom_sheet_tabs_${artworkID}`}
          />
        ) : (
          <ArtworkCardBottomSheetTabsSkeleton />
        )}
      </BottomSheet>
    </>
  )
}

const { height } = Dimensions.get("screen")

export const aboutTheWorkQuery = graphql`
  query ArtworkCardBottomSheetTabsQuery($id: String!, $artistIDs: [String!]!) {
    ...InfiniteDiscoveryMoreWorksTab_artworks @arguments(artistIDs: $artistIDs)

    me {
      ...useSendInquiry_me
      ...MyProfileEditModal_me
      ...BidButton_me
      ...ArtworkCardBottomSheetFooter_me
    }
    artwork(id: $id) {
      ...InfiniteDiscoveryAboutTheWorkTab_artwork
      ...ArtworkCardBottomSheetFooter_artwork
    }
  }
`

const tracks = {
  swipedUp: (artworkId: string, artworkSlug: string, contextModule: ContextModule) => ({
    action: ActionType.swipedUp,
    context_module: contextModule,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
  }),
}
