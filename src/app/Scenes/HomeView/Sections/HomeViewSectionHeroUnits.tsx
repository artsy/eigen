import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedEntityDestinationType,
  TappedHeroUnitsGroup,
} from "@artsy/cohesion"
import { Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionHeroUnits_section$key } from "__generated__/HomeViewSectionHeroUnits_section.graphql"
import { PaginationDots } from "app/Components/PaginationDots"
import { HeroUnit } from "app/Scenes/Home/Components/HeroUnitsRail"
import { matchRoute } from "app/routes"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useRef, useState } from "react"
import { FlatList, ViewabilityConfig, ViewToken } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface HomeViewSectionHeroUnitsProps {
  section: HomeViewSectionHeroUnits_section$key
}

export const HomeViewSectionHeroUnits: React.FC<HomeViewSectionHeroUnitsProps> = ({ section }) => {
  const tracking = useTracking()

  const data = useFragment(fragment, section)
  const heroUnits = extractNodes(data.heroUnitsConnection)

  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index

      if (index) {
        setCurrentIndex(index)
      }
    }
  }

  const viewabilityConfig: ViewabilityConfig = { itemVisiblePercentThreshold: 25 }
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged, viewabilityConfig }])

  const { width } = useScreenDimensions()

  return (
    <>
      <FlatList
        data={heroUnits}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.internalID}
        renderItem={({ item }) => (
          <HeroUnit
            item={item}
            onPress={() => {
              tracking.trackEvent(
                tracks.tappedHeroUnitsGroup({
                  sectionID: data.internalID,
                  heroUnitID: item.internalID,
                  heroUnitURL: item.link.url,
                })
              )
            }}
          />
        )}
        snapToAlignment="start"
        snapToInterval={width}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <Spacer y={2} />
      <PaginationDots currentIndex={currentIndex} length={heroUnits.length} />
    </>
  )
}

const fragment = graphql`
  fragment HomeViewSectionHeroUnits_section on HomeViewSectionHeroUnits {
    internalID
    heroUnitsConnection(first: 10) {
      edges {
        node {
          internalID
          body
          credit
          image {
            imageURL
          }
          label
          link {
            text
            url
          }
          title
        }
      }
    }
  }
`

const tracks = {
  tappedHeroUnitsGroup: ({
    sectionID,
    heroUnitID,
    heroUnitURL,
  }: {
    sectionID: string
    heroUnitID: string
    heroUnitURL: string
  }): TappedHeroUnitsGroup => {
    let destinationScreenOwnerType = "WebView"

    const routeSpecs = matchRoute(heroUnitURL)

    if (routeSpecs.type === "match") {
      destinationScreenOwnerType = routeSpecs.module
    }

    return {
      action: ActionType.tappedHeroUnitsGroup,
      context_module: sectionID as ContextModule,
      context_screen_owner_type: OwnerType.home,
      destination_screen_owner_id: heroUnitID,
      destination_screen_owner_type: destinationScreenOwnerType as TappedEntityDestinationType,
      destination_screen_owner_url: heroUnitURL,
      type: "header",
    }
  },
}
