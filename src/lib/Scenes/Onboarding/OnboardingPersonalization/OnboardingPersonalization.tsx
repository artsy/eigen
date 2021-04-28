import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { OnboardingPersonalization_highlights } from "__generated__/OnboardingPersonalization_highlights.graphql"
import { OnboardingPersonalizationListQuery } from "__generated__/OnboardingPersonalizationListQuery.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { INPUT_HEIGHT } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { compact } from "lodash"
import { Box, color, Flex, space, Spacer, Text } from "palette"
import React, { useState } from "react"
import { FlatList, ScrollView, TouchableWithoutFeedback } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
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
  highlights: OnboardingPersonalization_highlights
  relay: RelayRefetchProp
}

export const OnboardingPersonalizationList: React.FC<OnboardingPersonalizationListProps> = ({ ...props }) => {
  const [excludeArtistIDs, setExcludeArtistIDs] = useState<string[]>([])
  const navigation = useNavigation()

  const updateListOfArtists = (artistID: string) => {
    if (excludeArtistIDs.includes(artistID)) {
      return
    }

    setExcludeArtistIDs(excludeArtistIDs.concat(artistID))
    props.relay.refetch({ excludeArtistIDs })
  }

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
          data={compact(props.highlights.popularArtists)}
          renderItem={({ item: artist }) => (
            <ArtistListItem
              artist={artist}
              withFeedback
              containerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
              onPress={() => {
                updateListOfArtists(artist.internalID)
              }}
            />
          )}
          contentContainerStyle={{ paddingVertical: space(2) }}
        />
      </ScrollView>
    </Flex>
  )
}

const OnboardingPersonalizationListRefetchContainer = createRefetchContainer(
  OnboardingPersonalizationList,
  {
    highlights: graphql`
      fragment OnboardingPersonalization_highlights on Highlights
      @argumentDefinitions(excludeArtistIDs: { type: "[String]" }) {
        popularArtists(excludeFollowedArtists: true, excludeArtistIDs: $excludeArtistIDs) {
          internalID
          ...ArtistListItem_artist
        }
      }
    `,
  },
  graphql`
    query OnboardingPersonalizationListRefetchQuery($excludeArtistIDs: [String]) {
      highlights {
        ...OnboardingPersonalization_highlights @arguments(excludeArtistIDs: $excludeArtistIDs)
      }
    }
  `
)

const OnboardingPersonalizationListQueryRenderer = () => (
  <QueryRenderer<OnboardingPersonalizationListQuery>
    environment={defaultEnvironment}
    query={graphql`
      query OnboardingPersonalizationListQuery {
        highlights {
          ...OnboardingPersonalization_highlights
        }
      }
    `}
    variables={{}}
    render={renderWithLoadProgress(OnboardingPersonalizationListRefetchContainer)}
  />
)
