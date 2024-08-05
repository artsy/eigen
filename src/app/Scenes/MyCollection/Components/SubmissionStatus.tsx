import { AlertCircleFillIcon, Flex, Text } from "@artsy/palette-mobile"
import { SubmissionStatus_artwork$key } from "__generated__/SubmissionStatus_artwork.graphql"
import { graphql, useFragment } from "react-relay"

interface SubmissionStatusProps {
  artwork: SubmissionStatus_artwork$key
}

export const SubmissionStatus: React.FC<SubmissionStatusProps> = ({ artwork }) => {
  const artworkData = useFragment(query, artwork)

  const submission = artworkData.consignmentSubmission

  if (!submission) return null

  return (
    <Flex flexDirection="column">
      <Text variant="xs" fontWeight="bold" color={submission.stateLabelColor ?? "black100"}>
        {artworkData.isListed ? "Listed" : submission.stateLabel}
      </Text>

      {!!submission.actionLabel && (
        <Flex flexDirection="row" alignItems="center">
          <AlertCircleFillIcon width={16} height={16} fill="orange100" />

          <Text variant="xs" fontWeight="bold" color="orange100">
            &nbsp;{submission.actionLabel}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

const query = graphql`
  fragment SubmissionStatus_artwork on Artwork {
    internalID
    isListed
    consignmentSubmission {
      internalID
      state
      stateLabel
      actionLabel
      stateLabelColor
    }
  }
`
