import { Spacer } from "@artsy/palette-mobile"
import { HeroUnitsRailHomeViewSection_section$key } from "__generated__/HeroUnitsRailHomeViewSection_section.graphql"
import { PaginationDots } from "app/Components/PaginationDots"
import { HeroUnit } from "app/Scenes/Home/Components/HeroUnitsRail"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useRef, useState } from "react"
import { FlatList, ViewabilityConfig } from "react-native"
import { graphql, useFragment } from "react-relay"

interface HeroUnitsRailHomeViewSectionProps {
  section: HeroUnitsRailHomeViewSection_section$key
}

export const HeroUnitsRailHomeViewSection: React.FC<HeroUnitsRailHomeViewSectionProps> = ({
  section,
}) => {
  const data = useFragment(fragment, section)
  const heroUnits = extractNodes(data.heroUnitsConnection)

  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index
      setCurrentIndex(index)
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
        renderItem={({ item }) => <HeroUnit item={item} />}
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
  fragment HeroUnitsRailHomeViewSection_section on HeroUnitsHomeViewSection {
    component {
      title
    }

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
