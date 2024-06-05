import { Flex, Message, Spacer, Text } from "@artsy/palette-mobile"
import { useEffect } from "react"
import { BackHandler, ScrollView } from "react-native"

export const SubmitArtworkCompleteYourSubmission = () => {
  // Do not allow the user to go back when pressing the back button on Android
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      return true
    })

    return () => subscription.remove()
  }, [])

  return (
    <Flex px={2}>
      <ScrollView>
        <Flex>
          <Flex mb={2} flexDirection="row">
            <Flex flex={1} pr={1}>
              <Text variant="lg-display">Thank you for submitting your artwork</Text>
            </Flex>
          </Flex>
        </Flex>

        <Text>
          An Artsy Advisor will email you within 3-5 days to review your submission and discuss next
          steps. In the meantime your submission will appear in the feature, My Collection.
        </Text>

        <Spacer y={2} />

        <Message
          title="What happens next?"
          variant="success"
          text="If your artwork is accepted, we will guide you in selecting the best selling option. Additional information may be requested."
          titleStyle={{ variant: "sm" }}
          bodyTextStyle={{ variant: "sm" }}
        />
      </ScrollView>
    </Flex>
  )
}
