import { Text } from "@artsy/palette-mobile"
import { SelectArtworkListsForArtworkQuery } from "__generated__/SelectArtworkListsForArtworkQuery.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkLists } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/ArtworkLists"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const SelectArtworkListsForArtworkContent = () => {
  const { state } = useArtworkListsContext()
  const artwork = state.artwork!
  const queryData = useLazyLoadQuery<SelectArtworkListsForArtworkQuery>(Query, {
    artworkID: artwork.internalID,
  })

  return <ArtworkLists me={queryData.me} />
}

export const SelectArtworkListsForArtwork = () => {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <SelectArtworkListsForArtworkContent />
    </Suspense>
  )
}

const Query = graphql`
  query SelectArtworkListsForArtworkQuery($artworkID: String!) {
    me {
      ...ArtworkLists_me @arguments(artworkID: $artworkID)
    }
  }
`
