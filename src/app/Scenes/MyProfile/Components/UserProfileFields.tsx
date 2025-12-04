import { Flex, Input } from "@artsy/palette-mobile"
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
  instagram: string
  linkedIn: string
}

export const userProfileYupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  instagram: Yup.string()
    .nullable()
    .test(
      "instagram-format",
      "Instagram handle can only contain letters, numbers, underscores, and periods",
      (value) => {
        if (value === null || value === undefined || value === "") return true
        return /^@?[a-zA-Z0-9_.]+$/.test(value)
      }
    ),
  linkedIn: Yup.string()
    .nullable()
    .test(
      "linkedin-format",
      "LinkedIn handle can only contain letters, numbers, and hyphens",
      (value) => {
        if (value === null || value === undefined || value === "") return true
        return /^[a-zA-Z0-9\-]+$/.test(value)
      }
    ),
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
  const instagramInputRef = useRef<Input>(null)
  const linkedInInputRef = useRef<Input>(null)

  const InputComponent = bottomSheetInput ? BottomSheetInput : Input

  return (
    <Flex gap={2}>
      <InputComponent
        ref={nameInputRef}
        title="Full name"
        accessibilityLabel="Full name"
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
          accessibilityLabel="Primary location"
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
        accessibilityLabel="Profession"
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
        title="Other relevant positions"
        accessibilityLabel="Other relevant positions"
        onChangeText={handleChange("otherRelevantPositions")}
        onBlur={() => validateForm()}
        blurOnSubmit={false}
        error={errors.otherRelevantPositions}
        value={values.otherRelevantPositions}
        placeholder="Memberships, institutions, positions"
        returnKeyType="next"
        onSubmitEditing={() => {
          instagramInputRef.current?.focus()
        }}
      />
      <InputComponent
        ref={instagramInputRef}
        title="Instagram"
        accessibilityLabel="Instagram handle"
        onChangeText={handleChange("instagram")}
        onBlur={() => validateForm()}
        blurOnSubmit={false}
        error={errors.instagram}
        value={values.instagram}
        placeholder="Instagram handle"
        returnKeyType="next"
        maxLength={256}
        autoCapitalize="none"
        onSubmitEditing={() => {
          linkedInInputRef.current?.focus()
        }}
      />
      <InputComponent
        ref={linkedInInputRef}
        title="LinkedIn"
        accessibilityLabel="LinkedIn handle"
        onChangeText={handleChange("linkedIn")}
        onBlur={() => validateForm()}
        error={errors.linkedIn}
        value={values.linkedIn}
        placeholder="LinkedIn handle"
        returnKeyType="done"
        maxLength={256}
        autoCapitalize="none"
      />
    </Flex>
  )
}
