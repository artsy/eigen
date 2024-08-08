import { updateMyCollectionArtworkQuery } from "__generated__/updateMyCollectionArtworkQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const updateMyCollectionArtwork = ({ artworkID }: { artworkID: string }) => {
  return fetchQuery<updateMyCollectionArtworkQuery>(
    getRelayEnvironment(),
    UpdateMyCollectionArtworkQuery,
    {
      artworkId: artworkID,
    }
  ).toPromise()
}

const UpdateMyCollectionArtworkQuery = graphql`
  query updateMyCollectionArtworkQuery($artworkId: String!) {
    artwork(id: $artworkId) {
      ...MyCollectionWhySell_artwork
      ...MyCollectionArtworkSubmissionStatus_submissionState
      ...ArtworkSubmissionStatusDescription_artwork
    }
  }
`
