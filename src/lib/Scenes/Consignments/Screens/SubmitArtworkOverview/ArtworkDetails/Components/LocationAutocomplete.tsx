import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { getLocationDetails, getLocationPredictions, SimpleLocation } from "lib/utils/googleMaps"
import { Box, Flex, Input, LocationIcon, Separator, Text, Touchable, useSpace } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { FlatList } from "react-native"
import { Location } from "../ArtworkDetailsForm"

interface Props {
  initialLocation: Location
  onChange: (loc: Location) => void
}

export const LocationAutocomplete: React.FC<Props> = ({ initialLocation, onChange }) => {
  const [predictions, setPredictions] = useState<SimpleLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation)
  const [query, setQuery] = useState(selectedLocation?.city || "")

  useEffect(() => {
    setPredictions([])

    if (selectedLocation) {
      onChange(selectedLocation)
    } else {
      onChange({
        city: "",
        state: "",
        country: "",
      })
    }
  }, [selectedLocation])

  useEffect(() => {
    if (query !== selectedLocation?.city) {
      setSelectedLocation(null)
    }

    if (query.length < 3 || selectedLocation?.city === query) {
      setPredictions([])
    } else {
      ;(async () => {
        const googlePredictions = await getLocationPredictions(query)
        setPredictions(googlePredictions)
      })()
    }
  }, [query])

  const reset = () => {
    if (selectedLocation) {
      setQuery(selectedLocation.city)
    }
  }
  const touchOut = () => {
    if (!!predictions.length) {
      setPredictions([])
    }
  }

  return (
    <>
      <Input
        title="Location"
        placeholder="Enter City Where Artwork Is Located"
        onChangeText={setQuery}
        onFocus={reset}
        testID="Consignment_LocationInput"
        value={
          selectedLocation ? `${selectedLocation.city}, ${selectedLocation.state}, ${selectedLocation.country}` : query
        }
      />
      <LocationPredictions
        predictions={predictions}
        query={query}
        onSelect={setSelectedLocation}
        onOutsidePress={touchOut}
      />
    </>
  )
}

export const LocationPredictions = ({
  predictions,
  query,
  onSelect,
}: {
  predictions: SimpleLocation[]
  query?: string
  onSelect: (loc: Location) => void
  onOutsidePress: () => void
}) => {
  const space = useSpace()
  const flatListRef = useRef<FlatList<any>>(null)

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

  const onLocationSelect = async (item: SimpleLocation) => {
    const { city, state, country } = await getLocationDetails(item)
    onSelect({
      city: city || "",
      state: state || "",
      country: country || "",
    })
  }

  if (!predictions.length) {
    return null
  }

  return (
    <Box height={150}>
      <AboveTheFoldFlatList<any>
        listRef={flatListRef}
        style={{
          flex: 1,
          padding: space(2),
          borderStyle: "solid",
          borderColor: "#707070",
          borderWidth: 1,
          marginTop: 3,
        }}
        data={predictions}
        showsVerticalScrollIndicator
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !predictions.length
            ? () => (
                <Text variant="md" color="black60" textAlign="center">
                  Please try searching again with a different spelling.
                </Text>
              )
            : null
        }
        renderItem={({ item, index }) => {
          return (
            <Flex key={index} mb={1}>
              <Touchable onPress={() => onLocationSelect(item)}>
                <Flex flexDirection="row" alignItems="center">
                  <LocationIcon mr={1} />
                  <Text variant="xs">{highlightedQuery(item.name)}</Text>
                </Flex>
              </Touchable>
              <Separator mt={1} />
            </Flex>
          )
        }}
      />
    </Box>
  )
}
