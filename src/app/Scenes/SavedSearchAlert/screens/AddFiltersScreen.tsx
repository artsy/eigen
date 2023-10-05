import { Flex, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Alert, TouchableOpacity } from "react-native"

export const AddFiltersScreen: React.FC<{}> = () => {
  const navigation = useNavigation()
  return (
    <Flex>
      <FancyModalHeader
        hideBottomDivider
        onLeftButtonPress={navigation.goBack}
        renderRightButton={ClearAllButton}
        // rightButtonText="Clear All"
        // TODO: Improve fancy modal header logic not to rely on this prop
        // in case renderRightButton is present
        onRightButtonPress={() => {}}
      >
        Filters
      </FancyModalHeader>
    </Flex>
  )
}

export const ClearAllButton = () => {
  const disabled = false

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        Alert.alert("Are you sure you want to clear all filters?", undefined, [
          {
            text: "Cancel",
            onPress() {
              // Do nothing
            },
          },

          {
            text: "Clear All",
            onPress() {
              // Trigger action to clear all filters
            },
            style: "destructive",
          },
        ])
      }}
    >
      <Text underline color={disabled ? "black30" : "black100"}>
        Clear All
      </Text>
    </TouchableOpacity>
  )
}
