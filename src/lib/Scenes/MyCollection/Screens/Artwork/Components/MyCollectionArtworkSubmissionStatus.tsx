import { toTitleCase } from "@artsy/to-title-case"
import { navigate } from "lib/navigation/navigate"
import { InfoModal } from "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/ArtworkDetails/Components/InfoModal"
import { Box, BulletedItem, Flex, Text, Touchable } from "palette"
import React, { useState } from "react"
import { Linking } from "react-native"

export const MyCollectionArtworkSubmissionStatus: React.FC<{ displayText?: string }> = ({
  displayText,
}) => {
  const wasSubmitted = Boolean(displayText)
  if (!wasSubmitted) {
    return null
  }

  const [showExplanation, setShowExplanation] = useState(false)

  const statuses: { [key: string]: { color: string; text: string } } = {
    "submission in progress": { color: "yellow150", text: "In Progress" },
    "submission evaluated": { color: "orange150", text: "Evaluation Complete" },
  }

  const approvedDisplayText = statuses[displayText!.toLowerCase()]?.text

  if (!Boolean(approvedDisplayText)) {
    // TODO:- Proper logic or flag for when artwork is sold. Returning null for now
    return null
  }
  return (
    <Box testID="MyCollectionArtworkSubmissionStatus-Container">
      <Flex>
        <Flex justifyContent="space-between" flexDirection="row">
          <Text variant="xs" color="black100">
            Submission Status
          </Text>
          <Touchable onPress={() => setShowExplanation(true)}>
            <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
              What is this?
            </Text>
          </Touchable>
        </Flex>
        <Text
          lineHeight={16}
          mt={1}
          color={statuses[displayText!.toLowerCase()]?.color ?? "black100"}
        >
          {toTitleCase(approvedDisplayText)}
        </Text>
      </Flex>
      <InfoModal
        title="Submission Status"
        visible={showExplanation}
        onDismiss={() => setShowExplanation(false)}
      >
        <Flex mb={4}>
          <Text variant="xs" mb={1}>
            {"What does my Artwork’s status mean?".toUpperCase()}
          </Text>
          <Flex>
            <BulletedItem color="black100">
              Submission in Progress - the artwork is being reviewed or is in the sales process.
            </BulletedItem>
            <BulletedItem mt={1} color="black100">
              Evaluation Complete - our specialists have reviewed this submission and determined
              that we do not currently have a market for it.
            </BulletedItem>
            <BulletedItem mt={1} color="black100">
              Artwork Sold - the artwork has successfully been sold.
            </BulletedItem>
          </Flex>

          <Text mt={3} mb={1} variant="xs">
            {"Find out more".toUpperCase()}
          </Text>
          <Text variant="sm">
            For more information, see our Collector Help Center article{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() =>
                navigate(
                  "https://support.artsy.net/hc/en-us/articles/360046646494-What-types-of-artwork-do-you-accept-for-consignment-"
                )
              }
            >
              What do we look for in consignment submissions
            </Text>
            ? Or get in touch with one of our specialists at{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => Linking.openURL("mailto:consign@artsymail.com")}
            >
              consign@artsymail.com
            </Text>
            .
          </Text>
        </Flex>
      </InfoModal>
    </Box>
  )
}
