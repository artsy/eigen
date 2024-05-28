import { Flex, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { Select } from "app/Components/Select"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"

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

  return (
    <Flex px={2}>
      <Text variant="lg" mb={2}>
        Purchase history
      </Text>

      <Join separator={<Spacer y={2} />}>
        <Text variant="xs" color="black60">
          The documented history of an artwork’s ownership and authenticity. Please add any
          documentation you have that proves your artwork’s provenance:
        </Text>

        <Flex>
          <Text mb={2}>Where did you purchase the work?</Text>
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
              selected={values.signature === true}
              onPress={() => {
                setFieldValue("signature", true)
              }}
            />
            <RadioButton
              text="No"
              selected={values.signature === false}
              onPress={() => {
                setFieldValue("signature", false)
              }}
            />
          </Flex>
        </Flex>
      </Join>
    </Flex>
  )
}
