import { MyCollectionArtworkEditQuery } from "__generated__/MyCollectionArtworkEditQuery.graphql"
import { MyCollectionArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface MyCollectionArtworkEditProps {
  artworkID: string
}

export const myCollectionArtworkEditQuery = graphql`
  query MyCollectionArtworkEditQuery($artworkId: String!) {
    artwork(id: $artworkId) {
      internalID
      pricePaid {
        display
        minor
        currencyCode
      }
      date
      depth
      dimensions {
        in
        cm
      }
      editionSize
      editionNumber
      height
      width
      attributionClass {
        name
      }
      id
      internalID
      images(includeAll: true) {
        isDefault
        imageURL
        width
        height
        internalID
      }
      isEdition
      medium
      metric
      artworkLocation
      provenance
      slug
      title
    }
  }
`

export const MyCollectionArtworkEditQueryRenderer = withSuspense(
  ({ artworkID }: MyCollectionArtworkEditProps) => {
    const data = useLazyLoadQuery<MyCollectionArtworkEditQuery>(myCollectionArtworkEditQuery, {
      artworkId: artworkID,
    })

    return <MyCollectionArtworkFormScreen artwork={data.artwork!} mode="edit" />
  }
)
