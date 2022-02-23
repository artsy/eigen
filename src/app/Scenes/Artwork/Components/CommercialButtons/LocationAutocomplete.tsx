import { themeGet } from "@styled-system/theme-get"
import { getLocationPredictions, SimpleLocation } from "app/utils/googleMaps"
import { Flex, Input, LocationIcon, Text, Touchable } from "palette"
import React, { useEffect, useState } from "react"
import { Dimensions, TouchableWithoutFeedback, View } from "react-native"
import styled from "styled-components/native"

interface Props {
  onChange: any
  initialLocation: SimpleLocation | null
}

export const LocationAutocomplete: React.FC<Props> = ({ onChange, initialLocation }) => {
  const [predictions, setPredictions] = useState<SimpleLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [query, setQuery] = useState(selectedLocation?.name || "")

  useEffect(() => {
    setPredictions([])
    onChange(selectedLocation)
  }, [selectedLocation])

  useEffect(() => {
    if (query !== selectedLocation?.name) {
      setSelectedLocation(null)
    }

    if (query.length < 3 || selectedLocation?.name === query) {
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
      setQuery(selectedLocation.name)
    }
  }
  const touchOut = () => {
    if (!!predictions.length) {
      setPredictions([])
    }
  }

  return (
    <Flex>
      <Text>Location</Text>
      <Input
        placeholder="Add Location"
        style={{ marginVertical: 10 }}
        autoFocus
        onChangeText={setQuery}
        onFocus={reset}
        value={selectedLocation ? selectedLocation.name : query}
      />
      <LocationPredictions
        predictions={predictions}
        query={query}
        onSelect={setSelectedLocation}
        onOutsidePress={touchOut}
      />
      <Text color="black60">
        Sharing your location with galleries helps them provide fast and accurate shipping quotes.
      </Text>
    </Flex>
  )
}

export const LocationPredictions = ({
  predictions,
  query,
  onSelect,
  onOutsidePress,
}: {
  predictions: SimpleLocation[]
  query?: string
  onSelect: (l: SimpleLocation) => void
  onOutsidePress: () => void
}) => {
  const [height, setHeight] = useState(0)

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
        <Backdrop style={{ height }} onLayout={() => setHeight(Dimensions.get("window").height)} />
      </TouchableWithoutFeedback>
      <Dropdown testID="dropdown">
        {predictions.map((p) => (
          <Touchable
            key={p.id}
            onPress={() => {
              onSelect(p)
            }}
            style={{ padding: 10 }}
          >
            <Flex flexDirection="row">
              <LocationIcon mr={1} />
              <Text style={{ flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>
                {highlightedQuery(p.name)}
              </Text>
            </Flex>
          </Touchable>
        ))}
      </Dropdown>
    </>
  )
}

const Dropdown = styled(View)`
  background-color: white;
  border: solid 1px ${themeGet("colors.black10")};
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 70;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`

const Backdrop = styled(View)`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`
