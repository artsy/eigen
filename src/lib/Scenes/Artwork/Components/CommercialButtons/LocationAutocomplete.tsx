import { Input } from "lib/Components/Input/Input"
import { GMapsLocation, queryLocation } from "lib/utils/googleMaps"
import { color, Flex, LocationIcon, Text, Touchable } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Dimensions, TouchableWithoutFeedback, View } from "react-native"
import styled from "styled-components/native"

interface Props {
  onChange: any
  initialLocation: string
}

export const LocationAutocomplete: React.FC<Props> = ({ onChange, initialLocation }) => {
  const [predictions, setPredictions] = useState<GMapsLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState(Boolean(initialLocation) ? initialLocation : "")
  const [query, setQuery] = useState(selectedLocation)

  // Autofocus
  const input = useRef<Input>(null)
  useEffect(() => {
    input.current?.focus()
  }, [input])

  useEffect(() => {
    setPredictions([])
    onChange(selectedLocation)
  }, [selectedLocation])

  useEffect(() => {
    if (query !== selectedLocation) {
      setSelectedLocation("")
    }

    if (query.length < 3 || selectedLocation === query) {
      setPredictions([])
    } else {
      ;(async () => {
        const googlePredictions = await queryLocation(query)
        setPredictions(googlePredictions)
      })()
    }
  }, [query])

  const reset = () => {
    if (Boolean(selectedLocation)) {
      setQuery(selectedLocation)
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
        ref={input}
        placeholder="Add Location"
        style={{ marginVertical: 10 }}
        onChangeText={setQuery}
        onFocus={reset}
        value={Boolean(selectedLocation) ? selectedLocation : query}
      />
      <LocationPredictions
        predictions={predictions}
        query={query}
        onSelect={setSelectedLocation}
        onOutsidePress={touchOut}
      />
      <Text color="black60">
        Sharing your location with galleries helps them provide fast and accurate shipping quotes. You can always edit
        this information later in your Collector Profile.
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
  predictions: GMapsLocation[]
  query?: string
  onSelect: (l: string) => void
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
      <Dropdown data-test-id="dropdown">
        {predictions.map((p) => (
          <Touchable
            key={p.id}
            onPress={() => {
              onSelect(p.name)
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
  border: solid 1px ${color("black10")};
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
