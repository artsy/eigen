import {
  Box,
  Checkbox,
  Flex,
  Input,
  InputTitle,
  Join,
  LinkButton,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { Select, SelectOption } from "app/Components/Select"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import {
  AcceptableCategoryValue,
  acceptableCategoriesForSubmission,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import {
  limitedEditionValue,
  rarityOptions,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/rarityOptions"
import { artworkRarityClassifications } from "app/utils/artworkRarityClassifications"
import { useFormikContext } from "formik"
import { useRef, useState } from "react"
import { ScrollView } from "react-native"

export const SubmissionArtworkFormArtworkDetails: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtworkDetails">
> = ({}) => {
  const [isRarityInfoModalVisible, setIsRarityInfoModalVisible] = useState(false)
  const [isYearUnknown, setIsYearUnknown] = useState(false)
  const [oldTypedYear, setOldTypedYear] = useState("")

  const { handleChange, setFieldValue, values } = useFormikContext<ArtworkDetailsFormModel>()

  const categories = useRef<Array<SelectOption<AcceptableCategoryValue>>>(
    acceptableCategoriesForSubmission()
  ).current

  return (
    <ScrollView>
      {!!values.artistSearchResult && <ArtistSearchResult result={values.artistSearchResult} />}

      <Spacer y={2} />

      <Text variant="lg" mb={2}>
        Artwork details
      </Text>

      <Join separator={<Spacer y={2} />}>
        <CategoryPicker<AcceptableCategoryValue | null>
          handleChange={(category) => setFieldValue("category", category)}
          options={categories}
          required
          value={values.category}
        />

        <Flex>
          <Select
            onSelectValue={(e) => setFieldValue("attributionClass", e)}
            onTooltipPress={() => setIsRarityInfoModalVisible(true)}
            value={values.attributionClass}
            enableSearch={false}
            title="Rarity"
            tooltipText={
              <LinkButton
                variant="xs"
                color="black60"
                onPress={() => setIsRarityInfoModalVisible(true)}
              >
                What's this?
              </LinkButton>
            }
            placeholder="Select a classification"
            options={rarityOptions}
            testID="Submission_RaritySelect"
          />

          <InfoModal
            title="Classifications"
            visible={isRarityInfoModalVisible}
            onDismiss={() => setIsRarityInfoModalVisible(false)}
          >
            {artworkRarityClassifications.map((classification) => (
              <Flex mb={2} key={classification.label}>
                <InputTitle>{classification.label}</InputTitle>
                <Text>{classification.description}</Text>
              </Flex>
            ))}
          </InfoModal>
        </Flex>

        {values.attributionClass === limitedEditionValue && (
          <>
            <Flex flexDirection="row" justifyContent="space-between">
              <Box width="48%" mr={1}>
                <Input
                  title="Edition Number"
                  keyboardType="decimal-pad"
                  testID="Submission_EditionNumberInput"
                  value={values.editionNumber}
                  onChangeText={(e) => setFieldValue("editionNumber", e)}
                  accessibilityLabel="Edition Number"
                />
              </Box>
              <Box width="48%">
                <Input
                  title="Edition Size"
                  keyboardType="decimal-pad"
                  testID="Submission_EditionSizeInput"
                  value={values.editionSizeFormatted}
                  onChangeText={(e) => setFieldValue("editionSizeFormatted", e)}
                  accessibilityLabel="Edition Size"
                />
              </Box>
            </Flex>
          </>
        )}

        <Flex>
          <Input
            title="Year"
            placeholder="YYYY"
            keyboardType="number-pad"
            testID="Submission_YearInput"
            value={values.year}
            onChangeText={(e) => setFieldValue("year", e)}
            accessibilityLabel="Year"
            disabled={isYearUnknown}
          />
          <Spacer y={2} />

          <Checkbox
            checked={isYearUnknown}
            onPress={() => {
              // Save the old typed year to restore it if the user unchecks the checkbox
              if (!isYearUnknown) {
                setOldTypedYear(values.year)
                setIsYearUnknown(true)
                setFieldValue("year", undefined)
              } else {
                setFieldValue("year", oldTypedYear)
                setIsYearUnknown(false)
              }
            }}
            text="I don't know"
            // TODO: Add support of checkbox colors
            // color="black60"
          />
        </Flex>

        <Flex>
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
        </Flex>
      </Join>
    </ScrollView>
    // </KeyboardAvoidingView>
  )
}
