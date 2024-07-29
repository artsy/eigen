import { Flex, Box, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
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

  const { height: screenHeight } = useScreenDimensions()

  const { consignmentSubmission, submissionId, isListed } = useFragment(
    submissionStateFragment,
    artwork
  )
  const artworkData = useFragment(submissionStateFragment, artwork)

  if (!consignmentSubmission || !submissionId) return null

  const { state, stateLabel } = consignmentSubmission
  if (!state) return null
  if (state === "DRAFT" && !enableSubmitArtworkTier2Information) return null

  let stateLabelColor = "yellow150"
  if (["APPROVED", "REJECTED", "CLOSED", "PUBLISHED"].includes(state)) stateLabelColor = "orange150"

  return (
    <Box testID="MyCollectionArtworkSubmissionStatus-Container">
      <Flex>
        {enableSubmitArtworkTier2Information ? (
          <>
            <FancyModal
              visible={isSubmissionStatusModalVisible}
              maxHeight={screenHeight / 2}
              onBackgroundPressed={() => setIsSubmissionStatusModalVisible(false)}
            >
              <FancyModalHeader
                useXButton
                onRightButtonPress={() => setIsSubmissionStatusModalVisible(false)}
                rightCloseButton
              >
                Submission Status
              </FancyModalHeader>

              <ArtworkSubmissionStatusDescription
                artworkData={artworkData}
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

            <Touchable onPress={() => setIsSubmissionStatusModalVisible(true)}>
              <Text mt={0.5} variant="sm-display" color={consignmentSubmission.stateLabelColor}>
                {isListed ? "Listed" : stateLabel}
              </Text>
            </Touchable>

            {!!consignmentSubmission?.actionLabel && (
              <Touchable onPress={() => setIsSubmissionStatusModalVisible(true)}>
                <Flex flexDirection="row" alignItems="center">
                  <Text variant="sm-display" fontWeight="bold" color="orange100">
                    {consignmentSubmission?.actionLabel}
                  </Text>
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
    }
    submissionId
    isListed
    ...ArtworkSubmissionStatusDescription_artwork
  }
`

/*
                 <AutoHeightBottomSheet
          visible={isSubmissionStatusModalVisible}
          onDismiss={() => setIsSubmissionStatusModalVisible(false)}
        >
          <Flex mx={2} mb={2} mt={1}>
            <Text variant="sm-display" textAlign="center">
              Submission Status
            </Text>

            <Text variant="md" mt={2} color={consignmentSubmission.stateLabelColor}>
              {isListed ? "Listed" : stateLabel}
            </Text>
            {!!consignmentSubmission?.actionLabel && (
              <Text variant="md" color="orange100">
                {consignmentSubmission?.actionLabel}
              </Text>
            )}
            <Text variant="sm-display" mt={1} color="black60">
              {consignmentSubmission.stateHelpMessage}
            </Text>

            <Button
              mt={2}
              block
              haptic
              variant={buttonVariant}
              onPress={() => setIsSubmissionStatusModalVisible(false)}
            >
              {isListed ? "View Listing" : consignmentSubmission.buttonLabel}
            </Button>
          </Flex>
        </AutoHeightBottomSheet>
        */
