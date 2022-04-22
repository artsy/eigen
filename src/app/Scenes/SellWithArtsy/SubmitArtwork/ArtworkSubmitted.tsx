import { OwnerType } from "@artsy/cohesion"
import { StackScreenProps } from "@react-navigation/stack"
import { navigate } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Box, Button, Flex, Spacer, Text } from "palette"
import { ArtsyLogoHeader } from "palette/elements/Header/ArtsyLogoHeader"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"
import { useTracking } from "react-tracking"
import { submitAnotherArtworkEvent, viewArtworkMyCollectionEvent } from "../utils/TrackingEvent"
import { SubmitArtworkOverviewNavigationStack } from "./SubmitArtwork"

interface ArtworkSubmittedScreenNavigationProps
  extends StackScreenProps<SubmitArtworkOverviewNavigationStack, "ArtworkSubmittedScreen"> {}

export const ArtworkSubmittedScreen: React.FC<ArtworkSubmittedScreenNavigationProps> = ({
  navigation,
  route,
}) => {
  const submissionId = route.params.submissionId
  const { trackEvent } = useTracking()
  const { userID, userEmail } = GlobalStore.useAppState((store) => store.auth)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.consignmentSubmission,
      })}
    >
      <ScrollView>
        <Box>
          <ArtsyLogoHeader />
          <Text variant="lg" mx="2">
            Your Artwork has been submitted
          </Text>
          <Spacer mb={2} />
          <Text mx="2" color="black60">
            We will email you within 1-3 days to confirm if your artwork has been accepted or not.
            In the meantime your submission will appear in the feature, My Collection.
          </Text>
          <Spacer mb={2} />
          <Text mx="2" color="black60">
            With low fees, informed pricing, and multiple sales options, why not submit another
            piece with Artsy.
          </Text>
          <Spacer mb={4} />
          <Flex justifyContent="space-between" mx={2}>
            <Button
              block
              haptic
              maxWidth={540}
              onPress={() => {
                trackEvent(submitAnotherArtworkEvent(submissionId, userEmail, userID))
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
                trackEvent(viewArtworkMyCollectionEvent(submissionId, userEmail, userID))
                navigate(`/my-profile`)
              }}
            >
              View Artwork in My Collection
            </Button>
            <Spacer mb={2} />
          </Flex>
        </Box>
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
