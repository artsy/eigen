import { Flex, Input, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { LocationAutocomplete, buildLocationDisplay } from "app/Components/LocationAutocomplete"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { LocationWithDetails } from "app/utils/googleMaps"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { FC, useRef } from "react"

export const LocationStep: FC = () => {
  const ref = useRef<Input>(null)
  const { goNext } = useCompleteProfile()

  const location = CompleteMyProfileStore.useStoreState((state) => state.progressState.location)
  const setProgressState = CompleteMyProfileStore.useStoreActions(
    (actions) => actions.setProgressState
  )

  const handleOnChange = ({
    city,
    country,
    postalCode,
    state,
    stateCode,
    coordinates,
  }: LocationWithDetails) => {
    setProgressState({
      type: "location",
      value: {
        city: city ?? "",
        country: country ?? "",
        postalCode: postalCode ?? "",
        state: state ?? "",
        stateCode: stateCode ?? "",
        coordinates,
      },
    })
  }

  const handleOnClear = () => {
    setProgressState({ type: "location", value: undefined })
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2} fullwidth>
        <KeyboardAvoidingContainer style={{ justifyContent: "space-between" }}>
          <Flex px={2} onLayout={() => ref.current?.focus()}>
            <Text variant="lg-display">Add your primary location</Text>

            <Spacer y={1} />

            <Text color="mono60">
              Receive recommendations for local galleries, shows, and offers on artworks.
            </Text>

            <Spacer y={2} />

            <LocationAutocomplete
              allowCustomLocation
              aria-label="Enter your primary location"
              title="Primary location"
              placeholder="Primary location"
              displayLocation={buildLocationDisplay(location)}
              onChange={handleOnChange}
              enableClearButton
              onClear={handleOnClear}
              // Android keyboard doesn't work so great with autofocus prop, slower devices don't measure 100% right the layout
              inputRef={ref}
            />
          </Flex>

          <Footer isFormDirty={!!location} onGoNext={goNext} />
        </KeyboardAvoidingContainer>
      </Screen.Body>
    </Screen>
  )
}
