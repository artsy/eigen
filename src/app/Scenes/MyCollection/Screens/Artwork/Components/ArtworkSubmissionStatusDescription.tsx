import { Button, Flex, LinkText, Text } from "@artsy/palette-mobile"
import { ArtworkSubmissionStatusDescription_artwork$key } from "__generated__/ArtworkSubmissionStatusDescription_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface ArtworkSubmissionStatusDescriptionProps {
  artworkData: ArtworkSubmissionStatusDescription_artwork$key
  closeModal: () => void
}

export const ArtworkSubmissionStatusDescription: React.FC<
  ArtworkSubmissionStatusDescriptionProps
> = ({ artworkData, closeModal }) => {
  const {
    consignmentSubmission: submissionData,
    isListed,
    submissionId,
  } = useFragment(fragment, artworkData)

  if (!submissionData || !submissionId) return null

  const { stateLabel, actionLabel, stateHelpMessage, state, buttonLabel } = submissionData

  const buttonVariant = state === "DRAFT" || state === "APPROVED" ? "fillDark" : "outline"

  const handleLinkPress = () => {
    navigate("https://support.artsy.net/s/article/What-items-do-you-accept")
  }

  return (
    <Flex p={2} /* flex={1} */ testID="ArtworkSubmissionStatusDescription-Container">
      {/* <Flex flex={1}> */}

      <Text variant="md">{isListed ? "Listed" : stateLabel}</Text>

      {!!actionLabel && (
        <Text variant="md" color="orange100">
          {actionLabel}
        </Text>
      )}

      {state === "REJECTED" ? (
        <Text variant="sm-display" mt={1} color="black60">
          {stateHelpMessage} Find out more about our{" "}
          <LinkText onPress={handleLinkPress} color="black60">
            submission criteria
          </LinkText>
          .
        </Text>
      ) : (
        <Text variant="sm-display" mt={1} color="black60">
          {stateHelpMessage}
        </Text>
      )}
      {/* </Flex> */}

      {(!!buttonLabel || !!isListed) && (
        <Button mt={2} block haptic variant={buttonVariant} onPress={closeModal}>
          {isListed ? "View Listing" : buttonLabel}
        </Button>
      )}
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
