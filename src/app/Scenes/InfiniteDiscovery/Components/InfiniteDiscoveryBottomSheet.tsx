import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { useColor } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { InfiniteDiscoveryBottomSheetBackdrop } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetBackdrop"
import { InfiniteDiscoveryBottomSheetFooterQueryRenderer } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetFooter"
import { InfiniteDiscoveryBottomeSheetHandle } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetHandle"
import { InfiniteDiscoveryTabs } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetTabs"
import { FC, useEffect, useState } from "react"
import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface InfiniteDiscoveryBottomSheetProps {
  artworkID: string
  artworkSlug: string
  artistIDs: string[]
  contextModule: ContextModule
}

export const InfiniteDiscoveryBottomSheet: FC<InfiniteDiscoveryBottomSheetProps> = ({
  artworkID,
  artworkSlug,
  artistIDs,
  contextModule,
}) => {
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
            <InfiniteDiscoveryBottomSheetBackdrop
              {...props}
              disappearsOnIndex={0}
              appearsOnIndex={1}
            />
          )
        }}
        backgroundStyle={{
          backgroundColor: color("mono0"),
        }}
        handleComponent={InfiniteDiscoveryBottomeSheetHandle}
        footerComponent={(props) => {
          if (!footerVisible) {
            return null
          }

          return (
            <InfiniteDiscoveryBottomSheetFooterQueryRenderer artworkID={artworkID} {...props} />
          )
        }}
        onChange={(index) => {
          const maxSnapPointIndex = 1
          if (index === maxSnapPointIndex) {
            trackEvent(tracks.swipedUp(artworkID, artworkSlug, contextModule))
          }
        }}
      >
        <InfiniteDiscoveryTabs
          artistIDs={artistIDs}
          artworkID={artworkID}
          onTabChange={handleOnTabChange}
          // this key resets the state of the tabs when the artwork changes
          key={`infinite_discovery_tabs_${artworkID}`}
        />
      </BottomSheet>
    </>
  )
}

const { height } = Dimensions.get("screen")

export const aboutTheWorkQuery = graphql`
  query InfiniteDiscoveryBottomSheetTabsQuery($id: String!, $artistIDs: [String!]!) {
    ...InfiniteDiscoveryMoreWorksTab_artworks @arguments(artistIDs: $artistIDs)

    me {
      ...useSendInquiry_me
      ...MyProfileEditModal_me
      ...BidButton_me
      ...InfiniteDiscoveryBottomSheetFooter_me
    }
    artwork(id: $id) {
      ...InfiniteDiscoveryAboutTheWorkTab_artwork
      ...InfiniteDiscoveryBottomSheetFooter_artwork
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
