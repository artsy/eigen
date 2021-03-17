import Clipboard from "@react-native-community/clipboard"
import { useToast } from "lib/Components/Toast/toastHook"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { color, Flex, FlexProps, Text, Touchable } from "palette"
import React from "react"

export const QAInfoPanel: React.FC<Omit<FlexProps, "children"> & { info: Array<[string, string]> }> = (props) => {
  const enabled = useFeatureFlag("ARShowQuickAccessInfo")
  if (!enabled) {
    return null
  }

  return (
    <QAInfoManualPanel {...props}>
      {props.info.map(([key, value]) => (
        <QAInfoRow key={key} i={{ [key]: value }} />
      ))}
    </QAInfoManualPanel>
  )
}

export const QAInfoManualPanel: React.FC<FlexProps> = (props) => {
  const enabled = useFeatureFlag("ARShowQuickAccessInfo")
  if (!enabled) {
    return null
  }

  return <Flex borderColor="purple100" borderWidth={1} {...props} />
}

export const QAInfoRow: React.FC<{ key: string; value: string }> = ({ key, value }) => {
  const toast = useToast()

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
        <Text fontWeight="bold">{value}</Text>
      </Touchable>
    </Flex>
  )
}
