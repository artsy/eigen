import { color, Flex, Theme } from "@artsy/palette"
import ScrollableTabBar, { ScrollableTab } from "lib/Components/ScrollableTabBar"
import { Schema, screenTrack } from "lib/utils/track"
import React, { Component } from "react"
import ScrollableTabView from "react-native-scrollable-tab-view"

import { NativeModules, View } from "react-native"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"
import { BucketResults } from "../Map/bucketCityResults"
import { EventEmitter } from "../Map/EventEmitter"
import { MapTab } from "../Map/types"
import { cityTabs } from "./cityTabs"
import { AllEvents } from "./Components/AllEvents"
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
}
const AllCityMetaTab = 0

const screenSchemaForCurrentTabState = currentSelectedTab => {
  switch (currentSelectedTab) {
    case "all":
      return Schema.PageNames.CityGuideAllGuide
    case "saved":
      return Schema.PageNames.CityGuideSavedGuide
    case "fairs":
      return Schema.PageNames.CityGuideFairsGuide
    case "galleries":
      return Schema.PageNames.CityGuideGalleriesGuide
    case "museums":
      return Schema.PageNames.CityGuideMuseumsGuide
    default:
      return null
  }
}

@screenTrack<Props>(props => ({
  context_screen: screenSchemaForCurrentTabState("all"),
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
    this.setState({
      buckets,
      filter,
      cityName,
      citySlug,
      relay,
      sponsoredContent,
    })
  }

  componentWillMount() {
    EventEmitter.subscribe("map:change", this.handleEvent)
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe("map:change", this.handleEvent)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isDrawerOpen !== nextProps.isDrawerOpen) {
      this.fireScreenViewAnalytics()
    }
  }

  componentDidUpdate() {
    if (this.state.buckets) {
      // We have the Relay response; post a notification so that the ARMapContainerViewController can finalize the native UI.
      NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryQueryResponseReceived", {})
    }
  }

  setSelectedTab(selectedTab) {
    // Delay applying filters would slow down animations as it's running on the
    // expensive task running on the main thread
    setTimeout(() => {
      this.setState({ selectedTab: selectedTab.i }, this.fireScreenViewAnalytics)
      EventEmitter.dispatch("filters:change", selectedTab.i)
    }, 500)
  }

  fireScreenViewAnalytics = () => {
    this.props.tracking.trackEvent({
      context_screen: screenSchemaForCurrentTabState(this.state.filter.id),
      context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
      context_screen_owner_slug: this.state.citySlug,
      context_screen_owner_id: this.state.citySlug,
    })
  }

  render() {
    const { buckets, cityName, citySlug } = this.state
    const { verticalMargin } = this.props
    // bottomInset is used for the ScrollView's contentInset. See the note in ARMapContainerViewController.m for context.
    const bottomInset = this.scrollViewVerticalStart + (verticalMargin || 0)

    return (
      buckets && (
        <Theme>
          <>
            <Flex style={{ flex: 1 }}>
              <Flex py={1} alignItems="center">
                <Handle />
              </Flex>
              <ScrollableTabView
                initialPage={this.props.initialTab || AllCityMetaTab}
                onChangeTab={selectedTab => this.setSelectedTab(selectedTab)}
                prerenderingSiblingsNumber={2}
                renderTabBar={props => (
                  <View>
                    <ScrollableTabBar {...props} />
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
            </Flex>
          </>
        </Theme>
      )
    )
  }
}

const Handle = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${color("black30")};
`
