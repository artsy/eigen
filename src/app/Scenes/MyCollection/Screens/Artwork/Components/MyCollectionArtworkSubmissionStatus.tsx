import { Flex, Box, Text, Touchable, ArrowRightIcon } from "@artsy/palette-mobile"
import { MyCollectionArtworkSubmissionStatus_submissionState$key } from "__generated__/MyCollectionArtworkSubmissionStatus_submissionState.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ArtworkSubmissionStatusFAQ } from "app/Scenes/MyCollection/Screens/Artwork/ArtworkSubmissionStatusFAQ"
import { ArtworkSubmissionStatusDescription } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkSubmissionStatusDescription"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
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

  const enableSubmitArtworkTier2Information = useFeatureFlag(
    "AREnableSubmitArtworkTier2Information"
  )

  const { consignmentSubmission, submissionId, isListed } = useFragment(
    submissionStateFragment,
    artwork
  )
  const artworkData = useFragment(submissionStateFragment, artwork)

  if (!consignmentSubmission || !submissionId) return null

  const { state, stateLabel, actionLabel } = consignmentSubmission

  if (!state) return null
  if (!stateLabel && !actionLabel) return null
  if (state === "DRAFT" && !enableSubmitArtworkTier2Information) return null

  let stateLabelColor = "yellow150"
  if (["APPROVED", "REJECTED", "CLOSED", "PUBLISHED"].includes(state)) stateLabelColor = "orange150"

  return (
    <Box testID="MyCollectionArtworkSubmissionStatus-Container">
      <Flex>
        {enableSubmitArtworkTier2Information ? (
          <>
            <ArtworkSubmissionStatusDescription
              visible={isSubmissionStatusModalVisible}
              artworkData={artworkData}
              closeModal={() => setIsSubmissionStatusModalVisible(false)}
            />

            <Flex justifyContent="space-between" flexDirection="row">
              <Text variant="xs" color="black100">
                Submission Status
              </Text>
              <Touchable onPress={() => setIsSubmissionStatusModalVisible(true)}>
                <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
                  What's this?
                </Text>
              </Touchable>
            </Flex>

            {!!stateLabel && (
              <Touchable onPress={() => setIsSubmissionStatusModalVisible(true)}>
                <Text mt={0.5} variant="sm-display" color={consignmentSubmission.stateLabelColor}>
                  {isListed ? "Listed" : stateLabel}
                </Text>
              </Touchable>
            )}

            {!!actionLabel && !isListed && (
              <Touchable onPress={() => setIsSubmissionStatusModalVisible(true)}>
                <Flex flexDirection="row" alignItems="center" alignContent="center">
                  <Text variant="sm-display" fontWeight="bold" color="orange100">
                    {actionLabel}&nbsp;
                  </Text>
                  <ArrowRightIcon fill="orange100" height={16} width={16} />
                </Flex>
              </Touchable>
            )}
          </>
        ) : (
          <>
            <FancyModal fullScreen visible={isSubmissionStatusModalVisible}>
              <FancyModalHeader
                onLeftButtonPress={() => setIsSubmissionStatusModalVisible(false)}
                hideBottomDivider
              />
              <ArtworkSubmissionStatusFAQ
                closeModal={() => setIsSubmissionStatusModalVisible(false)}
              />
            </FancyModal>

            <Flex justifyContent="space-between" flexDirection="row">
              <Text variant="xs" color="black100">
                Submission Status
              </Text>
              <Touchable onPress={() => setIsSubmissionStatusModalVisible(true)}>
                <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
                  What's this?
                </Text>
              </Touchable>
            </Flex>
            <Text lineHeight="16px" mt={1} color={stateLabelColor}>
              {stateLabel}
            </Text>
          </>
        )}
      </Flex>
    </Box>
  )
}

const submissionStateFragment = graphql`
  fragment MyCollectionArtworkSubmissionStatus_submissionState on Artwork {
    consignmentSubmission {
      state
      stateLabel
      actionLabel
      stateLabelColor
      stateHelpMessage
      buttonLabel
    }
    submissionId
    isListed
    ...ArtworkSubmissionStatusDescription_artwork
  }
`
