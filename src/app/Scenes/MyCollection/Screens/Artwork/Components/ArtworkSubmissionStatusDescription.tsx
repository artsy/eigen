import { Button, Flex, Text } from "@artsy/palette-mobile"
import { ArtworkSubmissionStatusDescription_artwork$key } from "__generated__/ArtworkSubmissionStatusDescription_artwork.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { graphql, useFragment } from "react-relay"

interface ArtworkSubmissionStatusDescriptionProps {
  artworkData: ArtworkSubmissionStatusDescription_artwork$key
  closeModal: () => void
  visible: boolean
}

export const ArtworkSubmissionStatusDescription: React.FC<
  ArtworkSubmissionStatusDescriptionProps
> = ({ artworkData, closeModal, visible }) => {
  const {
    consignmentSubmission: submissionData,
    isListed,
    submissionId,
  } = useFragment(fragment, artworkData)

  if (!submissionData || !submissionId) return null

  const { stateLabel, actionLabel, stateHelpMessage, state, buttonLabel } = submissionData

  const buttonVariant = ["DRAFT", "APPROVED"].includes(state) ? "fillDark" : "outline"

  return (
    <Flex p={2} testID="ArtworkSubmissionStatusDescription-Container">
      <AutoHeightBottomSheet onDismiss={closeModal} visible={visible}>
        <Flex mx={2} mb={2} mt={1}>
          <Text variant="sm-display">Submission Status</Text>

          <Text variant="md" mt={1}>
            {isListed ? "Listed" : stateLabel}
          </Text>

          {!!actionLabel && (
            <Text variant="md" color="orange100">
              {actionLabel}
            </Text>
          )}

          <Text variant="sm-display" mt={1} color="black60">
            {stateHelpMessage}
          </Text>

          {(!!buttonLabel || !!isListed) && (
            <Button
              mt={2}
              block
              haptic
              variant={buttonVariant}
              onPress={() => {
                /* TODO: add action */
              }}
            >
              {isListed ? "View Listing" : buttonLabel}
            </Button>
          )}
        </Flex>
      </AutoHeightBottomSheet>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtworkSubmissionStatusDescription_artwork on Artwork {
    submissionId
    consignmentSubmission {
      state
      stateLabel
      stateHelpMessage
      buttonLabel
      actionLabel
    }
    isListed
  }
`
