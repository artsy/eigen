import { Flex, Input, useSpace } from "@artsy/palette-mobile"
import { EditableLocation } from "__generated__/updateMyUserProfileMutation.graphql"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { LocationAutocomplete, buildLocationDisplay } from "app/Components/LocationAutocomplete"
import { useFormikContext } from "formik"
import { useRef } from "react"
import * as Yup from "yup"

interface EditableLocationProps extends EditableLocation {
  display: string | null
}

export interface UserProfileFormikSchema {
  name: string
  displayLocation: { display: string | null }
  location: Partial<EditableLocationProps> | null | undefined
  profession: string
  otherRelevantPositions: string
}

export const userProfileYupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
})

interface UserProfileFieldsProps {
  bottomSheetInput?: boolean
}

export const UserProfileFields: React.FC<UserProfileFieldsProps> = ({ bottomSheetInput }) => {
  const formikBag = useFormikContext<UserProfileFormikSchema>()
  const { values, setFieldValue, handleChange, errors, validateForm } = formikBag

  const nameInputRef = useRef<Input>(null)
  const locationInputRef = useRef<Input>(null)
  const professionInputRef = useRef<Input>(null)
  const relevantPositionsInputRef = useRef<Input>(null)

  const space = useSpace()

  const InputComponent = bottomSheetInput ? BottomSheetInput : Input

  return (
    <Flex gap={space(2)}>
      <InputComponent
        ref={nameInputRef}
        title="Full name"
        onChangeText={handleChange("name")}
        onBlur={() => validateForm()}
        blurOnSubmit={false}
        error={errors.name}
        returnKeyType="next"
        value={values.name}
        onSubmitEditing={() => {
          locationInputRef.current?.focus()
        }}
      />
      <Flex>
        <LocationAutocomplete
          allowCustomLocation
          enableClearButton
          inputRef={locationInputRef}
          title="Primary location"
          placeholder="City name"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            professionInputRef.current?.focus()
          }}
          displayLocation={buildLocationDisplay(values.location)}
          onChange={({ city, country, postalCode, state, stateCode, coordinates }) => {
            setFieldValue("location", {
              city: city ?? "",
              country: country ?? "",
              postalCode: postalCode ?? "",
              state: state ?? "",
              stateCode: stateCode ?? "",
              coordinates,
            })
          }}
          onClear={() =>
            setFieldValue("location", {
              city: "",
              country: "",
              postalCode: "",
              state: "",
              stateCode: "",
            })
          }
          bottomSheetInput={bottomSheetInput}
        />
      </Flex>
      <InputComponent
        ref={professionInputRef}
        title="Profession"
        onChangeText={handleChange("profession")}
        onBlur={() => validateForm()}
        blurOnSubmit={false}
        error={errors.profession}
        returnKeyType="next"
        value={values.profession}
        placeholder="Profession or job title"
        onSubmitEditing={() => {
          relevantPositionsInputRef.current?.focus()
        }}
      />
      <InputComponent
        ref={relevantPositionsInputRef}
        title="Other Relevant Positions"
        onChangeText={handleChange("otherRelevantPositions")}
        onBlur={() => validateForm()}
        error={errors.otherRelevantPositions}
        value={values.otherRelevantPositions}
        placeholder="Memberships, institutions, positions"
        returnKeyType="done"
      />
    </Flex>
  )
}
