import { Flex, Box, Text, Touchable, ArrowRightIcon } from "@artsy/palette-mobile"
import { MyCollectionArtworkSubmissionStatus_submissionState$key } from "__generated__/MyCollectionArtworkSubmissionStatus_submissionState.graphql"
import { ArtworkSubmissionStatusDescription } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkSubmissionStatusDescription"
import {
  INITIAL_EDIT_STEP,
  INITIAL_POST_APPROVAL_STEP,
  SubmitArtworkProps,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import { navigate } from "app/system/navigation/navigate"
import { useState } from "react"
import { useFragment, graphql } from "react-relay"

interface MyCollectionArtworkSubmissionStatusProps {
  artwork: MyCollectionArtworkSubmissionStatus_submissionState$key
}

export const MyCollectionArtworkSubmissionStatus: React.FC<
  MyCollectionArtworkSubmissionStatusProps
> = ({ artwork }) => {
  const [isSubmissionStatusModalVisible, setIsSubmissionStatusModalVisible] =
    useState<boolean>(false)
  const { trackTappedEditSubmission } = useSubmitArtworkTracking()

  const { consignmentSubmission, isListed } = useFragment(submissionStateFragment, artwork)

  const artworkData = useFragment(submissionStateFragment, artwork)

  if (!consignmentSubmission?.externalID) {
    return null
  }

  const { state, stateLabel, actionLabel } = consignmentSubmission

  if (!state) return null
  if (!stateLabel && !actionLabel) return null

  const navigateToTheSubmissionFlow = () => {
    const passProps: SubmitArtworkProps = {
      initialStep: state === "APPROVED" ? INITIAL_POST_APPROVAL_STEP : INITIAL_EDIT_STEP,
      hasStartedFlowFromMyCollection: true,
      initialValues: {},
    }

    navigate(`/sell/submissions/${consignmentSubmission.externalID}/edit`, { passProps })
  }

  return (
    <Box testID="MyCollectionArtworkSubmissionStatus-Container">
      <Flex>
        <ArtworkSubmissionStatusDescription
          visible={isSubmissionStatusModalVisible}
          artworkData={artworkData}
          closeModal={() => setIsSubmissionStatusModalVisible(false)}
        />

        <Flex justifyContent="space-between" flexDirection="row">
          <Text variant="xs" color="black100">
            Submission Status
          </Text>
          <Touchable
            onPress={() => setIsSubmissionStatusModalVisible(true)}
            hitSlop={{ top: 10, bottom: 10 }}
          >
            <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
              What's this?
            </Text>
          </Touchable>
        </Flex>

        {!!stateLabel && (
          <Text mt={0.5} variant="sm-display" color={consignmentSubmission.stateLabelColor}>
            {isListed ? "Listed" : stateLabel}
          </Text>
        )}

        {!!actionLabel && !isListed && (
          <Touchable
            onPress={() => {
              if (consignmentSubmission.externalID) {
                trackTappedEditSubmission(consignmentSubmission.externalID, null, state)
              }
              navigateToTheSubmissionFlow()
            }}
            testID="action-label"
          >
            <Flex flexDirection="row" alignItems="center" alignContent="center">
              <Text variant="sm-display" color="orange100">
                {actionLabel}&nbsp;
              </Text>
              <ArrowRightIcon fill="orange100" height={16} width={16} />
            </Flex>
          </Touchable>
        )}
      </Flex>
    </Box>
  )
}

const submissionStateFragment = graphql`
  fragment MyCollectionArtworkSubmissionStatus_submissionState on Artwork {
    consignmentSubmission {
      externalID
      state
      stateLabel
      actionLabel
      stateLabelColor
      stateHelpMessage
      buttonLabel
    }
    internalID
    isListed
    ...ArtworkSubmissionStatusDescription_artwork
  }
`
