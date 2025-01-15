import { ArrowUpIcon, Flex, Text } from "@artsy/palette-mobile"
import { InfiniteDiscoveryBottomSheetTabsQuery } from "__generated__/InfiniteDiscoveryBottomSheetTabsQuery.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { InfiniteDiscoveryBottomSheetFooterQueryRenderer } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetFooter"
import {
  InfiniteDiscoveryTabs,
  InfiniteDiscoveryTabsSkeleton,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetTabs"
import { FC, useEffect, useState } from "react"
import { Dimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useQueryLoader } from "react-relay"

interface InfiniteDiscoveryBottomSheetProps {
  // TODO: should come from the context
  artworkID: string
}

export const InfiniteDiscoveryBottomSheet: FC<InfiniteDiscoveryBottomSheetProps> = ({
  artworkID,
}) => {
  const [visible, setVisible] = useState(false)
  const { bottom } = useSafeAreaInsets()
  const [queryRef, loadQuery] =
    useQueryLoader<InfiniteDiscoveryBottomSheetTabsQuery>(aboutTheWorkQuery)

  useEffect(() => {
    loadQuery({ id: artworkID })
  }, [artworkID])

  const pan = Gesture.Pan().onUpdate((event) => {
    if (event.translationY < TRANSLATE_Y_THRESHOLD) {
      runOnJS(setVisible)(true)
    }
  })

  const handleOnDismiss = () => {
    setVisible(false)
  }

  return (
    <>
      <AutomountedBottomSheetModal
        visible={visible}
        enableDynamicSizing={false}
        snapPoints={SNAP_POINTS}
        onDismiss={handleOnDismiss}
        footerComponent={(props) => {
          if (!queryRef) {
            return null
          }
          return <InfiniteDiscoveryBottomSheetFooterQueryRenderer queryRef={queryRef} {...props} />
        }}
      >
        {/* This if is to make TS happy, usePreloadedQuery will always require a queryRef */}
        {!queryRef ? (
          <InfiniteDiscoveryTabsSkeleton />
        ) : (
          <InfiniteDiscoveryTabs queryRef={queryRef} />
        )}
      </AutomountedBottomSheetModal>

      <GestureDetector gesture={pan}>
        <Flex justifyContent="center" alignItems="center" style={{ marginBottom: bottom }}>
          <ArrowUpIcon fill="black60" />

          <Text color="black60">Swipe up for more details</Text>
        </Flex>
      </GestureDetector>
    </>
  )
}

const { height } = Dimensions.get("screen")

const SNAP_POINTS = [height * 0.88]
const TRANSLATE_Y_THRESHOLD = -50

export const aboutTheWorkQuery = graphql`
  query InfiniteDiscoveryBottomSheetTabsQuery($id: String!) {
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
