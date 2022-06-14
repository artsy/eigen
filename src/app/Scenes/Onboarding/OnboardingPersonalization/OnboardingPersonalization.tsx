import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { OnboardingPersonalization_highlights$data } from "__generated__/OnboardingPersonalization_highlights.graphql"
import { OnboardingPersonalizationListQuery } from "__generated__/OnboardingPersonalizationListQuery.graphql"
import {
  ArtistListItemContainer as ArtistListItem,
  ArtistListItemPlaceholder,
} from "app/Components/ArtistListItem"
import SearchIcon from "app/Icons/SearchIcon"
import { GlobalStore } from "app/store/GlobalStore"
import { requestPushNotificationsPermission } from "app/utils/PushNotification"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { compact, times } from "lodash"
import { Box, Button, Flex, Join, Spacer, Text, Touchable, useColor, useSpace } from "palette"
import { INPUT_HEIGHT } from "palette/elements/Input/Input"
import React from "react"
import { FlatList, ScrollView, TouchableWithoutFeedback } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
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
  extends StackScreenProps<
    OnboardingPersonalizationNavigationStack,
    "OnboardingPersonalizationList"
  > {}

interface OnboardingPersonalizationListProps extends OnboardingPersonalizationListNavigationProps {
  highlights: OnboardingPersonalization_highlights$data
}

const OnboardingPersonalizationListHeader = ({
  navigateToModal,
}: {
  navigateToModal: () => void
}) => {
  const color = useColor()
  return (
    <>
      <Touchable haptic="impactLight" onPress={handleFinishOnboardingPersonalization}>
        <Flex height={20} alignItems="flex-end" justifyContent="center" px={2}>
          <Text textAlign="right" variant="xs">
            Skip
          </Text>
        </Flex>
      </Touchable>
      <Box px={2} mt={2}>
        <Text variant="lg">What Artists do You Collect?</Text>
        <Spacer mt={0.5} />
        <Text variant="xs" color={color("black100")}>
          Follow at least three artists you’re looking to collect or track so we can personalize
          your experience.
        </Text>
      </Box>
      <Spacer mt={2} />

      {/* Fake search Input */}
      <Flex px={2}>
        <TouchableWithoutFeedback onPress={navigateToModal} testID="searchArtistButton">
          <Flex
            flexDirection="row"
            borderWidth={1}
            borderColor={color("black60")}
            height={INPUT_HEIGHT}
          >
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
}

export const OnboardingPersonalizationList: React.FC<OnboardingPersonalizationListProps> = ({
  ...props
}) => {
  const space = useSpace()
  const popularArtists = compact(props.highlights.popularArtists)

  return (
    <SafeAreaView style={{ backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 60,
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
            <ArtistListItem
              artist={artist}
              withFeedback
              containerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
              disableNavigation
            />
          )}
          keyExtractor={(artist) => artist.internalID}
          contentContainerStyle={{ paddingVertical: space(2) }}
        />
      </ScrollView>
      <Flex p={2} position="absolute" bottom={0} backgroundColor="white">
        <Button
          variant="fillDark"
          block
          testID="doneButton"
          onPress={handleFinishOnboardingPersonalization}
        >
          Done
        </Button>
      </Flex>
    </SafeAreaView>
  )
}

const handleFinishOnboardingPersonalization = async () => {
  GlobalStore.actions.auth.setState({ onboardingState: "complete" })
  requestPushNotificationsPermission()
}

export const OnboardingPersonalizationListRefetchContainer = createFragmentContainer(
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
  }
)

const OnboardingPersonalizationListQueryRenderer: React.FC<
  OnboardingPersonalizationListNavigationProps
> = (props) => (
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
