import { getLocationDetails, getLocationPredictions, SimpleLocation } from "app/utils/googleMaps"
import { Box, Flex, Input, LocationIcon, Text, useSpace } from "palette"
import React, { useEffect, useState } from "react"
import { Image } from "react-native"
import { Location } from "../../Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"

const MIN_LENGTH = 3
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
        countryCode: "",
      })
    }
  }, [selectedLocation])

  useEffect(() => {
    if (query !== selectedLocation?.city) {
      setSelectedLocation(null)
    }

    if (query.length < MIN_LENGTH || selectedLocation?.city === query) {
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

  const locationValue = selectedLocation?.city
    ? `${selectedLocation.city}, ${selectedLocation.state}, ${selectedLocation.country}`
    : query

  return (
    <>
      <Input
        title="City"
        placeholder="Enter City Where Artwork Is Located"
        onChangeText={setQuery}
        onFocus={reset}
        testID="Submission_LocationInput"
        value={locationValue}
      />
      <LocationPredictions
        selectedLocation={selectedLocation}
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
  selectedLocation,
}: {
  selectedLocation: Location | null
  predictions: SimpleLocation[]
  query?: string
  onSelect: (loc: Location) => void
  onOutsidePress: () => void
}) => {
  const space = useSpace()

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
    const { city, state, country, countryCode } = await getLocationDetails(item)
    onSelect({
      city: city || "",
      state: state || "",
      country: country || "",
      countryCode: countryCode || "",
    })
  }

  if (selectedLocation || !query || query.length < MIN_LENGTH) {
    return null
  }

  return (
    <Box height={175} mt={0.5}>
      <Flex
        style={{
          flex: 1,
          padding: space(1),
          borderStyle: "solid",
          borderColor: "#707070",
          borderWidth: 1,
        }}
      >
        <Flex height={175}>
          {predictions.length ? (
            predictions.map((item, index) => {
              return (
                <Flex key={index} mb={1} onTouchStart={() => onLocationSelect(item)}>
                  <Flex flexDirection="row" alignItems="center">
                    <LocationIcon mr={1} />
                    <Text>{highlightedQuery(item.name)}</Text>
                  </Flex>
                </Flex>
              )
            })
          ) : (
            <Text variant="md" color="black60" textAlign="center">
              Please try searching again with a different spelling.
            </Text>
          )}
        </Flex>
        <Flex alignItems="flex-end" pt={0.5}>
          <Image source={require("@images/powered_by_google.webp")} resizeMode="contain" />
        </Flex>
      </Flex>
    </Box>
  )
}
