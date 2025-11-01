import { Button, Flex, Input, InputRef, Join, Screen, Spacer } from "@artsy/palette-mobile"
import { RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { AbandonFlowModal } from "app/Components/AbandonFlowModal"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { useFormik } from "formik"
import React, { useEffect, useRef, useState } from "react"
import { Keyboard, KeyboardAvoidingView, ScrollView } from "react-native"
import * as Yup from "yup"

export interface MyCollectionCustomArtistSchema {
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

export const AddMyCollectionArtist: React.FC<{ useNativeHeader?: boolean }> = (props) => {
  const navigation =
    useNavigation<StackNavigationProp<ArtworkFormScreen, "AddMyCollectionArtist">>()

  const route = useRoute<RouteProp<ArtworkFormScreen, "AddMyCollectionArtist">>()

  const [showAbandonModal, setShowAbandonModal] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null)
  const nameInputRef = useRef<InputRef>(null)
  const nationalityInputRef = useRef<InputRef>(null)
  const birthYearInputRef = useRef<InputRef>(null)
  const deathYearInputRef = useRef<InputRef>(null)

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      Keyboard.dismiss()
    }
  }, [isFocused])

  const { handleSubmit, validateField, handleChange, dirty, isValid, values, errors } =
    useFormik<MyCollectionCustomArtistSchema>({
      enableReinitialize: true,
      validateOnChange: true,
      validateOnBlur: true,
      initialValues: {
        name: route?.params?.artistDisplayName || "",
        nationality: "",
        birthYear: "",
        deathYear: "",
      },
      initialErrors: {},
      onSubmit: () => {
        const { onSubmit } = route?.params || {}
        if (onSubmit) {
          onSubmit(values)
        }
      },
      validationSchema: validationSchema,
    })

  const handleOnChangeText = (field: keyof MyCollectionCustomArtistSchema, text: string) => {
    // hide error when the user starts to type again
    if (errors[field]) {
      validateField(field)
    }
    handleChange(field)(text)
  }

  const handleBackPress = () => {
    if (dirty && !showAbandonModal) {
      setShowAbandonModal(true)
      return
    }

    navigation.goBack()
  }

  return (
    <Screen safeArea={false}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {!props.useNativeHeader && (
          <NavigationHeader onLeftButtonPress={handleBackPress} hideBottomDivider>
            Add New Artist
          </NavigationHeader>
        )}

        <AbandonFlowModal
          continueButtonTitle="Continue Editing"
          isVisible={!!showAbandonModal}
          leaveButtonTitle="Leave Without Saving"
          onDismiss={() => setShowAbandonModal(false)}
          onLeave={navigation.goBack}
          subtitle="Changes you have made so far will not be saved."
          title="Leave without saving?"
        />

        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
        >
          <Flex px={2}>
            <Join separator={<Spacer y={2} />}>
              <Input
                accessibilityLabel="Artist Name"
                autoCorrect={false}
                error={errors.name}
                onBlur={() => validateField("name")}
                onChange={() => handleChange}
                onChangeText={(text) => handleOnChangeText("name", text)}
                onSubmitEditing={() => nationalityInputRef.current?.focus()}
                ref={nameInputRef}
                required
                returnKeyType="next"
                title="Artist Name"
                value={values.name}
                testID="artist-input"
              />
              <Input
                accessibilityLabel="Nationality"
                autoCorrect={false}
                error={errors.nationality}
                onBlur={() => validateField("nationality")}
                onChange={() => handleChange}
                onChangeText={(text) => handleOnChangeText("nationality", text)}
                onSubmitEditing={() => birthYearInputRef.current?.focus()}
                ref={nationalityInputRef}
                returnKeyType="next"
                title="Nationality"
                value={values.nationality}
                testID="nationality-input"
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
                      ref={birthYearInputRef}
                      title="Birth Year"
                      value={values.birthYear}
                      testID="birth-year-input"
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
                      ref={deathYearInputRef}
                      title="Death Year"
                      value={values.deathYear}
                      testID="death-year-input"
                    />
                  </Flex>
                </Join>
              </Flex>
              <Spacer y={1} />

              <Button
                accessibilityLabel="Submit Add Artist"
                disabled={!dirty || !isValid}
                flex={1}
                onPress={() => handleSubmit()}
                testID="submit-add-artist-button"
              >
                Add Artist
              </Button>
            </Join>
          </Flex>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
