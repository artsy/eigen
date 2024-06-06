import { Flex, Text } from "@artsy/palette-mobile"
import { PhoneInput } from "app/Components/Input/PhoneInput"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkAddPhoneNumber = () => {
  const { handleChange, values } = useFormikContext<ArtworkDetailsFormModel>()
  const { currentStep } = useSubmissionContext()

  return (
    <Flex px={2}>
      <ScrollView>
        <Text variant="lg-display" mb={2}>
          Add phone number
        </Text>

        <Text variant="xs" color="black60" mb={1}>
          Add your number (optional) to allow an Artsy Advisor to contact you by phone.
        </Text>

        <PhoneInput
          title="Phone number"
          placeholder="(000) 000-0000"
          onChangeText={handleChange("userPhone")}
          value={values.userPhone}
          accessibilityLabel="Phone number"
          shouldDisplayLocalError={false}
          testID="phone-input"
          // Only focus on the input and toggle the keyboard if this step is visible to the user.
          autoFocus={currentStep === "AddPhoneNumber"}
        />
      </ScrollView>
    </Flex>
  )
}
