import { Flex, Message, Spacer, Text } from "@artsy/palette-mobile"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"
import { useEffect } from "react"
import { BackHandler, ScrollView } from "react-native"

export const SubmitArtworkCompleteYourSubmission = () => {
  const { values } = useFormikContext<SubmissionModel>()
  // Do not allow the user to go back when pressing the back button on Android
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      return true
    })

    return () => subscription.remove()
  }, [])

  const { useSubmitArtworkScreenTracking } = useSubmissionContext()

  useSubmitArtworkScreenTracking(
    values.state === "APPROVED" ? "CompleteYourSubmissionPostApproval" : "CompleteYourSubmission"
  )

  if (values.state === "APPROVED") {
    return (
      <Flex px={2} flex={1}>
        <ScrollView>
          <Flex>
            <Flex mb={2} flexDirection="row">
              <Flex flex={1} pr={1}>
                <Text variant="lg-display">Thank you for submitting additional information</Text>
              </Flex>
            </Flex>
          </Flex>

          <Text variant="xs">
            This will be used to list, sell and fulfill your work. Additional information may be
            requested.
          </Text>

          <Spacer y={2} />

          <Message
            title="What happens next?"
            variant="success"
            text="An Artsy Advisor will email you within 3-5 days to discuss the next steps. In the meantime you can view your submission in My Collection."
          />
        </ScrollView>
      </Flex>
    )
  }

  return (
    <Flex px={2} flex={1}>
      <ScrollView>
        <Flex>
          <Flex mb={2} flexDirection="row">
            <Flex flex={1} pr={1}>
              <Text variant="lg-display">Thank you for submitting your artwork</Text>
            </Flex>
          </Flex>
        </Flex>

        <Text variant="xs">
          An Artsy Advisor will email you within 3-5 days to review your submission and discuss next
          steps. In the meantime you can view your submission in My Collection.
        </Text>

        <Spacer y={2} />

        <Message
          title="What happens next?"
          variant="success"
          text="If your artwork is accepted, we will guide you in selecting the best selling option. Additional information may be requested."
        />
      </ScrollView>
    </Flex>
  )
}
