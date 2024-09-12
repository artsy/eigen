import { Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionHeroUnits_section$key } from "__generated__/HomeViewSectionHeroUnits_section.graphql"
import { PaginationDots } from "app/Components/PaginationDots"
import { HeroUnit } from "app/Scenes/Home/Components/HeroUnitsRail"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useRef, useState } from "react"
import { FlatList, ViewabilityConfig, ViewToken } from "react-native"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionHeroUnitsProps {
  section: HomeViewSectionHeroUnits_section$key
}

export const HomeViewSectionHeroUnits: React.FC<HomeViewSectionHeroUnitsProps> = ({ section }) => {
  const tracking = useHomeViewTracking()

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
        renderItem={({ item, index }) => (
          <HeroUnit
            item={item}
            onPress={() => {
              tracking.tappedHeroUnitGroup(item.link.url, data.internalID, index)
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
