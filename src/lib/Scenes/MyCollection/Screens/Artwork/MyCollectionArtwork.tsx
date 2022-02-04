import { useFeatureFlag } from "lib/store/GlobalStore"
import { Flex, Text } from "palette/elements"
import React from "react"
import { OldMyCollectionArtworkQueryRenderer } from "./OldMyCollectionArtwork"

const MyCollectionArtwork = () => (
  <Flex flex={1} justifyContent="center" alignItems="center" testID="my-collection-artwork">
    <Text>New My Collection Artwork Screen</Text>
  </Flex>
)

export interface MyCollectionArtworkScreenProps {
  artworkSlug: string
  artistInternalID: string
  medium: string
}

export const MyCollectionArtworkQueryRenderer: React.FC<MyCollectionArtworkScreenProps> = (
  props
) => {
  const AREnableNewMyCollectionArtwork = useFeatureFlag("AREnableNewMyCollectionArtwork")

  if (AREnableNewMyCollectionArtwork) {
    return <MyCollectionArtwork />
  }

  return <OldMyCollectionArtworkQueryRenderer {...props} />
}
