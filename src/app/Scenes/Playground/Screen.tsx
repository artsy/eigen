import { Separator, Spacer, Text } from "@artsy/palette-mobile"
import { Input } from "app/Components/Input2"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { useState } from "react"
import { Alert, ScrollView } from "react-native"

export const Screen: React.FC<{}> = () => {
  const [value1, setValue1] = useState("test")
  const [value2, setValue2] = useState("")
  const [value3, setValue3] = useState("a value")
  const [value4, setValue4] = useState("value 4")
  const [selectedValue, setSelectedValue] = useState<null | string>(null)

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Spacer y={2} />

      <CategoryPicker<string>
        value={selectedValue}
        // value={artworkMediumCategories[0].value}
        options={artworkMediumCategories}
        handleChange={(value) => {
          setSelectedValue(value)

          // do nothing
        }}
      />

      <Spacer y={2} />

      <CategoryPicker<string>
        value={undefined}
        options={artworkMediumCategories}
        handleChange={() => {
          // do nothing
        }}
      />

      <Spacer y={2} />

      <Text variant="sm-display" mb={2}>
        Default Input with no error
      </Text>
      <Input
        value={value1}
        onChangeText={setValue1}
        label="Label"
        // enableClearButton
        multiline
        // fixedRightPlaceholder="cm"
      />
      <Separator my={2} />
      <Text variant="sm-display" mb={2}>
        Default Input with short label
      </Text>
      <Input value={value2} onChangeText={setValue2} label="Label" unit="USD" />
      <Separator my={2} />
      <Text variant="sm-display" mb={2}>
        Default Input with long label
      </Text>
      <Input
        value={value4}
        onChangeText={setValue4}
        label="This is an input with a really really really long label"
        error="Input Value Error Message/Reason"
      />
      <Separator my={2} />
      <Text variant="sm-display" mb={2}>
        Default Input without label
      </Text>
      <Input
        value={value3}
        onChangeText={setValue3}
        label="Short label"
        error="This is a very long error input that  need be displayed in just one line"
      />
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
