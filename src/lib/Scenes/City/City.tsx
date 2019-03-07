import { Box, color, Flex, Theme } from "@artsy/palette"
import ScrollableTabBar, { ScrollableTab } from "lib/Components/ScrollableTabBar"
import React, { Component } from "react"
import ScrollableTabView from "react-native-scrollable-tab-view"

import { NativeModules, ScrollView } from "react-native"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"

import TabBar, { Tab } from "lib/Components/TabBar"
import { BucketKey, BucketResults } from "../Map/Bucket"
import { FiltersBar } from "../Map/Components/FiltersBar"
import { EventEmitter } from "../Map/EventEmitter"
import { MapTab } from "../Map/types"
import { AllEvents } from "./Components/AllEvents"
import { CityTab } from "./Components/CityTab"

interface Props {
  verticalMargin?: number
  isDrawerOpen?: boolean
  initialTab?: number
}

interface State {
  buckets?: BucketResults
  filter: MapTab
  relay: RelayProp
  cityName: string

  selectedTab: number
  sponsoredContent: { introText: string; artGuideUrl: string }
}

const AllCityMetaTab = 0
export class CityView extends Component<Props, State> {
  state = {
    buckets: null,
    filter: { id: "all", text: "All events" },
    relay: null,
    cityName: "",
    selectedTab: AllCityMetaTab,
    sponsoredContent: null,
  }

  tabView?: ScrollableTabView | any

  scrollViewVerticalStart = 0
  scrollView: ScrollView = null

  filters: MapTab[] = [
    { id: "all", text: "All" },
    { id: "saved", text: "Saved" },
    { id: "fairs", text: "Fairs" },
    { id: "galleries", text: "Galleries" },
    { id: "museums", text: "Museums" },
  ]

  componentWillMount() {
    console.log("subscribing")
    EventEmitter.subscribe(
      "map:change",
      ({
        filter,
        buckets,
        cityName,
        relay,
        sponsoredContent,
      }: {
        filter: MapTab
        buckets: BucketResults
        cityName: string
        relay: RelayProp
        sponsoredContent: { introText: string; artGuideUrl: string }
      }) => {
        this.setState({
          buckets,
          filter,
          cityName,
          relay,
          sponsoredContent,
        })
      }
    )
  }

  componentDidUpdate() {
    const scrollview = this.tabView._scrollView
    if (!this.props.isDrawerOpen && scrollview) {
      scrollview.scrollTo({ x: 0, y: 0, animated: true })
    }

    if (this.state.buckets) {
      // We have the Relay response; post a notification so that the ARMapContainerViewController can finalize the native UI.
      NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryQueryResponseReceived", {})
    }
  }

  setSelectedTab(selectedTab) {
    // this.setState({ selectedTab: selectedTab.i }, this.fireCityTabViewAnalytics)
    console.log(selectedTab.i)

    EventEmitter.dispatch("filters:change", selectedTab.i)
  }

  fireCityTabViewAnalytics = () => {
    console.log("Post")
    // this.props.tracking.trackEvent({
    //   context_screen: screenSchemaForCurrentTab(this.state.selectedTab),
    //   context_screen_owner_type: null,
    // })
  }

  render() {
    const { buckets, filter, cityName } = this.state
    const { isDrawerOpen, verticalMargin } = this.props
    // bottomInset is used for the ScrollView's contentInset. See the note in ARMapContainerViewController.m for context.
    const bottomInset = this.scrollViewVerticalStart + (verticalMargin || 0)
    const scrollview = this.tabView._scrollView

    return (
      buckets && (
        <Theme>
          <Flex py={1} alignItems="center" style={{ flex: 1 }}>
            <Handle />
            <ScrollableTabView
              initialPage={this.props.initialTab || AllCityMetaTab}
              ref={tabView => (this.tabView = tabView)}
              onChangeTab={selectedTab => this.setSelectedTab(selectedTab)}
              renderTabBar={props => (
                <>
                  <TabBar {...props} />
                </>
              )}
            >
              <ScrollableTab tabLabel="All">
                <AllEvents
                  cityName={cityName}
                  key={cityName}
                  currentBucket={filter.id as BucketKey}
                  sponsoredContent={this.state.sponsoredContent}
                  buckets={buckets}
                  relay={this.state.relay}
                />
              </ScrollableTab>

              {this.filters.filter(f => f.id !== "all").map(f => {
                return (
                  <ScrollableTab tabLabel={f.text}>
                    <CityTab
                      key={cityName + filter.id}
                      bucket={buckets[filter.id]}
                      type={filter.text}
                      cityName={cityName}
                      relay={this.state.relay}
                    />
                  </ScrollableTab>
                )
              })}
            </ScrollableTabView>
          </Flex>
        </Theme>
      )
    )
  }
}

// <ScrollView
//   contentInset={{ bottom: bottomInset }}
//   onLayout={layout => (this.scrollViewVerticalStart = layout.nativeEvent.layout.y)}
//   scrollEnabled={isDrawerOpen}
//   ref={r => {
//     if (r) {
//       this.scrollView = r as any
//     }
//   }}
// >

// </ScrollView>

const Handle = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${color("black30")};
`

// <FiltersBar
//   tabs={this.filters}
//   goToPage={activeIndex => EventEmitter.dispatch("filters:change", activeIndex)}
// />
// <ScrollView
//   contentInset={{ bottom: bottomInset }}
//   onLayout={layout => (this.scrollViewVerticalStart = layout.nativeEvent.layout.y)}
//   scrollEnabled={isDrawerOpen}
//   ref={r => {
//     if (r) {
//       this.scrollView = r as any
//     }
//   }}
// >
//   {(() => {
//     switch (filter && filter.id) {
//       case "all":
//         return (
//           <AllEvents
//             cityName={cityName}
//             key={cityName}
//             currentBucket={filter.id as BucketKey}
//             buckets={buckets}
//           />
//         )
//       default:
//         return (
//           <CityTab
//             key={cityName + filter.id}
//             bucket={buckets[filter.id]}
//             type={filter.text}
//             relay={this.state.relay}
//           />
//         )
//     }
//   })()}
// </ScrollView>
