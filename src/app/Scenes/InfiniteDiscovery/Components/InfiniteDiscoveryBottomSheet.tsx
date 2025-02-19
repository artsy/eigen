import { useColor } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { InfiniteDiscoveryBottomSheetTabsQuery } from "__generated__/InfiniteDiscoveryBottomSheetTabsQuery.graphql"
import { InfiniteDiscoveryBottomSheetBackdrop } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetBackdrop"
import { InfiniteDiscoveryBottomSheetFooterQueryRenderer } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetFooter"
import { InfiniteDiscoveryBottomeSheetHandle } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetHandle"
import {
  InfiniteDiscoveryTabs,
  InfiniteDiscoveryTabsSkeleton,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetTabs"
import { FC, useEffect, useState } from "react"
import { Dimensions } from "react-native"
import { graphql, useQueryLoader } from "react-relay"

interface InfiniteDiscoveryBottomSheetProps {
  artworkID: string
  artistIDs: string[]
}

export const InfiniteDiscoveryBottomSheet: FC<InfiniteDiscoveryBottomSheetProps> = ({
  artworkID,
  artistIDs,
}) => {
  const [footerVisible, setFooterVisible] = useState(true)
  const color = useColor()

  const [queryRef, loadQuery] =
    useQueryLoader<InfiniteDiscoveryBottomSheetTabsQuery>(aboutTheWorkQuery)

  useEffect(() => {
    loadQuery({ id: artworkID, artistIDs })
  }, [artworkID, artistIDs])

  const handleOnTabChange = () => {
    setFooterVisible((prev) => !prev)
  }

  return (
    <>
      <BottomSheet
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        snapPoints={SNAP_POINTS}
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
          backgroundColor: color("white100"),
        }}
        handleComponent={InfiniteDiscoveryBottomeSheetHandle}
        footerComponent={(props) => {
          if (!queryRef || !footerVisible) {
            return null
          }
          return <InfiniteDiscoveryBottomSheetFooterQueryRenderer queryRef={queryRef} {...props} />
        }}
      >
        {/* This if is to make TS happy, usePreloadedQuery will always require a queryRef */}
        {!queryRef ? (
          <InfiniteDiscoveryTabsSkeleton />
        ) : (
          <InfiniteDiscoveryTabs queryRef={queryRef} onTabChange={handleOnTabChange} />
        )}
      </BottomSheet>
    </>
  )
}

const { height } = Dimensions.get("screen")

const SNAP_POINTS = [height * 0.1, height * 0.88]

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
