import { Flex, Box, Text, Touchable } from "@artsy/palette-mobile"
import { MyCollectionArtworkSubmissionStatus_submissionState$key } from "__generated__/MyCollectionArtworkSubmissionStatus_submissionState.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ArtworkSubmissionStatusFAQ } from "app/Scenes/MyCollection/Screens/Artwork/ArtworkSubmissionStatusFAQ"
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

  const { consignmentSubmission } = useFragment(submissionStateFragment, artwork)
  if (!consignmentSubmission) return null

  const { state, stateLabel } = consignmentSubmission
  if (!state) return null
  if (state === "DRAFT") return null

  let stateLabelColor = "yellow150"
  if (["APPROVED", "REJECTED", "CLOSED", "PUBLISHED"].includes(state)) stateLabelColor = "orange150"

  return (
    <Box testID="MyCollectionArtworkSubmissionStatus-Container">
      <Flex>
        <FancyModal fullScreen visible={isSubmissionStatusModalVisible}>
          <FancyModalHeader
            onLeftButtonPress={() => setIsSubmissionStatusModalVisible(false)}
            hideBottomDivider
          ></FancyModalHeader>
          <ArtworkSubmissionStatusFAQ closeModal={() => setIsSubmissionStatusModalVisible(false)} />
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
      </Flex>
    </Box>
  )
}

const submissionStateFragment = graphql`
  fragment MyCollectionArtworkSubmissionStatus_submissionState on Artwork {
    consignmentSubmission {
      state
      stateLabel
    }
  }
`
