import { Text, Screen, Spacer } from "@artsy/palette-mobile"
import { LocationAutocomplete, buildLocationDisplay } from "app/Components/LocationAutocomplete"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { Header } from "app/Scenes/CompleteMyProfile/Header"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import { LocationWithDetails } from "app/utils/googleMaps"

export const LocationStep = () => {
  const { goNext, isCurrentRouteDirty, field, setField } =
    useCompleteProfile<Partial<LocationWithDetails>>()

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
      coordinates,
    })
  }

  const handleOnClear = () => {
    setField(undefined)
  }

  return (
    <Screen>
      <Screen.Body>
        <Header />

        <Spacer y={2} />

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

        <Footer isFormDirty={isCurrentRouteDirty} onGoNext={goNext} />
      </Screen.Body>
    </Screen>
  )
}
