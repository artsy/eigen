import { Flex } from "lib/Components/Bidding/Elements/Flex"
import { Text, useColor } from "palette"
import React from "react"
import { View } from "react-native"

export const RadioButton: React.FC<{ selected: boolean; text: string }> = (props) => {
  const color = useColor()
  const { selected, text } = props
  return (
    <Flex flexDirection="row">
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: selected ? color("black100") : color("black10"),
          backgroundColor: selected ? color("black100") : color("white100"),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: color("white100"),
            }}
          />
        ) : null}
      </View>
      {!!text && <Text style={{ marginLeft: 5 }}>{text}</Text>}
    </Flex>
  )
}
