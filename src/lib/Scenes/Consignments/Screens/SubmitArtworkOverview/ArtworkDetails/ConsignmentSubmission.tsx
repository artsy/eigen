import { ConsignmentSubmissionQuery } from "__generated__/ConsignmentSubmissionQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { ArtworkDetailsFragmentContainer } from "./ArtworkDetails"

export const ConsignmentSubmission: React.FC<{ id: string; handlePress: () => void }> = ({ id }) => {
  return (
    <QueryRenderer<ConsignmentSubmissionQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ConsignmentSubmissionQuery($id: ID!) {
          submission(id: $id) {
            ...ArtworkDetails_submission
          }
        }
      `}
      variables={{
        id,
      }}
      render={renderWithLoadProgress(ArtworkDetailsFragmentContainer)}
    />
  )
}
