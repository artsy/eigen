import { ArtsyKeyboardAvoidingView, Flex, Join, Spacer, Button } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { AbandonFlowModal } from "app/Components/AbandonFlowModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Input } from "app/Components/Input"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { GlobalStore } from "app/store/GlobalStore"
import { useFormik } from "formik"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"
import * as Yup from "yup"

export interface NewMyCollectionArtistFormikSchema {
  name: string
  nationality?: string
  birthYear?: string
  deathYear?: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name field is required").min(1, "Name field is required"),
  nationality: Yup.string().trim(),
  birthYear: Yup.string().trim().max(4, "Birth year is invalid"),
  deathYear: Yup.string().trim().max(4, "Death year is invalid"),
})

export const AddMyCollectionArtist: React.FC<
  StackScreenProps<ArtworkFormScreen, "AddMyCollectionArtist">
> = ({ route, navigation }) => {
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const [showAbandonModal, setShowAbandonModal] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null)
  const nameInputRef = useRef<Input>(null)
  const nationalityInputRef = useRef<Input>(null)
  const birthYearInputRef = useRef<Input>(null)
  const deathYearInputRef = useRef<Input>(null)

  const { handleSubmit, validateField, handleChange, dirty, isValid, values, errors } =
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
      onSubmit: () => {
        GlobalStore.actions.myCollection.artwork.updateFormValues({
          customArtist: values,
          metric: preferredMetric,
        })
        navigation.navigate("ArtworkFormMain", { ...route.params })
      },
      validationSchema: validationSchema,
    })

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
          continueButtonTitle="Continue Editing"
          isVisible={!!showAbandonModal}
          leaveButtonTitle="Leave Without Saving"
          onDismiss={() => setShowAbandonModal(false)}
          subtitle="Changes you have made so far will not be saved."
          title="Leave without saving?"
        />

        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
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
                onSubmitEditing={() => nationalityInputRef.current?.focus()}
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
                onSubmitEditing={() => birthYearInputRef.current?.focus()}
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
                      keyboardType="numeric"
                      maxLength={4}
                      onBlur={() => validateField("birthYear")}
                      onChange={() => handleChange}
                      onChangeText={(text) => handleOnChangeText("birthYear", text)}
                      placeholder="Birth Year"
                      ref={birthYearInputRef}
                      title="Birth Year"
                      value={values.birthYear}
                    />
                  </Flex>
                  <Flex flex={1}>
                    <Input
                      accessibilityLabel="Death Year"
                      autoCorrect={false}
                      error={errors.deathYear}
                      keyboardType="numeric"
                      maxLength={4}
                      onBlur={() => validateField("deathYear")}
                      onChange={() => handleChange}
                      onChangeText={(text) => handleOnChangeText("deathYear", text)}
                      placeholder="Death Year"
                      ref={deathYearInputRef}
                      title="Death Year"
                      value={values.deathYear}
                    />
                  </Flex>
                </Join>
              </Flex>
              <Button
                accessibilityLabel="Submit Add Artist"
                disabled={!dirty || !isValid}
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
