import { Button, Flex, LinkText, Text } from "@artsy/palette-mobile"
import { ArtworkSubmissionStatusDescription_artwork$key } from "__generated__/ArtworkSubmissionStatusDescription_artwork.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import {
  INITIAL_EDIT_STEP,
  INITIAL_POST_APPROVAL_STEP,
  SubmitArtworkProps,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import { navigate } from "app/system/navigation/navigate"
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
    consignmentSubmission,
    isListed,
    internalID: artworkInternalID,
  } = useFragment(fragment, artworkData)

  const { trackTappedEditSubmission } = useSubmitArtworkTracking()

  if (!consignmentSubmission?.externalID) {
    return null
  }

  const { stateLabel, actionLabel, stateHelpMessage, state, buttonLabel } = consignmentSubmission

  const buttonVariant = ["DRAFT", "APPROVED"].includes(state) ? "fillDark" : "outline"

  const handleLinkPress = () => {
    navigate("https://support.artsy.net/s/article/What-items-do-you-accept")
  }

  const stateHelpMessageDisplay = () => {
    if (isListed) {
      return <>Your artwork has been successfully listed on Artsy.</>
    }
    if (state === "REJECTED") {
      return (
        <>
          {stateHelpMessage} Find out more about our{" "}
          <LinkText onPress={handleLinkPress} color="black60">
            submission criteria
          </LinkText>
          .
        </>
      )
    } else {
      return stateHelpMessage
    }
  }

  const navigateToTheSubmissionFlow = () => {
    closeModal()

    if (isListed && artworkInternalID) {
      navigate(`/artwork/${artworkInternalID}`)
      return
    }

    const passProps: SubmitArtworkProps = {
      initialStep: state === "APPROVED" ? INITIAL_POST_APPROVAL_STEP : INITIAL_EDIT_STEP,
      hasStartedFlowFromMyCollection: true,
      initialValues: {},
    }
    navigate(`/sell/submissions/${consignmentSubmission.externalID}/edit`, { passProps })
  }

  const displayButtonLabel = isListed ? "View Listing" : buttonLabel

  return (
    <Flex testID="ArtworkSubmissionStatusDescription-Container">
      <AutoHeightBottomSheet onDismiss={closeModal} visible={visible}>
        <Flex mx={2} mb={2} mt={1}>
          <Text variant="sm-display">Submission Status</Text>

          <Text variant="md" mt={1}>
            {isListed ? "Listed" : stateLabel}
          </Text>

          {!!actionLabel && !isListed && (
            <Text variant="md" color="orange100" testID="action-abel">
              {actionLabel}
            </Text>
          )}

          <Text variant="sm" color="black60" my={2}>
            {stateHelpMessageDisplay()}
          </Text>

          {(!!buttonLabel || !!isListed) && (
            <Button
              my={2}
              block
              haptic
              variant={buttonVariant}
              onPress={() => {
                if (consignmentSubmission.externalID) {
                  trackTappedEditSubmission(
                    consignmentSubmission.externalID,
                    displayButtonLabel,
                    state
                  )
                }
                navigateToTheSubmissionFlow()
              }}
            >
              {displayButtonLabel}
            </Button>
          )}
        </Flex>
      </AutoHeightBottomSheet>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtworkSubmissionStatusDescription_artwork on Artwork {
    internalID
    consignmentSubmission {
      externalID
      state
      stateLabel
      stateHelpMessage
      buttonLabel
      actionLabel
    }
    isListed
  }
`
