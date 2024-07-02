import { fetchSubmissionInformationQuery } from "__generated__/fetchSubmissionInformationQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const fetchSubmissionInformation = (submissionID: string) => {
  return fetchQuery<fetchSubmissionInformationQuery>(
    getRelayEnvironment(),
    FetchSubmissionInformationQuery,
    {
      submissionID,
    }
  ).toPromise()
}

const FetchSubmissionInformationQuery = graphql`
  query fetchSubmissionInformationQuery($submissionID: ID!) {
    submission(id: $submissionID) {
      id
      myCollectionArtworkID
    }
  }
`
