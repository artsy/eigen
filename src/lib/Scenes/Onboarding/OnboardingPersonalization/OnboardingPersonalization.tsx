import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { OnboardingPersonalization_highlights } from "__generated__/OnboardingPersonalization_highlights.graphql"
import { OnboardingPersonalizationListQuery } from "__generated__/OnboardingPersonalizationListQuery.graphql"
import { ArtistListItemContainer as ArtistListItem, ArtistListItemPlaceholder } from "lib/Components/ArtistListItem"
import { Disappearable } from "lib/Components/Disappearable"
import { INPUT_HEIGHT } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { compact, times } from "lodash"
import { Box, Button, color, Flex, Join, space, Spacer, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { FlatList, ScrollView, TouchableWithoutFeedback } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import { OnboardingPersonalizationModalQueryRenderer } from "./OnboardingPersonalizationModal"

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
        <StackNavigator.Screen
          name="OnboardingPersonalizationModal"
          component={OnboardingPersonalizationModalQueryRenderer}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}

interface OnboardingPersonalizationListNavigationProps
  extends StackScreenProps<OnboardingPersonalizationNavigationStack, "OnboardingPersonalizationList"> {}

interface OnboardingPersonalizationListProps extends OnboardingPersonalizationListNavigationProps {
  highlights: OnboardingPersonalization_highlights
  relay: RelayRefetchProp
}

const OnboardingPersonalizationListHeader = ({ navigateToModal }: { navigateToModal: () => void }) => (
  <>
    <Box px={2}>
      <Text variant="largeTitle">What artists do you collect?</Text>
      <Spacer mt={1.5} />
      <Text variant="caption" color={color("black60")}>
        Follow at least three artists you’re looking to collect or track so we can personalize your experience.
      </Text>
    </Box>
    <Spacer mt={20} />

    {/* Fake search Input */}
    <Flex px={2}>
      <TouchableWithoutFeedback onPress={navigateToModal} testID="searchArtistButton">
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
  </>
)

export const OnboardingPersonalizationList: React.FC<OnboardingPersonalizationListProps> = ({ ...props }) => {
  const popularArtists = compact(props.highlights.popularArtists)
  const animatedOpacitiesRef = useRef<{ [key: string]: Disappearable | null }>({})

  const [excludeArtistIDs, setExcludeArtistIDs] = useState<string[]>([])

  const updateListOfArtists = (artistID: string) => {
    if (excludeArtistIDs.includes(artistID)) {
      return
    }
    setExcludeArtistIDs(excludeArtistIDs.concat(artistID))
  }

  useEffect(() => {
    props.relay.refetch({ excludeArtistIDs })
  }, [excludeArtistIDs])

  const fadeRow = (artistID: string) => {
    animatedOpacitiesRef.current[artistID]?.disappear()
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 60,
          paddingBottom: 80,
          justifyContent: "flex-start",
        }}
      >
        <OnboardingPersonalizationListHeader
          navigateToModal={() => {
            props.navigation.navigate("OnboardingPersonalizationModal")
          }}
        />

        <FlatList
          data={popularArtists}
          initialNumToRender={8}
          renderItem={({ item: artist }) => (
            <Disappearable ref={(ref) => (animatedOpacitiesRef.current[artist.internalID] = ref)} animateScale={false}>
              <ArtistListItem
                artist={artist}
                withFeedback
                containerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                onFollowFinish={() => {
                  updateListOfArtists(artist.internalID)
                  fadeRow(artist.internalID)
                }}
                disableNavigation
              />
            </Disappearable>
          )}
          keyExtractor={(artist) => artist.internalID}
          contentContainerStyle={{ paddingVertical: space(2) }}
        />
      </ScrollView>
      <Flex p={2} position="absolute" bottom={0} backgroundColor="white">
        <Button
          variant="primaryBlack"
          block
          testID="doneButton"
          onPress={() => {
            GlobalStore.actions.auth.setState({ onboardingState: "complete" })
          }}
        >
          Done
        </Button>
      </Flex>
    </SafeAreaView>
  )
}

export const OnboardingPersonalizationListRefetchContainer = createRefetchContainer(
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

const OnboardingPersonalizationListQueryRenderer: React.FC<OnboardingPersonalizationListNavigationProps> = (props) => (
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
    render={renderWithPlaceholder({
      Container: OnboardingPersonalizationListRefetchContainer,
      renderPlaceholder: OnboardingPersonalizationListPlaceholder,
      initialProps: props,
    })}
  />
)

const OnboardingPersonalizationListPlaceholder = ({
  navigation,
}: {
  navigation: OnboardingPersonalizationListNavigationProps["navigation"]
}) => (
  <SafeAreaView
    style={{
      backgroundColor: "white",
      flexGrow: 1,
    }}
  >
    <Spacer height={60} />
    <OnboardingPersonalizationListHeader
      navigateToModal={() => {
        navigation.navigate("OnboardingPersonalizationModal")
      }}
    />
    <Flex px={2} mt={2}>
      <Join separator={<Spacer height={20} />}>
        {times(10).map((index: number) => (
          <Flex key={index}>
            <ArtistListItemPlaceholder />
          </Flex>
        ))}
      </Join>
    </Flex>
  </SafeAreaView>
)
