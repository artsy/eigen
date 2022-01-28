import { MyProfileEditFormModal_me } from "__generated__/MyProfileEditFormModal_me.graphql"
import { LocationResult } from "lib/Scenes/Consignments"
import {
  getLocationDetails,
  getLocationPredictions,
  LocationWithDetails,
  SimpleLocation,
} from "lib/utils/googleMaps"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Input, InputProps, Touchable } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

interface DetailedLocationAutocomplete extends Omit<InputProps, "onChange"> {
  initialLocation: string
  onChange: (location: LocationWithDetails) => void
}

export const LocationAutocompleteInput: React.FC<DetailedLocationAutocomplete> = ({
  initialLocation,
  onChange,
  ...restProps
}) => {
  const [query, setQuery] = useState(initialLocation)
  const [selectedLocation, setSelectedLocation] = useState<LocationWithDetails | null>(null)
  const [results, setResults] = useState<SimpleLocation[]>([])
  const [isFocused, setIsFocused] = useState(false)

  const inputRef = useRef<Input>(null)

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
    try {
      const locationDetails = await getLocationDetails(result)

      setQuery(result.name)
      setSelectedLocation(locationDetails)
      inputRef.current?.blur()
    } catch (error) {
      console.error(error)
    }
  }

  const handleBlur = () => {
    if (query !== initialLocation) {
      // @ts-expect-error No need to set ID and name here
      setSelectedLocation({ city: query })
    }

    setIsFocused(false)
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
      />
      {!!showSearchResults && (
        <ScrollView keyboardShouldPersistTaps="always">
          <Flex height={2 * screenHeight} mt={1} mb={2}>
            {results.map((result) => (
              <Touchable onPress={() => handleLocationSelected(result)} key={result.id}>
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

export const buildLocationDisplay = (location: MyProfileEditFormModal_me["location"]): string =>
  [location?.city, location?.state, location?.country].filter((x) => x).join(", ")
