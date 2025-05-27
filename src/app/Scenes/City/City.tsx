import { Tabs } from "@artsy/palette-mobile"
import { TabsContainer } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import { themeGet } from "@styled-system/theme-get"
import { EventEmitter } from "app/Scenes/Map/EventEmitter"
import { BucketKey, BucketResults } from "app/Scenes/Map/bucketCityResults"
import { MapTab } from "app/Scenes/Map/types"
import { Schema } from "app/utils/track"
import React, { useEffect, useState } from "react"
import { RelayProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { AllEvents } from "./Components/AllEvents"
import { EventList } from "./Components/EventList"
import { cityTabs } from "./cityTabs"

export interface CityViewProps {
  isDrawerOpen?: boolean
  citySlug: string
}

export const CityView: React.FC<CityViewProps> = () => {
  const [buckets, setBuckets] = useState<BucketResults | null>(null)
  const [filter, setFilter] = useState(cityTabs[0])
  const [cityName, setCityName] = useState("")
  const [citySlug, setCitySlug] = useState("")

  const { trackEvent } = useTracking()

  const handleEvent = ({
    filter,
    buckets,
    cityName,
    citySlug,
  }: {
    filter: MapTab
    buckets: BucketResults
    cityName: string
    relay: RelayProp
    citySlug: string
  }) => {
    // We have the Relay response; post a notification so that the ARMapContainerViewController can finalize the native UI (ie: show the drawer partially).
    setBuckets(buckets)
    setFilter(filter)
    setCityName(cityName)
    setCitySlug(citySlug)
  }

  useEffect(() => {
    EventEmitter.subscribe("map:change", handleEvent)

    return () => {
      EventEmitter.unsubscribe("map:change", handleEvent)
    }
  }, [])

  const setSelectedTab = (index: number) => {
    EventEmitter.dispatch("filters:change", index)
  }

  const trackTab = (filter: BucketKey | "all") => {
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
    if (actionName) {
      trackEvent(tracks.trackTab(actionName))
    }
  }

  useEffect(() => {
    trackTab(filter.id)
  }, [filter.id])

  if (buckets) {
    return (
      <Container
        style={{
          flex: 1,
          // Allow for extra padding to make it easier to tell that there is no more content
          paddingBottom: 50,
        }}
      >
        <TabsContainer
          onTabChange={(tab) => {
            setSelectedTab(Number(tab.index))
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
                  renderedInTab
                />
              </Tabs.Tab>
            )
          })}
        </TabsContainer>
      </Container>
    )
  }

  return null
}

const Container = styled.View`
  background-color: ${themeGet("colors.background")};
`

const tracks = {
  trackTab: (filter: string) => {
    return {
      action_name: filter,
      action_type: Schema.ActionTypes.Tap,
    } as any
  },
}
