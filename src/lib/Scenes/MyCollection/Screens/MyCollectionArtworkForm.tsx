import { Button, Flex, Text } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { AdditionalDetailsForm } from "./MyCollectionAdditionalDetailsForm"
import { ArtworkFormMode } from "./MyCollectionArtworkFormModal"

export const MyCollectionArtworkForm: React.FC<{ navigator: NavigatorIOS; mode: ArtworkFormMode }> = ({
  navigator,
  mode,
}) => {
  return (
    <Flex>
      <Text>form</Text>
      <Button
        onPress={() => {
          navigator.push({ component: AdditionalDetailsForm, title: "Additional details form" })
        }}
      >
        Additional details
      </Button>
      <Button>{mode === "add" ? "Submit" : "Update"}</Button>
    </Flex>
  )
}
