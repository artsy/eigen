import { toTitleCase } from "@artsy/to-title-case"
import { navigate } from "app/navigation/navigate"
import { Box, Flex, Text, Touchable } from "palette"
import React from "react"

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
  const wasSubmitted = Boolean(displayText)
  if (!wasSubmitted) {
    return null
  }

  const approvedDisplayText = STATUSES[displayText!.toLowerCase()]?.text

  const handleFAQ = () => {
    navigate("artwork-submission-status")
  }

  if (!Boolean(approvedDisplayText)) {
    return null
  }
  return (
    <Box testID="MyCollectionArtworkSubmissionStatus-Container">
      <Flex>
        <Flex justifyContent="space-between" flexDirection="row">
          <Text variant="xs" color="black100">
            Submission Status
          </Text>
          <Touchable onPress={() => handleFAQ()}>
            <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
              What is this?
            </Text>
          </Touchable>
        </Flex>
        <Text
          lineHeight={16}
          mt={1}
          color={STATUSES[displayText!.toLowerCase()]?.color ?? "black100"}
        >
          {toTitleCase(approvedDisplayText)}
        </Text>
      </Flex>
    </Box>
  )
}
