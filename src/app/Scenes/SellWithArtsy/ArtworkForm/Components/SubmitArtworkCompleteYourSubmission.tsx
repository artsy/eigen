import { CheckCircleFillIcon, Flex, Message, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { useEffect } from "react"
import { BackHandler, Platform, ScrollView } from "react-native"

const ICON_WIDTH = 28

export const SubmitArtworkCompleteYourSubmission = () => {
  const space = useSpace()
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

            <CheckCircleFillIcon
              height={ICON_WIDTH}
              width={ICON_WIDTH}
              fill="green100"
              // Add top margin for iOS to align with the text
              top={Platform.OS === "ios" ? space(0.5) : 0}
            />
          </Flex>
        </Flex>

        <Text variant="xs">
          An Artsy Advisor will email you within 3-5 days to review your submission and discuss next
          steps. In the meantime you can view your submission in My Collection.
        </Text>

        <Spacer y={2} />

        <Message
          title="Next steps"
          variant="success"
          text="If your submission is accepted, we will ask for additional details"
        ></Message>
      </ScrollView>
    </Flex>
  )
}
