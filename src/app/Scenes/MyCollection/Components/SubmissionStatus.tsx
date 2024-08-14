import { AlertCircleFillIcon, Flex, Text } from "@artsy/palette-mobile"
import { SubmissionStatus_artwork$key } from "__generated__/SubmissionStatus_artwork.graphql"
import { graphql, useFragment } from "react-relay"

interface SubmissionStatusProps {
  artwork: SubmissionStatus_artwork$key
}

export const SubmissionStatus: React.FC<SubmissionStatusProps> = ({ artwork }) => {
  const artworkData = useFragment(query, artwork)

  const { consignmentSubmission, isListed } = artworkData

  if (!consignmentSubmission) return null

  const { stateLabelColor, stateLabel, actionLabel, state } = consignmentSubmission

  if (["REJECTED"].includes(state)) return null

  return (
    <Flex flexDirection="column" testID="Submission-status-component">
      <Text variant="xs" fontWeight="bold" color={stateLabelColor ?? "black100"}>
        {artworkData.isListed ? "Listed" : stateLabel}
      </Text>

      {!!actionLabel && !isListed && (
        <Flex flexDirection="row" alignItems="center" testID="action-label">
          <AlertCircleFillIcon width={16} height={16} fill="orange100" />

          <Text variant="xs" fontWeight="bold" color="orange100">
            &nbsp;{actionLabel}
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
      stateHelpMessage
      buttonLabel
    }
  }
`
