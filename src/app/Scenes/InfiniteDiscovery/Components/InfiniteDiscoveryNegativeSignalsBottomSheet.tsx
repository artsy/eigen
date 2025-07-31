import { useColor } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { InfiniteDiscoveryNegativeSignalsBottomSheetQuery } from "__generated__/InfiniteDiscoveryNegativeSignalsBottomSheetQuery.graphql"
import { InfiniteDiscoveryBottomSheetBackdrop } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetBackdrop"
import {
  InfiniteDiscoveryNegativeSignals,
  InfiniteDiscoveryNegativeSignalsPlaceholder,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryNegativeSignals"
import { GlobalStore } from "app/store/GlobalStore"
import { FC, Suspense, useRef } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface NegativeSignalsBottomSheetProps {
  artworkID: string
}

export const NegativeSignalsBottomSheet: FC<NegativeSignalsBottomSheetProps> = ({ artworkID }) => {
  const data = useLazyLoadQuery<InfiniteDiscoveryNegativeSignalsBottomSheetQuery>(
    negativeSignalsQuery,
    {
      id: artworkID,
    }
  )

  if (!data.artwork) {
    return null
  }

  return <InfiniteDiscoveryNegativeSignals artwork={data.artwork} />
}

export const negativeSignalsQuery = graphql`
  query InfiniteDiscoveryNegativeSignalsBottomSheetQuery($id: String!) @cacheable {
    artwork(id: $id) {
      ...InfiniteDiscoveryNegativeSignals_artwork
    }
  }
`

interface InfiniteDiscoveryNegativeSignalsBottomSheetProps {
  artworkID: string
}

export const InfiniteDiscoveryNegativeSignalsBottomSheet: FC<
  InfiniteDiscoveryNegativeSignalsBottomSheetProps
> = ({ artworkID }) => {
  const color = useColor()
  const ref = useRef<BottomSheet>(null)
  const moreInfoSheetVisible = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.moreInfoSheetVisible
  )
  const { setMoreInfoSheetVisible } = GlobalStore.actions.infiniteDiscovery

  const handleOnSheetChange = (index: number) => {
    if ([-1, 0].includes(index) && moreInfoSheetVisible) {
      setMoreInfoSheetVisible(false)
    }
  }

  if (!moreInfoSheetVisible) {
    return null
  }

  return (
    <BottomSheet
      ref={ref}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      snapPoints={[1, 260]}
      onChange={handleOnSheetChange}
      index={1}
      backgroundStyle={{
        backgroundColor: color("mono0"),
      }}
      backdropComponent={(props) => (
        <InfiniteDiscoveryBottomSheetBackdrop {...props} disappearsOnIndex={0} appearsOnIndex={1} />
      )}
    >
      <Suspense fallback={<InfiniteDiscoveryNegativeSignalsPlaceholder />}>
        <NegativeSignalsBottomSheet artworkID={artworkID} />
      </Suspense>
    </BottomSheet>
  )
}
