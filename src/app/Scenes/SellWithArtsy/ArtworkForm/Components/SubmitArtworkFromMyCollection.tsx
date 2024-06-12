import { Flex } from "@artsy/palette-mobile"
import { SubmitArtworkFromMyCollectionArtworks } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFromMyCollectionArtworks"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { Suspense } from "react"

export const SubmitArtworkFromMyCollection: React.FC = ({}) => {
  return (
    <Suspense
      fallback={
        <Flex alignItems="center" testID="placeholder">
          <PlaceholderGrid />
        </Flex>
      }
    >
      <SubmitArtworkFromMyCollectionArtworks />
    </Suspense>
  )
}
