import { Box, color, Flex, Theme } from "@artsy/palette"
import React, { Component } from "react"
import { NativeModules, ScrollView } from "react-native"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"
import { BucketKey, BucketResults } from "../Map/Bucket"
import { FiltersBar } from "../Map/Components/FiltersBar"
import { EventEmitter } from "../Map/EventEmitter"
import { MapTab as Tab } from "../Map/types"
import { AllEvents } from "./Components/AllEvents"
import { CityTab } from "./Components/CityTab"

interface Props {
  verticalMargin?: number
  isDrawerOpen?: boolean
}

interface State {
  buckets?: BucketResults
  filter: Tab
  relay: RelayProp
  cityName: string
}

export class CityView extends Component<Props, State> {
  state = {
    buckets: null,
    filter: { id: "all", text: "All events" },
    relay: null,
    cityName: "",
  }
  scrollViewVerticalStart = 0
  scrollView: ScrollView = null

  filters: Tab[] = [
    { id: "all", text: "All" },
    { id: "saved", text: "Saved" },
    { id: "fairs", text: "Fairs" },
    { id: "galleries", text: "Galleries" },
    { id: "museums", text: "Museums" },
  ]

  componentWillMount() {
    EventEmitter.subscribe(
      "map:change",
      ({
        filter,
        buckets,
        cityName,
        relay,
      }: {
        filter: Tab
        buckets: BucketResults
        cityName: string
        relay: RelayProp
      }) => {
        this.setState({
          buckets,
          filter,
          cityName,
          relay,
        })
      }
    )
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

  render() {
    const { buckets, filter, cityName } = this.state
    const { isDrawerOpen, verticalMargin } = this.props
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
                tabs={this.filters}
                goToPage={activeIndex => EventEmitter.dispatch("filters:change", activeIndex)}
              />
              <ScrollView
                contentInset={{ bottom: bottomInset }}
                onLayout={layout => (this.scrollViewVerticalStart = layout.nativeEvent.layout.y)}
                scrollEnabled={isDrawerOpen}
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
                          key={cityName}
                          currentBucket={filter.id as BucketKey}
                          buckets={buckets}
                          relay={this.state.relay}
                        />
                      )
                    default:
                      return (
                        <CityTab
                          key={cityName + filter.id}
                          bucket={buckets[filter.id]}
                          type={filter.text}
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
