import { Flex, Box, Text, Button, Tabs } from "@artsy/palette-mobile"
import { TabsContainer } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import { themeGet } from "@styled-system/theme-get"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { EventEmitter } from "app/Scenes/Map/EventEmitter"
import { BucketResults } from "app/Scenes/Map/bucketCityResults"
import { MapTab, RelayErrorState } from "app/Scenes/Map/types"
import { Schema, screenTrack, track } from "app/utils/track"
import React, { Component } from "react"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"
import { AllEvents } from "./Components/AllEvents"
import { EventList } from "./Components/EventList"
import { cityTabs } from "./cityTabs"

interface Props {
  isDrawerOpen?: boolean
  citySlug: string
  tracking: any
}

interface State {
  buckets?: BucketResults
  filter: MapTab // Used for analytics
  relay: RelayProp
  cityName: string
  citySlug: string
  relayErrorState?: RelayErrorState
}

@screenTrack<Props>((props) => ({
  context_screen: Schema.PageNames.CityGuide,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.citySlug,
  context_screen_owner_id: props.citySlug,
}))
export class CityView extends Component<Props, State> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  state = {
    buckets: null,
    filter: cityTabs[0],
    relay: null,
    cityName: "",
    citySlug: "",
    relayErrorState: null,
  }

  handleEvent = ({
    filter,
    buckets,
    cityName,
    citySlug,
    relay,
  }: {
    filter: MapTab
    buckets: BucketResults
    cityName: string
    relay: RelayProp
    citySlug: string
  }) => {
    // We have the Relay response; post a notification so that the ARMapContainerViewController can finalize the native UI (ie: show the drawer partially).
    this.setState(
      {
        buckets,
        filter,
        cityName,
        citySlug,
        relay,
      },
      () => {
        LegacyNativeModules.ARNotificationsManager.postNotificationName(
          "ARLocalDiscoveryQueryReceived",
          {}
        )
      }
    )
  }

  handleError = ({ relayErrorState }: { relayErrorState: RelayErrorState }) => {
    // We have a Relay error; post a notification so that the ARMapContainerViewController can finalize the native UI (ie: show the drawer partially).
    this.setState({ relayErrorState }, () => {
      LegacyNativeModules.ARNotificationsManager.postNotificationName(
        "ARLocalDiscoveryQueryReceived",
        {}
      )
    })
  }

  UNSAFE_componentWillMount() {
    EventEmitter.subscribe("map:change", this.handleEvent)
    EventEmitter.subscribe("map:error", this.handleError)
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe("map:change", this.handleEvent)
    EventEmitter.unsubscribe("map:error", this.handleError)
  }

  setSelectedTab(index: number) {
    EventEmitter.dispatch("filters:change", index)
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARLocalDiscoveryCityGotScrollView",
      {}
    )
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
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  trackTab(_filter) {
    return null
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  componentDidUpdate(_, prevState) {
    if (prevState.filter.id !== this.state.filter.id) {
      this.trackTab(this.state.filter.id)
    }
  }

  render() {
    const { buckets, cityName, citySlug, relayErrorState } = this.state

    return buckets || relayErrorState ? (
      <Container style={{ flex: 1 }}>
        <Flex py={1} alignItems="center">
          <Handle />
        </Flex>
        {relayErrorState ? (
          <ErrorScreen relayErrorState={relayErrorState} key="error" />
        ) : (
          <TabsContainer
            onTabChange={(tab) => {
              this.setSelectedTab(Number(tab.index))
            }}
          >
            {cityTabs.map((tab) => {
              if (tab.id === "all") {
                return (
                  <Tabs.Tab name={tab.id} label={tab.text} key={tab.id}>
                    <AllEvents
                      cityName={cityName}
                      citySlug={citySlug}
                      key={cityName}
                      buckets={buckets as any /* STRICTNESS_MIGRATION */}
                      relay={this.state.relay as any /* STRICTNESS_MIGRATION */}
                    />
                  </Tabs.Tab>
                )
              }
              return (
                <Tabs.Tab name={tab.id} label={tab.text} key={tab.id}>
                  <EventList
                    key={cityName + tab.id}
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    bucket={buckets[tab.id]}
                    type={tab.id}
                    cityName={cityName}
                    citySlug={citySlug}
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    relay={this.state.relay}
                    renderedInTab
                  />
                </Tabs.Tab>
              )
            })}
          </TabsContainer>
        )}
      </Container>
    ) : null
  }
}

const Handle = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${themeGet("colors.mono30")};
`

const Container = styled.View`
  background-color: ${themeGet("colors.background")};
`

// @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
const ErrorScreen: React.FC<{ relayErrorState: RelayErrorState }> = ({
  relayErrorState: { retry, isRetrying },
}) => {
  return (
    <Box py={2}>
      <Text variant="sm" textAlign="center" mx={2}>
        We are having trouble loading content right now, please try again later.
      </Text>
      <Flex justifyContent="center" flexDirection="row">
        <Box mt={2}>
          <Button onPress={retry} loading={isRetrying}>
            Retry
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}
