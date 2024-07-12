import { Text, Screen, Spacer, Flex } from "@artsy/palette-mobile"
import { EditableLocation } from "__generated__/useUpdateMyProfileMutation.graphql"
import { LocationAutocomplete, buildLocationDisplay } from "app/Components/LocationAutocomplete"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { LocationWithDetails } from "app/utils/googleMaps"
import { FC } from "react"
import { KeyboardAvoidingView } from "react-native"

export const LocationStep: FC = () => {
  const { goNext, isCurrentRouteDirty, field, setField } =
    useCompleteProfile<Partial<EditableLocation>>()

  const handleOnChange = ({
    city,
    country,
    postalCode,
    state,
    stateCode,
    coordinates,
  }: LocationWithDetails) => {
    setField({
      city: city ?? "",
      country: country ?? "",
      postalCode: postalCode ?? "",
      state: state ?? "",
      stateCode: stateCode ?? "",
      coordinates: coordinates?.map((c) => parseInt(c, 10)),
    })
  }

  const handleOnClear = () => {
    setField(undefined)
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2}>
        <KeyboardAvoidingView behavior="padding">
          <Flex justifyContent="space-between" height="100%">
            <Flex>
              <Text variant="lg-display">Add your primary location</Text>

              <Spacer y={1} />

              <Text color="black60">
                Receive recommendations for local galleries, shows, and offers on artworks.
              </Text>

              <Spacer y={2} />

              <LocationAutocomplete
                allowCustomLocation
                aria-label="Enter your primary location"
                autoFocus
                title="Primary location"
                placeholder="Primary location"
                displayLocation={buildLocationDisplay(field)}
                onChange={handleOnChange}
                enableClearButton
                onClear={handleOnClear}
              />
            </Flex>

            <Footer isFormDirty={isCurrentRouteDirty} onGoNext={goNext} />
          </Flex>
        </KeyboardAvoidingView>
      </Screen.Body>
    </Screen>
  )
}
