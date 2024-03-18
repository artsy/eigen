import { Separator, Text } from "@artsy/palette-mobile"
import { Input } from "app/Components/Input2"
import { useState } from "react"
import { Alert, ScrollView } from "react-native"

export const Screen: React.FC<{}> = () => {
  const [value1, setValue1] = useState("Random Value")
  const [value2, setValue2] = useState("")

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text variant="sm-display" mb={2}>
        Default Input
      </Text>

      <Input value={value1} onChangeText={setValue1} />

      <Separator my={2} />

      <Text variant="sm-display" mb={2}>
        Focused Input
      </Text>

      <Input value={value2} onChangeText={setValue2} isFocused required />

      <Separator my={2} />

      <Text variant="sm-display" mb={2}>
        Required Default with hint
      </Text>

      <Input
        value={value2}
        onChangeText={setValue2}
        isFocused
        required
        onHintPress={() => {
          Alert.alert("Hint", "This is a hint")
        }}
      />
    </ScrollView>
  )
}
