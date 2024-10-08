import { MyCollectionArtworkEditQuery } from "__generated__/MyCollectionArtworkEditQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { MyCollectionArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
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

export const MyCollectionArtworkEditQueryRenderer = withSuspense({
  Component: ({ artworkID }: MyCollectionArtworkEditProps) => {
    const data = useLazyLoadQuery<MyCollectionArtworkEditQuery>(myCollectionArtworkEditQuery, {
      artworkId: artworkID,
    })

    return <MyCollectionArtworkFormScreen artwork={data.artwork} mode="edit" />
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        showBackButton={true}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})
