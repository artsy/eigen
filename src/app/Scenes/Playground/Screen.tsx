import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { Input } from "app/Components/Input2"
import { useState } from "react"

export const Screen: React.FC<{}> = () => {
  const [value1, setValue1] = useState("Random Value")
  const [value2, setValue2] = useState("")

  return (
    <Flex px={2}>
      <Text variant="lg-display" mb={2}>
        Title
      </Text>
      <Input value={value1} onChangeText={setValue1} />

      <Spacer y={2} />

      <Input value={value2} onChangeText={setValue2} isFocused />
    </Flex>
  )
}
