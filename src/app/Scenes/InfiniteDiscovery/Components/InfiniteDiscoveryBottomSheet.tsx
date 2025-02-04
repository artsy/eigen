import { Flex, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types"
import { InfiniteDiscoveryBottomSheetTabsQuery } from "__generated__/InfiniteDiscoveryBottomSheetTabsQuery.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { InfiniteDiscoveryBottomSheetFooterQueryRenderer } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetFooter"
import {
  InfiniteDiscoveryTabs,
  InfiniteDiscoveryTabsSkeleton,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetTabs"
import { FC, useEffect, useState } from "react"
import { Dimensions } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

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
  const [queryRef, loadQuery] =
    useQueryLoader<InfiniteDiscoveryBottomSheetTabsQuery>(aboutTheWorkQuery)

  useEffect(() => {
    loadQuery({ id: artworkID, artistIDs })
  }, [artworkID, artistIDs])

  const handleOnTabChange = () => {
    // setFooterVisible((prev) => !prev)
  }

  return (
    <>
      <AutomountedBottomSheetModal
        visible
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        closeOnBackdropClick={false}
        enableDismissOnClose={false}
        snapPoints={SNAP_POINTS}
        index={0}
        appearsBackdropOnIndex={1}
        disappearsBackdropOnIndex={0}
        handleComponent={BottomeSheetHandle}
        footerComponent={(props) => {
          if (!queryRef) {
            return null
          }
          return (
            <InfiniteDiscoveryBottomSheetFooterQueryRenderer
              queryRef={queryRef}
              visible={footerVisible}
              {...props}
            />
          )
        }}
      >
        {/* This if is to make TS happy, usePreloadedQuery will always require a queryRef */}
        {!queryRef ? (
          <InfiniteDiscoveryTabsSkeleton />
        ) : (
          <InfiniteDiscoveryTabs queryRef={queryRef} onTabChange={handleOnTabChange} />
        )}
      </AutomountedBottomSheetModal>
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

const BottomeSheetHandle: FC<BottomSheetDefaultHandleProps> = () => {
  const { width } = useScreenDimensions()
  const { bottom } = useSafeAreaInsets()
  const { opacityStyle, heightStyle } = useBottomSheetAnimatedStyles()

  const handleWidth = (7.5 * width) / 100

  return (
    <Flex justifyContent="center" alignItems="center" gap={0.5} pt={1}>
      <Flex
        height={4}
        width={handleWidth}
        borderRadius={4}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      />

      <Animated.View style={[opacityStyle, heightStyle]}>
        <Text selectable={false} color="black60" style={{ marginBottom: bottom }}>
          Swipe up for more details
        </Text>
      </Animated.View>
    </Flex>
  )
}

export const useBottomSheetAnimatedStyles = () => {
  const { animatedIndex } = useBottomSheet()

  // TODO: instead of starting from .5 start from 0 to 1
  const reversedOpacityStyle = useAnimatedStyle(() => ({
    opacity: animatedIndex.value < 0.5 ? 0 : (animatedIndex.value - 0.5) * 2,
  }))
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: animatedIndex.value > 0.3 ? 0 : 1,
  }))
  const heightStyle = useAnimatedStyle(() => ({
    height: animatedIndex.value > 0.3 ? 0 : "auto",
  }))

  return { opacityStyle, heightStyle, reversedOpacityStyle }
}
