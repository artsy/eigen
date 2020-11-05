import { Button } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"

export const AdditionalDetailsForm: React.FC<{ navigator: NavigatorIOS }> = ({ navigator }) => {
  return (
    <Button
      onPress={() => {
        navigator.pop()
      }}
      mt="2"
    >
      back
    </Button>
  )
}
