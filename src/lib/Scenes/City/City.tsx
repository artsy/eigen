import { Box, color, Flex, Sans, Theme } from "@artsy/palette"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import { ScrollableTab } from "lib/Components/ScrollableTabBar"
import { Schema, screenTrack, track } from "lib/utils/track"
import React, { Component } from "react"
import { NativeModules, View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"
import { BucketResults } from "../Map/bucketCityResults"
import { EventEmitter } from "../Map/EventEmitter"
import { MapTab, RelayErrorState } from "../Map/types"
import { cityTabs } from "./cityTabs"
import { AllEvents } from "./Components/AllEvents"
import CityTabBar from "./Components/CityTabBar"
import { EventList } from "./Components/EventList"

interface Props {
  verticalMargin?: number
  isDrawerOpen?: boolean
  initialTab?: number
  citySlug: string
  tracking: any
}

interface State {
  buckets?: BucketResults
  filter: MapTab // Used for analytics
  relay: RelayProp
  cityName: string
  citySlug: string
  selectedTab: number
  sponsoredContent: { introText: string; artGuideUrl: string }
  relayErrorState?: RelayErrorState
}
const AllCityMetaTab = 0

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.CityGuide,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.citySlug,
  context_screen_owner_id: props.citySlug,
}))
export class CityView extends Component<Props, State> {
  state = {
    buckets: null,
    filter: cityTabs[0],
    relay: null,
    cityName: "",
    selectedTab: AllCityMetaTab,
    citySlug: "",
    sponsoredContent: null,
    relayErrorState: null,
  }

  scrollViewVerticalStart = 0

  handleEvent = ({
    filter,
    buckets,
    cityName,
    citySlug,
    relay,
    sponsoredContent,
  }: {
    filter: MapTab
    buckets: BucketResults
    cityName: string
    relay: RelayProp
    citySlug: string
    sponsoredContent: { introText: string; artGuideUrl: string }
  }) => {
    // We have the Relay response; post a notification so that the ARMapContainerViewController can finalize the native UI (ie: show the drawer partially).
    this.setState(
      {
        buckets,
        filter,
        cityName,
        citySlug,
        relay,
        sponsoredContent,
      },
      () => {
        NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryQueryResponseReceived", {})
      }
    )
  }

  handleError = ({ relayErrorState }: { relayErrorState: RelayErrorState }) => {
    // We have a Relay error; post a notification so that the ARMapContainerViewController can finalize the native UI (ie: show the drawer partially).
    this.setState({ relayErrorState }, () => {
      NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryQueryResponseReceived", {})
    })
  }

  componentWillMount() {
    EventEmitter.subscribe("map:change", this.handleEvent)
    EventEmitter.subscribe("map:error", this.handleError)
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe("map:change", this.handleEvent)
    EventEmitter.unsubscribe("map:error", this.handleError)
  }

  setSelectedTab(selectedTab) {
    this.setState({ selectedTab: selectedTab.i })
    EventEmitter.dispatch("filters:change", selectedTab.i)
  }

  @track((__, _, args) => {
    const filter = args[0]
    let actionName
    switch (filter) {
      case "all":
        actionName = Schema.ActionNames.AllTab
        break
      case "saved":
        actionName = Schema.ActionNames.SavedTab
        break
      case "fairs":
        actionName = Schema.ActionNames.FairsTab
        break
      case "galleries":
        actionName = Schema.ActionNames.GalleriesTab
        break
      case "museums":
        actionName = Schema.ActionNames.MuseumsTab
        break
      default:
        actionName = null
        break
    }
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
    } as any
  })
  trackTab(_filter) {
    return null
  }

  componentDidUpdate(_, prevState) {
    if (prevState.filter.id !== this.state.filter.id) {
      this.trackTab(this.state.filter.id)
    }
  }

  render() {
    const { buckets, cityName, citySlug, relayErrorState } = this.state
    const { verticalMargin } = this.props
    // bottomInset is used for the ScrollView's contentInset. See the note in ARMapContainerViewController.m for context.
    const bottomInset = this.scrollViewVerticalStart + (verticalMargin || 0)

    return buckets || relayErrorState ? (
      <Theme>
        <Flex style={{ flex: 1 }}>
          <Flex py={1} alignItems="center">
            <Handle />
          </Flex>
          {relayErrorState ? (
            <ErrorScreen relayErrorState={relayErrorState} key="error" />
          ) : (
            <ScrollableTabView
              initialPage={this.props.initialTab || AllCityMetaTab}
              onChangeTab={selectedTab => this.setSelectedTab(selectedTab)}
              prerenderingSiblingsNumber={2}
              renderTabBar={props => (
                <View>
                  <CityTabBar {...props} spaceEvenly={false} />
                </View>
              )}
              onLayout={layout => (this.scrollViewVerticalStart = layout.nativeEvent.layout.y)}
              // These are the ScrollView props for inside the scrollable tab view
              contentProps={{
                contentInset: { bottom: bottomInset },
                onLayout: layout => {
                  this.scrollViewVerticalStart = layout.nativeEvent.layout.y
                  NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryCityGotScrollView", {})
                },
              }}
            >
              <ScrollableTab tabLabel="All" key="all">
                <AllEvents
                  cityName={cityName}
                  citySlug={citySlug}
                  key={cityName}
                  sponsoredContent={this.state.sponsoredContent}
                  buckets={buckets}
                  relay={this.state.relay}
                />
              </ScrollableTab>

              {cityTabs.filter(tab => tab.id !== "all").map(tab => {
                return (
                  <ScrollableTab tabLabel={tab.text} key={tab.id}>
                    <EventList
                      key={cityName + tab.id}
                      bucket={buckets[tab.id]}
                      type={tab.id}
                      cityName={cityName}
                      relay={this.state.relay}
                    />
                  </ScrollableTab>
                )
              })}
            </ScrollableTabView>
          )}
        </Flex>
      </Theme>
    ) : null
  }
}

const Handle = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${color("black30")};
`

const ErrorScreen: React.SFC<{ relayErrorState: RelayErrorState }> = ({ relayErrorState: { retry, isRetrying } }) => {
  return (
    <Box py={2}>
      <Sans size="3t" textAlign="center" mx={2}>
        We are having trouble loading content right now, please try again later.
      </Sans>
      <Flex justifyContent="center" flexDirection="row">
        <Box width={69} height={34} mt={2}>
          <InvertedButton text="Retry" onPress={retry} inProgress={isRetrying} />
        </Box>
      </Flex>
    </Box>
  )
}
