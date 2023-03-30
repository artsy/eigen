import { Text } from "@artsy/palette-mobile"
import { TouchableRow } from "app/Components/TouchableRow"
import { Button, Input } from "palette"
import { useState } from "react"
import { FlatList } from "react-native"
import cities from "./cities.json"

export const NearbyCityPicker: React.FC = () => {
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const cityNames = cities.map((city) => city.name.toLowerCase())

  const onSelect = (city: string) => {
    console.log("selected city", city)
    setSelectedCity(city)
  }

  return !!selectedCity ? (
    <>
      <Text>{selectedCity}</Text>
      <Button onPress={() => setSelectedCity(null)}>Change</Button>
    </>
  ) : (
    <>
      <Text>Select a city to see nearby shows and fairs</Text>
      <Input
        onChangeText={(text) => {
          if (text.length > 2) {
            const matchingCities = cityNames.filter((city) => city.includes(text.toLowerCase()))
            setFilteredCities(matchingCities)
            console.log(matchingCities)
          } else {
            setFilteredCities([])
          }
        }}
      />
      <FlatList
        data={filteredCities}
        renderItem={({ item }) => {
          console.log("item", item)
          return (
            <TouchableRow onPress={() => onSelect(item)}>
              <Text>{item}</Text>
            </TouchableRow>
          )
        }}
      />
    </>
  )
}
