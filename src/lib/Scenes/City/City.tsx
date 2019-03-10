import { Box, color, Flex, Theme } from "@artsy/palette"
import { Schema, screenTrack } from "lib/utils/track"
import React, { Component } from "react"
import { NativeModules, ScrollView } from "react-native"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"
import { BucketKey, BucketResults } from "../Map/bucketCityResults"
import { FiltersBar } from "../Map/Components/FiltersBar"
import { EventEmitter } from "../Map/EventEmitter"
import { MapTab } from "../Map/types"
import { cityTabs } from "./cityTabs"
import { AllEvents } from "./Components/AllEvents"
import { EventList } from "./Components/EventList"

interface Props {
  verticalMargin?: number
  isDrawerOpen?: boolean
  citySlug: string
  tracking: any
}

interface State {
  buckets?: BucketResults
  filter: MapTab
  relay: RelayProp
  cityName: string
  citySlug: string
  sponsoredContent: { introText: string; artGuideUrl: string }
}

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
    citySlug: "",
    sponsoredContent: null,
  }
  scrollViewVerticalStart = 0
  scrollView: ScrollView = null

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
    if (!this.props.isDrawerOpen && this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true })
    }

    if (this.state.buckets) {
      // We have the Relay response; post a notification so that the ARMapContainerViewController can finalize the native UI.
      NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryQueryResponseReceived", {})
    }
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
    const { buckets, filter, cityName, citySlug } = this.state
    const { verticalMargin } = this.props
    // bottomInset is used for the ScrollView's contentInset. See the note in ARMapContainerViewController.m for context.
    const bottomInset = this.scrollViewVerticalStart + (verticalMargin || 0)
    return (
      buckets && (
        <Theme>
          <>
            <Box>
              <Flex py={1} alignItems="center">
                <Handle />
              </Flex>
              <FiltersBar
                tabs={cityTabs}
                goToPage={activeIndex => EventEmitter.dispatch("filters:change", activeIndex)}
              />
              <ScrollView
                contentInset={{ bottom: bottomInset }}
                onLayout={layout => {
                  this.scrollViewVerticalStart = layout.nativeEvent.layout.y
                  NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryCityGotScrollView", {})
                }}
                ref={r => {
                  if (r) {
                    this.scrollView = r as any
                  }
                }}
              >
                {(() => {
                  switch (filter && filter.id) {
                    case "all":
                      return (
                        <AllEvents
                          cityName={cityName}
                          citySlug={citySlug}
                          key={cityName}
                          currentBucket={filter.id as BucketKey}
                          buckets={buckets}
                          sponsoredContent={this.state.sponsoredContent}
                          relay={this.state.relay}
                        />
                      )
                    default:
                      return (
                        <EventList
                          key={cityName + filter.id}
                          bucket={buckets[filter.id]}
                          type={filter.id as any}
                          relay={this.state.relay}
                          cityName={cityName}
                        />
                      )
                  }
                })()}
              </ScrollView>
            </Box>
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
