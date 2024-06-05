import { Flex, Text } from "@artsy/palette-mobile"
import { PhoneInput } from "app/Components/Input/PhoneInput"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkAddPhoneNumber = () => {
  const { handleChange, values } = useFormikContext<ArtworkDetailsFormModel>()

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
        />
      </ScrollView>
    </Flex>
  )
}
