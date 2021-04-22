import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { INPUT_HEIGHT } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { OnboardingPersonalizationModal } from "./OnboardingPersonalizationModal"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingPersonalizationNavigationStack = {
  OnboardingPersonalizationList: undefined
  OnboardingPersonalizationModal: undefined
}

const StackNavigator = createStackNavigator<OnboardingPersonalizationNavigationStack>()

export const OnboardingPersonalization = () => {
  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        headerMode="screen"
        screenOptions={{
          ...TransitionPresets.ModalTransition,
          headerShown: false,
        }}
      >
        <StackNavigator.Screen name="OnboardingPersonalizationList" component={OnboardingPersonalizationList} />
        <StackNavigator.Screen name="OnboardingPersonalizationModal" component={OnboardingPersonalizationModal} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}

interface OnboardingPersonalizationListProps
  extends StackScreenProps<OnboardingPersonalizationNavigationStack, "OnboardingPersonalizationList"> {}

export const OnboardingPersonalizationList: React.FC<OnboardingPersonalizationListProps> = ({ navigation }) => {
  return (
    <Flex backgroundColor="white" flexGrow={1}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: useScreenDimensions().safeAreaInsets.top,
          justifyContent: "flex-start",
        }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        // keyboardShouldPersistTaps="always" // TODO: Revert
      >
        <Spacer mt={60} />
        <Box>
          <Text variant="largeTitle">What artists do you collect?</Text>
          <>
            <Spacer mt={1.5} />
            <Text variant="caption" color={color("black60")}>
              Follow at least three artists you’re looking to collect so we can start to understand your taste.
            </Text>
          </>
        </Box>
        <Spacer mt={20} />
        <TouchableWithoutFeedback
          onPressIn={() => {
            navigation.navigate("OnboardingPersonalizationModal")
          }}
        >
          <Flex flexDirection="row" borderWidth={1} borderColor={color("black10")} height={INPUT_HEIGHT}>
            <Flex pl="1" justifyContent="center" flexGrow={0}>
              <SearchIcon width={18} height={18} />
            </Flex>
            <Flex flexGrow={1} justifyContent="center" pl={1}>
              <Text color={color("black60")} fontSize={15}>
                Search artists
              </Text>
            </Flex>
          </Flex>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Flex>
  )
}
