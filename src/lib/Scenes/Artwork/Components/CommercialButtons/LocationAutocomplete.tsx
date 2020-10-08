import { Input } from "lib/Components/Input/Input"
import { Flex, LocationIcon, Text, Touchable } from "palette"
import { stringify } from "qs"
import React, { useState } from "react"
import Config from "react-native-config"
import styled from "styled-components/native"

interface Props {
  onChange: any
}

interface Location {
  id: string
  name: string
}

/** Expected GMaps API prediction shape */
interface LocationPrediction {
  place_id: string
  description: string
}

// maybe this is overkill, or maybe it would be nice to move so we can mock it out
class GmapsApi {
  static async queryLocation(query: string): Promise<Location[]> {
    const apiKey = Config.GOOGLE_MAPS_API_KEY
    const queryString = stringify({
      key: apiKey,
      language: "en",
      types: "(cities)",
      input: query,
    })

    const response = await fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString)
    const results = await response.json()
    return results.predictions.map(this.predictionToResult)
  }

  private static predictionToResult(prediction: LocationPrediction): Location {
    return { id: prediction.place_id, name: prediction.description }
  }
}

export const LocationAutocomplete: React.FC<Props> = ({ onChange }) => {
  const [predictions, setPredictions] = useState<Location[]>([])

  const inputChange = async (str: string): Promise<void> => {
    if (str.length < 3) {
      setPredictions([])
    } else {
      const googlePredictions = await GmapsApi.queryLocation(str)
      setPredictions(googlePredictions)
      onChange(str)
    }
  }

  return (
    <>
      <Text>Location</Text>
      <Input placeholder="Add Location" style={{ marginVertical: 10 }} onChangeText={inputChange} />
      <LocationPredictions predictions={predictions} />
      <Text color="black60">
        Sharing your location with galleries helps them provide fast and accurate shipping quotes. You can always edit
        this information later in your Collector Profile.
      </Text>
    </>
  )
}

const LocationPredictions = ({ predictions }: { predictions: Location[] }) => {
  if (predictions.length === 0) {
    return null
  }
  return (
    <Dropdown>
      {predictions.map((p) => (
        <Touchable
          key={p.id}
          onPress={() => {
            console.warn(`selected ${p.name}...`)
          }}
          style={{ padding: 10 }}
        >
          <Flex flexDirection="row">
            <LocationIcon mr={1} />
            <Text>{p.name}</Text>
          </Flex>
        </Touchable>
      ))}
    </Dropdown>
  )
}

const Dropdown = styled(Flex)`
  background-color: white;
  border: solid 1px #e5e5e5;
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 70;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`
