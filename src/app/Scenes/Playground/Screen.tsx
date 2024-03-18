import { Separator, Text } from "@artsy/palette-mobile"
import { Input } from "app/Components/Input2"
import { useState } from "react"
import { Alert, ScrollView } from "react-native"

export const Screen: React.FC<{}> = () => {
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")
  const [value3, setValue3] = useState("a value")
  const [value4, setValue4] = useState("")

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text variant="sm-display" mb={2}>
        Default Input with short label
      </Text>

      <Input value={value1} onChangeText={setValue1} label="Label" />

      <Separator my={2} />

      <Text variant="sm-display" mb={2}>
        Default Input with long label
      </Text>

      <Input
        value={value4}
        onChangeText={setValue4}
        label="This is an input with a really really really long label"
      />

      <Separator my={2} />

      <Text variant="sm-display" mb={2}>
        Default Input without label
      </Text>

      <Input value={value3} onChangeText={setValue3} label="Short label" />

      <Separator my={2} />

      <Text variant="sm-display" mb={2}>
        Required Input
      </Text>

      <Input value={value2} onChangeText={setValue2} required />

      <Separator my={2} />

      <Text variant="sm-display" mb={2}>
        Required Default with hint
      </Text>

      <Input
        value={value2}
        onChangeText={setValue2}
        required
        onHintPress={() => {
          Alert.alert("Hint", "This is a hint")
        }}
      />
    </ScrollView>
  )
}
