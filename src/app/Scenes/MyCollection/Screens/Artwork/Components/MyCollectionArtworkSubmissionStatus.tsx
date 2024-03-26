import { Flex, Box, Text, Touchable } from "@artsy/palette-mobile"
import { toTitleCase } from "@artsy/to-title-case"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ArtworkSubmissionStatusFAQ } from "app/Scenes/MyCollection/Screens/Artwork/ArtworkSubmissionStatusFAQ"
import { useState } from "react"

// TODO:- We are using displayText for Statuses for now. Consider changing the logic when proper statuses are made available on Metaphysics.
// See https://artsyproduct.atlassian.net/browse/SWA-217
export const STATUSES: { [key: string]: { color: string; text: string } } = {
  "submission in progress": { color: "yellow150", text: "In Progress" },
  "submission evaluated": { color: "orange150", text: "Evaluation Complete" },
  sold: { color: "black100", text: "Artwork Sold" },
}

export const MyCollectionArtworkSubmissionStatus: React.FC<{ displayText?: string }> = ({
  displayText,
}) => {
  const [isSubmissionStatusModalVisible, setIsSubmissionStatusModalVisible] =
    useState<boolean>(false)

  const wasSubmitted = Boolean(displayText)
  if (!wasSubmitted) {
    return null
  }

  const approvedDisplayText = STATUSES[(displayText as string).toLowerCase()]?.text

  if (!Boolean(approvedDisplayText)) {
    return null
  }
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
        <Text
          lineHeight="16px"
          mt={1}
          color={STATUSES[(displayText as string).toLowerCase()]?.color ?? "black100"}
        >
          {toTitleCase(approvedDisplayText)}
        </Text>
      </Flex>
    </Box>
  )
}
