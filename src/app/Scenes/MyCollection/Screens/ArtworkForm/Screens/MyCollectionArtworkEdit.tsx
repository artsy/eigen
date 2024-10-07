import { MyCollectionArtworkEditQuery } from "__generated__/MyCollectionArtworkEditQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { MyCollectionArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { strictWithSuspense } from "app/utils/hooks/withSuspense"
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
      collectorLocation {
        city
        state
        country
        countryCode
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
      provenance
      slug
      title
    }
  }
`

export const MyCollectionArtworkEditQueryRenderer = strictWithSuspense(
  ({ artworkID }: MyCollectionArtworkEditProps) => {
    const data = useLazyLoadQuery<MyCollectionArtworkEditQuery>(myCollectionArtworkEditQuery, {
      artworkId: artworkID,
    })

    return <MyCollectionArtworkFormScreen artwork={data.artwork} mode="edit" />
  },
  undefined,
  (fallbackProps) => {
    return (
      <LoadFailureView
        showBackButton={true}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  }
)
