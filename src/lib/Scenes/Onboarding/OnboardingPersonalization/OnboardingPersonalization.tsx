import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { OnboardingPersonalization_popularArtists } from "__generated__/OnboardingPersonalization_popularArtists.graphql"
import { OnboardingPersonalizationListQuery } from "__generated__/OnboardingPersonalizationListQuery.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { INPUT_HEIGHT } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, color, Flex, space, Spacer, Text } from "palette"
import React from "react"
import { FlatList, ScrollView, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { defaultEnvironment } from "../../../relay/createEnvironment"
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
        <StackNavigator.Screen
          name="OnboardingPersonalizationList"
          component={OnboardingPersonalizationListQueryRenderer}
        />
        <StackNavigator.Screen name="OnboardingPersonalizationModal" component={OnboardingPersonalizationModal} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}

interface OnboardingPersonalizationListProps {
  popularArtists: OnboardingPersonalization_popularArtists
}

export const OnboardingPersonalizationList: React.FC<OnboardingPersonalizationListProps> = ({ ...props }) => {
  const navigation = useNavigation()
  console.log(props)

  return (
    <Flex backgroundColor="white" flexGrow={1}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: useScreenDimensions().safeAreaInsets.top,
          justifyContent: "flex-start",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Spacer mt={60} />
        <Box px={2}>
          <Text variant="largeTitle">What artists do you collect?</Text>
          <>
            <Spacer mt={1.5} />
            <Text variant="caption" color={color("black60")}>
              Follow at least three artists you’re looking to collect so we can start to understand your taste.
            </Text>
          </>
        </Box>
        <Spacer mt={20} />

        {/* Fake search Input */}
        <Flex px={2}>
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
        </Flex>

        <FlatList
          data={props.popularArtists}
          renderItem={({ item }) => (
            <ArtistListItem
              artist={item}
              withFeedback
              containerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
            />
          )}
          contentContainerStyle={{ paddingVertical: space(2) }}
        />
      </ScrollView>
    </Flex>
  )
}

const OnboardingPersonalizationListFragmentContainer = createFragmentContainer(OnboardingPersonalizationList, {
  popularArtists: graphql`
    fragment OnboardingPersonalization_popularArtists on Artist @relay(plural: true) {
      id
      ...ArtistListItem_artist
    }
  `,
})

const OnboardingPersonalizationListQueryRenderer = () => (
  <QueryRenderer<OnboardingPersonalizationListQuery>
    environment={defaultEnvironment}
    query={graphql`
      query OnboardingPersonalizationListQuery {
        highlights {
          popularArtists(excludeFollowedArtists: true) {
            ...OnboardingPersonalization_popularArtists
          }
        }
      }
    `}
    variables={{}}
    render={({ props }) => {
      if (props?.highlights?.popularArtists) {
        return <OnboardingPersonalizationListFragmentContainer popularArtists={props.highlights.popularArtists} />
      } else {
        return null
      }
    }}
  />
)
