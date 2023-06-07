import { ArtsyKeyboardAvoidingView, Flex, Join, Spacer, Button } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { AbandonFlowModal } from "app/Components/AbandonFlowModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Input } from "app/Components/Input"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { useHasBeenTrue } from "app/utils/useHasBeenTrue"
import { useFormik } from "formik"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"
import * as Yup from "yup"

export interface NewMyCollectionArtistFormikSchema {
  name: string
  nationality: string
  birthYear: string
  deathYear: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name field is required").min(1, "Name field is required"),
  nationality: Yup.string().trim(),
  birthYear: Yup.string().trim(),
  deathYear: Yup.string().trim(),
})

export const AddMyCollectionArtist: React.FC<
  StackScreenProps<ArtworkFormScreen, "AddMyCollectionArtist">
> = ({ route }) => {
  const [showAbandonModal, setShowAbandonModal] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const nameInputRef = useRef<Input>(null)
  const nationalityInputRef = useRef<Input>(null)
  const birthYearInputRef = useRef<Input>(null)
  const deathYearInputRef = useRef<Input>(null)

  const { handleSubmit, validateField, handleChange, dirty, values, errors } =
    useFormik<NewMyCollectionArtistFormikSchema>({
      enableReinitialize: true,
      validateOnChange: true,
      validateOnBlur: true,
      initialValues: {
        name: "",
        nationality: "",
        birthYear: "",
        deathYear: "",
      },
      initialErrors: {},
      onSubmit: () => console.log("Submit Add New Artist"), // save artist to the store and navigate
      validationSchema: validationSchema,
    })
  const touched = useHasBeenTrue(dirty)

  const handleOnChangeText = (field: keyof NewMyCollectionArtistFormikSchema, text: string) => {
    // hide error when the user starts to type again
    if (errors[field]) {
      validateField(field)
    }
    handleChange(field)(text)
  }

  return (
    <>
      <ArtsyKeyboardAvoidingView>
        <FancyModalHeader
          onLeftButtonPress={
            dirty ? () => setShowAbandonModal(true) : route.params.onHeaderBackButtonPress
          }
          hideBottomDivider
        >
          Add New Artist
        </FancyModalHeader>

        <AbandonFlowModal
          isVisible={!!showAbandonModal}
          title="Leave without saving?"
          subtitle="Changes you have made so far will not be saved."
          leaveButtonTitle="Leave Without Saving"
          continueButtonTitle="Continue Editing"
          onDismiss={() => setShowAbandonModal(false)}
        />

        <ScrollView
          ref={scrollViewRef}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <Flex p={2}>
            <Join separator={<Spacer y={2} />}>
              <Input
                accessibilityLabel="Artist Name"
                autoCorrect={false}
                error={errors.name}
                onBlur={() => validateField("name")}
                onChange={() => handleChange}
                onChangeText={(text) => handleOnChangeText("name", text)}
                placeholder="Artist Name"
                ref={nameInputRef}
                required
                returnKeyType="next"
                title="Artist Name"
                value={values.name}
              />
              <Input
                accessibilityLabel="Nationality"
                autoCorrect={false}
                error={errors.nationality}
                onBlur={() => validateField("nationality")}
                onChange={() => handleChange}
                onChangeText={(text) => handleOnChangeText("nationality", text)}
                placeholder="Nationality"
                ref={nationalityInputRef}
                returnKeyType="next"
                title="Nationality"
                value={values.nationality}
              />
              <Flex flexDirection="row" flex={2}>
                <Join separator={<Spacer x={4} />}>
                  <Flex flex={1}>
                    <Input
                      accessibilityLabel="Birth Year"
                      autoCorrect={false}
                      error={errors.birthYear}
                      onBlur={() => validateField("birthYear")}
                      onChange={() => handleChange}
                      onChangeText={(text) => handleOnChangeText("birthYear", text)}
                      placeholder="Birth Year"
                      ref={birthYearInputRef}
                      returnKeyType="next"
                      title="Birth Year"
                      value={values.birthYear}
                    />
                  </Flex>
                  <Flex flex={1}>
                    <Input
                      accessibilityLabel="Death Year"
                      autoCorrect={false}
                      error={errors.deathYear}
                      onBlur={() => validateField("deathYear")}
                      onChange={() => handleChange}
                      onChangeText={(text) => handleOnChangeText("deathYear", text)}
                      placeholder="Death Year"
                      ref={deathYearInputRef}
                      returnKeyType="done"
                      title="Death Year"
                      value={values.deathYear}
                    />
                  </Flex>
                </Join>
              </Flex>
              <Button
                accessibilityLabel="Submit Add Artist"
                disabled={!touched}
                flex={1}
                onPress={handleSubmit}
                testID="submit-add-artist-button"
              >
                Add Artist
              </Button>
            </Join>
          </Flex>
        </ScrollView>
      </ArtsyKeyboardAvoidingView>
    </>
  )
}
