import { NavigationProp } from "@react-navigation/native"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Flex } from "palette"
import React from "react"

export const MyCollectionAdditionalDetailsForm: React.FC<{ navigation: NavigationProp<any> }> = ({ navigation }) => {
  return (
    <Flex>
      <FancyModalHeader
        onLeftButtonPress={() => {
          navigation.goBack()
        }}
      >
        Form
      </FancyModalHeader>
    </Flex>
  )
}
