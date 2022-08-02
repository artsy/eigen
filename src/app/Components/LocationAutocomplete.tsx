import {
  getLocationDetails,
  getLocationPredictions,
  LocationWithDetails,
  SimpleLocation,
} from "app/utils/googleMaps"
import { Flex, Input, InputProps, LocationIcon, Text, Touchable } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { useScreenDimensions } from "shared/hooks"

interface LocationAutocompleteInputProps extends Omit<InputProps, "onChange"> {
  floating?: boolean
  initialLocation?: LocationWithDetails | null
  displayLocation?: string
  inputRef?: React.RefObject<Input>
  onChange: (l: LocationWithDetails) => void
  FooterComponent?: () => JSX.Element
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
export const LocationAutocompleteInput: React.FC<LocationAutocompleteInputProps> = ({
  title,
  placeholder,
  initialLocation,
  onChange,
  displayLocation = "",
  floating,
  FooterComponent,
  inputRef,
  ...restProps
}) => {
  const [predictions, setPredictions] = useState<SimpleLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [query, setQuery] = useState(selectedLocation?.name || displayLocation)
  const ref = inputRef || useRef<Input>(null)

  const selectedLocationQuery = selectedLocation?.name || displayLocation

  useEffect(() => {
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
      <Input
        {...restProps}
        ref={ref}
        testID="autocomplete-location-input"
        title={title}
        placeholder={placeholder}
        onChangeText={setQuery}
        onFocus={reset}
        value={selectedLocation ? selectedLocation.name : query}
      />

      <LocationPredictions
        predictions={predictions}
        query={query}
        onSelect={setSelectedLocation}
        onOutsidePress={touchOut}
        isFloating={floating}
      />

      {!!FooterComponent && <FooterComponent />}
    </Flex>
  )
}

const LocationPredictions = ({
  predictions,
  query,
  onSelect,
  onOutsidePress,
  isFloating,
}: {
  predictions: SimpleLocation[]
  query?: string
  onSelect: (l: SimpleLocation) => void
  onOutsidePress?: () => void
  isFloating?: boolean
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

  if (predictions.length === 0) {
    return null
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={onOutsidePress}>
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
        style={[
          {
            shadowColor: "rgba(0,0,0)",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 4,
          },
          isFloating ? { position: "absolute", top: 72 } : {},
        ]}
        backgroundColor="white100"
        borderWidth={1}
        borderColor="black10"
        width="100%"
      >
        {predictions.map((p) => (
          <Touchable haptic key={p.id} onPress={() => onSelect(p)} style={{ padding: 10 }}>
            <Flex flexDirection="row" alignItems="center">
              <LocationIcon mr={1} />
              <Text style={{ flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>
                {highlightedQuery(p.name)}
              </Text>
            </Flex>
          </Touchable>
        ))}
      </Flex>
    </>
  )
}

export const buildLocationDisplay = (location: LocationDisplay | null): string =>
  [location?.city, location?.state, location?.country].filter((x) => x).join(", ")

interface LocationDisplay {
  city?: string | null
  state?: string | null
  country?: string | null
}
