import { SubmitArtworkFormEditQuery } from "__generated__/SubmitArtworkFormEditQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import {
  SubmitArtworkForm,
  SubmitArtworkProps,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { getInitialSubmissionValues } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/getInitialSubmissionValues"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SubmitArtworkFormEdit: React.FC<SubmitArtworkProps> = withSuspense({
  Component: (props) => {
    const data = useLazyLoadQuery<SubmitArtworkFormEditQuery>(
      submitArtworkFormEditQuery,
      {
        id: props.externalID,
      },
      { fetchPolicy: "network-only" }
    )

    return (
      <>
        {!!data?.submission && (
          <SubmitArtworkForm
            externalID={props.externalID}
            initialValues={getInitialSubmissionValues(data.submission, data?.me)}
            initialStep={props.initialStep}
            navigationState={props.navigationState}
            hasStartedFlowFromMyCollection={props.hasStartedFlowFromMyCollection}
          />
        )}
      </>
    )
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        error={fallbackProps.error}
        showCloseButton={true}
        trackErrorBoundary={false}
        useSafeArea={false}
      />
    )
  },
})

export const SubmitArtworkFormEditContainer: React.FC<SubmitArtworkProps> = (props) => {
  return (
    <RetryErrorBoundary showCloseButton={true} trackErrorBoundary={false} useSafeArea={false}>
      <SubmitArtworkFormEdit {...props} />
    </RetryErrorBoundary>
  )
}

const submitArtworkFormEditQuery = graphql`
  query SubmitArtworkFormEditQuery($id: ID) {
    submission(id: $id) {
      id
      externalId
      artist {
        internalID
        name
      }
      category
      locationCity
      locationCountry
      locationState
      locationPostalCode
      locationCountryCode
      locationAddress
      locationAddress2
      year
      title
      signature
      medium
      myCollectionArtwork {
        internalID
        isFramed
        framedMetric
        framedWidth
        framedHeight
        framedDepth
        condition {
          value
        }
        conditionDescription {
          details
        }
      }
      attributionClass
      editionNumber
      editionSize
      height
      width
      depth
      dimensionsMetric
      provenance
      userId
      userEmail
      userName
      userPhone
      source
      state
      sourceArtworkID
      assets {
        id
        imageUrls
        geminiToken
        size
        filename
      }
      externalId
      addtionalAssets: assets(assetType: [ADDITIONAL_FILE]) {
        id
        size
        filename
        documentPath
        s3Path
        s3Bucket
      }
    }
    me {
      addressConnection {
        edges {
          node {
            addressLine1
            addressLine2
            city
            country
            isDefault
            postalCode
            region
          }
        }
      }
    }
  }
`
