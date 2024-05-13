import { Message, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { Alert, ScrollView } from "react-native"

export const SubmitArtworkCompleteYourSubmission: React.FC<
  StackScreenProps<SubmitArtworkStackNavigation, "CompleteYourSubmission">
> = () => {
  return (
    <ScrollView>
      <Text variant="lg" mt={4} mb={2}>
        Thank you for submitting your artwork
      </Text>

      <Spacer y={2} />

      <Text>
        You have submitted the minimum information we need for an initial assessment. You will be
        notified within 3-5 days to confirm if your artwork has been accepted or not.
      </Text>

      <Spacer y={2} />

      <Message
        title="Next steps"
        // TODO: Add this support to the palette Message component
        // @ts-expect-error
        text={
          <Text variant="xs" color="black60">
            If accepted, we will ask for additional details to lorem ipsum dolor. To help speed up
            your submission, you can{" "}
            <Text
              variant="xs"
              color="black60"
              underline
              onPress={() => {
                Alert.alert("Fill out the additional information")
              }}
            >
              fill out the additional information
            </Text>{" "}
            now.
          </Text>
        }
      />
    </ScrollView>
  )
}
