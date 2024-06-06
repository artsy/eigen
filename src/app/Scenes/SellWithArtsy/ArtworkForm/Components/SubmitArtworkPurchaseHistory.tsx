import { OwnerType } from "@artsy/cohesion"
import { Flex, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { Select } from "app/Components/Select"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"

export const PROVENANCE_LIST = [
  "Purchased directly from gallery",
  "Purchased directly from artist",
  "Purchased at auction",
  "Gift from the artist",
  "Other",
  "I don’t know",
].map((provenance) => ({
  value: provenance,
  label: provenance,
}))

export const SubmitArtworkPurchaseHistory = () => {
  const { setFieldValue, values } = useFormikContext<ArtworkDetailsFormModel>()
  const [isSigned, setIsSigned] = useState(values.signature)

  useEffect(() => {
    // This is required for performance reasons
    // We don't want to set the value of the form field on every render
    if (isSigned !== null && isSigned !== undefined) {
      setFieldValue("signature", isSigned)
    }
  }, [isSigned, setFieldValue])

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.submissionStepAddPurchaseHistory })}
    >
      <Flex px={2} flex={1}>
        <ScrollView>
          <Text variant="lg-display" mb={2}>
            Where did you purchase the artwork?
          </Text>

          <Join separator={<Spacer y={2} />}>
            <Flex>
              <Select
                options={PROVENANCE_LIST}
                title="Purchase information"
                testID="PurchaseInformation_Select"
                onSelectValue={(value) => {
                  setFieldValue("provenance", value)
                }}
                value={values.provenance}
              />
            </Flex>

            <Flex>
              <Text>Is the work signed?</Text>
              <Flex flexDirection="row" mt={2}>
                <RadioButton
                  mr={2}
                  text="Yes"
                  textVariant="sm-display"
                  accessibilityState={{ checked: !!isSigned }}
                  accessibilityLabel="Work is signed"
                  selected={isSigned === true}
                  onPress={() => {
                    setIsSigned(true)
                  }}
                />
                <RadioButton
                  text="No"
                  textVariant="sm-display"
                  accessibilityState={{ checked: !!isSigned }}
                  accessibilityLabel="Work is not signed"
                  selected={isSigned === false}
                  onPress={() => {
                    setIsSigned(false)
                  }}
                />
              </Flex>
            </Flex>
          </Join>
        </ScrollView>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
