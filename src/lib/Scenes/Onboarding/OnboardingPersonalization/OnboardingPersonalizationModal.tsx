import { StackScreenProps } from "@react-navigation/stack"
import { SearchInput } from "lib/Components/SearchInput"
import { BackButton } from "lib/navigation/BackButton"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { OnboardingPersonalizationNavigationStack } from "./OnboardingPersonalization"

interface OnboardingPersonalizationModalProps
  extends StackScreenProps<OnboardingPersonalizationNavigationStack, "OnboardingPersonalizationModal"> {}

export const OnboardingPersonalizationModal: React.FC<OnboardingPersonalizationModalProps> = ({ navigation }) => {
  return (
    <Flex style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top + 60, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <BackButton onPress={() => navigation.goBack()} showCloseIcon />
        <SearchInput
          placeholder="Search artists"
          onChangeText={() => {
            // do nothing
          }}
        />
      </ScrollView>
    </Flex>
  )
}
