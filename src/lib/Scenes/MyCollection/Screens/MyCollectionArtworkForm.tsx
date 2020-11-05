import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Button, Flex } from "palette"
import React from "react"

export const MyCollectionArtworkForm: React.FC<StackScreenProps<any>> = ({ navigation, route }) => {
  return (
    <Flex>
      <FancyModalHeader>Form {(route.params as any).mode}</FancyModalHeader>
      <Button
        onPress={() => {
          navigation.navigate("ArtworkDetailsForm")
        }}
      >
        Additional details
      </Button>
      <Button>{(route.params as any).mode === "add" ? "Submit" : "Update"}</Button>
    </Flex>
  )
}
