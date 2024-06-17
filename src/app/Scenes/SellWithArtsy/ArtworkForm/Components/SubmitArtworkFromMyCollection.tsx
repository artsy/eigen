import { Flex } from "@artsy/palette-mobile"
import {
  SubmitArtworkFromMyCollectionArtworks,
  SubmitArtworkFromMyCollectionHeader,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFromMyCollectionArtworks"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { Suspense } from "react"

export const SubmitArtworkFromMyCollection: React.FC = ({}) => {
  return (
    <Suspense
      fallback={
        <Flex testID="placeholder">
          <Flex px={2} mb={2}>
            <SubmitArtworkFromMyCollectionHeader />
          </Flex>
          <PlaceholderGrid />
        </Flex>
      }
    >
      <SubmitArtworkFromMyCollectionArtworks />
    </Suspense>
  )
}
