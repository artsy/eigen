import React from "react"


import { Input } from "lib/Components/Input/Input"
import { Text } from "palette"

interface Props {
  onChange: any
}

export const LocationAutocomplete: React.FC<Props> = ({ onChange, ...props }) => {
  const inputChange = (str: string) => {
    // FETCH FROM GMAPS
    onChange(str)
  }
  return (
    <>
      <Text>Location</Text>
      <Input placeholder="Add Location" style={{marginVertical: 10}} onChangeText={inputChange} />
      <Text color="black60">Sharing your location with galleries helps them provide fast and accurate shipping quotes. You can always edit this information later in your Collector Profile.</Text>
    </>
  )
}
