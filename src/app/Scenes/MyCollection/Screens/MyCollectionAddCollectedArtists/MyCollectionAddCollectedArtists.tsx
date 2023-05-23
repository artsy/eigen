import { Flex, Text } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { Suspense, useState } from "react"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  const [newCollectedArtistsIds, setNewCollectedArtistsIds] = useState(new Set<string>())

  const addOrRemoveArtist = (artist: AutosuggestResult) => {
    if (artist.internalID) {
      if (newCollectedArtistsIds.has(artist.internalID)) {
        // Remove artist
        setNewCollectedArtistsIds((prev) => {
          const next = new Set(prev)
          next.delete(artist.internalID!)
          return next
        })
      } else {
        // Add artist
        setNewCollectedArtistsIds((prev) => {
          const next = new Set(prev)
          next.add(artist.internalID!)
          return next
        })
      }
    }
  }

  return (
    <Flex flex={1}>
      <FancyModalHeader hideBottomDivider>
        <Text textAlign="center">Add Artists You Collect</Text>
      </FancyModalHeader>
      <Flex flex={1} px={2}>
        <Suspense fallback={LoadingSpinner}>
          <MyCollectionAddCollectedArtistsAutosuggest
            onResultPress={addOrRemoveArtist}
            newCollectedArtistsIds={newCollectedArtistsIds}
          />
        </Suspense>
      </Flex>
    </Flex>
  )
}
