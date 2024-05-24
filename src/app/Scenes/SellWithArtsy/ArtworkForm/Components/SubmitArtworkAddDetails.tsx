import { Checkbox, Flex, Input, Join, Spacer, Text } from "@artsy/palette-mobile"
import { SelectOption } from "app/Components/Select"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import {
  AcceptableCategoryValue,
  acceptableCategoriesForSubmission,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { useFormikContext } from "formik"
import { useRef, useState } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkAddDetails = () => {
  const [oldTypedYear, setOldTypedYear] = useState("")

  const { handleChange, setFieldValue, values, setValues } =
    useFormikContext<ArtworkDetailsFormModel>()

  const categories = useRef<Array<SelectOption<AcceptableCategoryValue>>>(
    acceptableCategoriesForSubmission()
  ).current

  return (
    <ScrollView>
      <Text variant="lg" mb={2}>
        Artwork details
      </Text>

      <Join separator={<Spacer y={2} />}>
        <Flex mb={2}>
          <Input
            title="Year"
            placeholder="YYYY"
            keyboardType="number-pad"
            testID="Submission_YearInput"
            value={values.year}
            onChangeText={(e) => setFieldValue("year", e)}
            accessibilityLabel="Year"
            disabled={!!values.isYearUnknown}
            style={{ width: "50%" }}
            required
          />
          <Spacer y={1} />

          <Checkbox
            checked={!!values.isYearUnknown}
            onPress={() => {
              // Save the old typed year to restore it if the user unchecks the checkbox
              if (!values.isYearUnknown) {
                setOldTypedYear(values.year)
                setValues({
                  ...values,
                  year: "",
                  isYearUnknown: true,
                })
              } else {
                setValues({
                  ...values,
                  year: oldTypedYear,
                  isYearUnknown: false,
                })
              }
            }}
            text={<Text color="black60">I don't know</Text>}
          />
          <Spacer y={1} />
        </Flex>

        <CategoryPicker<AcceptableCategoryValue | null>
          handleChange={(category) => setFieldValue("category", category)}
          options={categories}
          required
          value={values.category}
        />

        <Input
          title="Materials"
          placeholder={[
            "Oil on canvas, mixed media, lithograph, etc.",
            "Oil on canvas, mixed media, etc.",
            "Oil on canvas, etc.",
          ]}
          testID="Submission_MaterialsInput"
          value={values.medium}
          onChangeText={handleChange("medium")}
          accessibilityLabel="Materials"
        />
      </Join>
    </ScrollView>
  )
}
