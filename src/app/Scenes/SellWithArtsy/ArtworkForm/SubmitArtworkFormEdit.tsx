import { SubmitArtworkFormEditQuery } from "__generated__/SubmitArtworkFormEditQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import {
  SubmitArtworkForm,
  SubmitArtworkProps,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { getInitialSubmissionValues } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/getInitialSubmissionValues"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SubmitArtworkFormEdit: React.FC<SubmitArtworkProps> = withSuspense((props) => {
  const data = useLazyLoadQuery<SubmitArtworkFormEditQuery>(
    submitArtworkFormEditQuery,
    {
      id: props.submissionID,
    },
    { fetchPolicy: "network-only" }
  )

  if (!data?.submission) {
    return <LoadFailureView />
  }

  return (
    <SubmitArtworkForm
      submissionID={props.submissionID}
      initialValues={getInitialSubmissionValues(data.submission)}
      initialStep={props.initialStep}
      navigationState={props.navigationState}
      hasStartedFlowFromMyCollection={props.hasStartedFlowFromMyCollection}
    />
  )
})

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
      year
      title
      signature
      medium
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
    }
  }
`
