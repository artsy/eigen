import { MapPinIcon } from "@artsy/icons/native"
import { Flex, Input, InputComponentProps, Text, Touchable } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import {
  LocationWithDetails,
  SimpleLocation,
  getLocationDetails,
  getLocationPredictions,
} from "app/utils/googleMaps"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useEffect, useRef, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"

interface LocationAutocompleteProps extends Omit<InputComponentProps, "onChange"> {
  floating?: boolean
  initialLocation?: LocationWithDetails | null
  displayLocation?: string
  allowCustomLocation?: boolean
  inputRef?: React.RefObject<Input>
  showError?: boolean
  onChange: (l: LocationWithDetails) => void
  FooterComponent?: () => JSX.Element
  bottomSheetInput?: boolean
}

/**
 * This component is used to autocomplete a location based on the user's input.
 *
 * We either use the `initialLocation` or `displayLocation` to set the initial value of the input.
 *
 * @param {string} displayLocation The initial location string to display in the input.
 * @param {LocationWithDetails} initialLocation The initial location object with the type {@link LocationWithDetails} to display in the input.
 *
 * @returns The `onChange` returns a location object with the type {@link LocationWithDetails}.
 */
export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  title,
  placeholder,
  initialLocation,
  onChange,
  onFocus,
  displayLocation = "",
  floating,
  FooterComponent,
  inputRef,
  allowCustomLocation = false,
  showError,
  bottomSheetInput,
  ...restProps
}) => {
  const [predictions, setPredictions] = useState<SimpleLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [query, setQuery] = useState(selectedLocation?.name || displayLocation)
  const innerRef = useRef<Input>(null)
  const ref = inputRef || innerRef

  const selectedLocationQuery = selectedLocation?.name || displayLocation

  const InputComponent = bottomSheetInput ? BottomSheetInput : Input

  useEffect(() => {
    if (selectedLocation) {
      setQuery(selectedLocation?.name)
    }
    setPredictions([])
    handleChange(selectedLocation)
  }, [selectedLocation])

  useEffect(() => {
    if (query !== selectedLocationQuery) {
      setSelectedLocation(null)
    }

    if (query.length < 3 || selectedLocationQuery === query) {
      setPredictions([])
    } else {
      ;(async () => {
        const googlePredictions = await getLocationPredictions(query)
        setPredictions(googlePredictions)
      })()
    }
  }, [query])

  const handleChange = async (selection?: SimpleLocation | null) => {
    if (!selection?.id || !selection?.name) {
      return
    }

    const locationDetails = await getLocationDetails(selection)

    onChange(locationDetails)
  }

  const handleBlur = () => {
    if (allowCustomLocation) {
      if (
        query === initialLocation?.name ||
        query === displayLocation ||
        query === selectedLocation?.name
      ) {
        return
      }

      setPredictions([])
      // @ts-expect-error No need to set ID and name here
      onChange({ city: query })
    }
  }

  const reset = () => {
    if (selectedLocation) {
      setQuery(selectedLocationQuery)
    }
  }

  const touchOut = () => {
    if (!!predictions.length) {
      setPredictions([])
    }
  }

  return (
    <Flex>
      <InputComponent
        {...restProps}
        ref={ref}
        testID="autocomplete-location-input"
        title={title}
        placeholder={placeholder}
        onChangeText={setQuery}
        onFocus={(e) => {
          onFocus?.(e)
          reset()
        }}
        onBlur={handleBlur}
        value={selectedLocation ? selectedLocation.name : query}
      />

      <LocationPredictions
        predictions={predictions}
        query={query}
        onSelect={setSelectedLocation}
        onOutsidePress={touchOut}
        isFloating={floating}
        showError={showError}
        locationSelected={selectedLocation?.name === query}
      />

      {!!FooterComponent && <FooterComponent />}
    </Flex>
  )
}

const LocationPredictions = ({
  predictions,
  query,
  isFloating,
  showError,
  onSelect,
  onOutsidePress,
  locationSelected,
}: {
  predictions: SimpleLocation[]
  query?: string
  isFloating?: boolean
  showError?: boolean
  locationSelected?: boolean
  onSelect: (l: SimpleLocation) => void
  onOutsidePress?: () => void
}) => {
  const [height, setHeight] = useState(0)

  const { height: screenHeight } = useScreenDimensions()

  const highlightedQuery = (entry: string) => {
    const re = new RegExp(`(${query?.replace(" ", "|")})`, "gi")
    const brokenEntry = entry.split(re)
    if (!query || brokenEntry.length === 1) {
      return entry
    }
    const formatted = brokenEntry.map((x, i) => {
      if (re.test(x)) {
        return (
          <Text key={`map-entry-${i}`} fontWeight="bold">
            {x}
          </Text>
        )
      }
      return x
    })
    return formatted
  }

  if ((predictions.length === 0 && !showError) || locationSelected || !query || query.length < 3) {
    return null
  }

  const emptyResults = showError && predictions.length === 0 && !locationSelected

  return (
    <>
      <TouchableWithoutFeedback accessibilityRole="button" onPress={onOutsidePress}>
        <Flex
          position="absolute"
          width="100%"
          top={0}
          left={0}
          style={{ height }}
          onLayout={() => setHeight(screenHeight)}
        />
      </TouchableWithoutFeedback>

      <Flex
        testID="autocomplete-location-predictions"
        style={[
          {
            shadowColor: "rgba(0,0,0)",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 4,
            zIndex: 100,
          },
          isFloating ? { position: "absolute", top: 72 } : {},
        ]}
        backgroundColor="mono0"
        borderWidth={1}
        borderColor="mono10"
        width="100%"
      >
        {predictions.map((p) => (
          <Touchable
            accessibilityRole="button"
            haptic
            key={p.id}
            onPress={() => onSelect(p)}
            style={{ padding: 10 }}
            testID={`autocomplete-location-prediction-${p.id}`}
          >
            <Flex flexDirection="row" alignItems="center">
              <MapPinIcon mr={1} />
              <Text style={{ flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>
                {highlightedQuery(p.name)}
              </Text>
            </Flex>
          </Touchable>
        ))}
        {!!emptyResults && (
          <Text m={1} variant="sm-display" color="mono60" textAlign="center">
            Please try searching again with a different spelling.
          </Text>
        )}
      </Flex>
    </>
  )
}

export const buildLocationDisplay = (location: LocationDisplay | null | undefined): string =>
  [location?.city, location?.state, location?.country].filter((x) => x).join(", ")

interface LocationDisplay {
  city?: string | null
  state?: string | null
  country?: string | null
}
