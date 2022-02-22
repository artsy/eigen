import { StackScreenProps } from "@react-navigation/stack"
import { navigate } from "app/navigation/navigate"
import { Box, Button, Flex, Spacer, Text } from "palette"
import { ArtsyLogoHeader } from "palette/elements/Header/ArtsyLogoHeader"
import React from "react"
import { SubmitArtworkOverviewNavigationStack } from "./SubmitArtworkOverview"

interface ArtworkSubmittedScreenNavigationProps
  extends StackScreenProps<SubmitArtworkOverviewNavigationStack, "ArtworkSubmittedScreen"> {}

export const ArtworkSubmittedScreen: React.FC<ArtworkSubmittedScreenNavigationProps> = ({
  navigation,
}) => {
  return (
    <Box>
      <ArtsyLogoHeader />
      <Text variant="lg" mx="2">
        Your Artwork has been submitted
      </Text>
      <Spacer mb={2} />
      <Text mx="2" color="black60">
        We will email you within 1-3 days to confirm if your artwork has been accepted or not. In
        the meantime your submission will appear in the feature, My Collection.
      </Text>
      <Spacer mb={2} />
      <Text mx="2" color="black60">
        With low fees, informed pricing, and multiple sales options, why not submit another piece
        with Artsy.
      </Text>
      <Spacer mb={4} />
      <Flex justifyContent="space-between" mx={2}>
        <Button
          block
          haptic
          maxWidth={540}
          onPress={() => {
            navigation.replace("SubmitArtworkScreen")
          }}
        >
          Submit another Artwork
        </Button>
        <Spacer mb={2} />
        <Button
          block
          haptic
          maxWidth={540}
          variant="outline"
          onPress={() => {
            navigate(`/my-profile`)
          }}
        >
          View Artwork in My Collection
        </Button>
      </Flex>
    </Box>
  )
}
