import Clipboard from "@react-native-community/clipboard"
import { useToast } from "lib/Components/Toast/toastHook"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { color, Flex, FlexProps, Text, Touchable } from "palette"
import React from "react"

export const QAInfoFlex: React.FC<FlexProps> = (props) => {
  const enabled = useFeatureFlag("ARShowQuickAccessInfo")
  if (!enabled) {
    return null
  }

  return <Flex borderColor="purple100" borderWidth={1} {...props} />
}

export const QAInfoRow: React.FC<{ i: { [key: string]: string } }> = ({ i }) => {
  const toast = useToast()

  const key = Object.keys(i)[0]
  const value = i[key]

  return (
    <Flex flexDirection="row">
      <Text>{key}: </Text>
      <Touchable
        underlayColor={color("black5")}
        haptic
        onPress={() => {
          Clipboard.setString(value)
          toast.show("Copied", "middle")
        }}
      >
        <Text>{value}</Text>
      </Touchable>
    </Flex>
  )
}
