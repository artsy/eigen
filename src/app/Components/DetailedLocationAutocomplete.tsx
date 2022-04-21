import { MyProfileEditForm_me } from "__generated__/MyProfileEditForm_me.graphql"
import {
  getLocationDetails,
  getLocationPredictions,
  LocationWithDetails,
  SimpleLocation,
} from "app/utils/googleMaps"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Input, InputProps, Touchable } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

interface DetailedLocationAutocompleteProps extends Omit<InputProps, "onChange"> {
  initialLocation?: string
  onChange: (location: LocationWithDetails) => void
  locationInputRef?: React.RefObject<Input>
}

export interface LocationResult {
  id: string
  name: string
}

export const DetailedLocationAutocomplete: React.FC<DetailedLocationAutocompleteProps> = ({
  initialLocation = "",
  onChange,
  locationInputRef,
  ...restProps
}) => {
  const [query, setQuery] = useState(initialLocation)
  const [selectedLocation, setSelectedLocation] = useState<LocationWithDetails | null>(null)
  const [results, setResults] = useState<SimpleLocation[]>([])
  const [currentResult, setCurrentResult] = useState<LocationResult | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const inputRef = locationInputRef || useRef<Input>(null)

  const { height: screenHeight } = useScreenDimensions()

  useEffect(() => {
    searchForQuery()
  }, [query])

  useEffect(() => {
    if (!selectedLocation) {
      return
    }

    onChange(selectedLocation)
  }, [selectedLocation])

  const searchForQuery = async () => {
    const newResults = await getLocationPredictions(query)

    setResults(newResults)
  }

  const handleLocationSelected = async (result: LocationResult) => {
    setCurrentResult(result)

    const locationDetails = await getLocationDetails(result)

    setQuery(result.name)
    setSelectedLocation(locationDetails)

    inputRef.current?.blur()
  }

  const handleBlur = () => {
    setIsFocused(false)

    if (query === initialLocation || query === currentResult?.name) {
      return
    }

    // @ts-expect-error No need to set ID and name here
    setSelectedLocation({ city: query })
  }

  const showSearchResults = isFocused && query?.length > 0 && results?.length

  return (
    <>
      <Input
        {...restProps}
        ref={inputRef}
        value={query}
        onChangeText={setQuery}
        onFocus={(event) => {
          setIsFocused(true)

          restProps?.onFocus?.(event)
        }}
        onBlur={handleBlur}
        selectTextOnFocus
        testID="detailed-location-autocomplete-input"
      />
      {!!showSearchResults && (
        <ScrollView keyboardShouldPersistTaps="always">
          <Flex height={2 * screenHeight} mt={1} mb={2}>
            {results.map((result) => (
              <Touchable
                onPress={() => handleLocationSelected(result)}
                key={result.id}
                testID={`detailed-location-autocomplete-result-${result.id}`}
              >
                <Flex
                  flexDirection="row"
                  alignItems="center"
                  style={{ height: 35 }}
                  px={1}
                  py={0.5}
                >
                  <Text>{result.name}</Text>
                </Flex>
              </Touchable>
            ))}
          </Flex>
        </ScrollView>
      )}
    </>
  )
}

export const buildLocationDisplay = (location: MyProfileEditForm_me["location"]): string =>
  [location?.city, location?.state, location?.country].filter((x) => x).join(", ")
