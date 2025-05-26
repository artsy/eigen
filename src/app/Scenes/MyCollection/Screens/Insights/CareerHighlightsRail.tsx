import { Flex, useColor } from "@artsy/palette-mobile"
import { CareerHighlightsRail_me$key } from "__generated__/CareerHighlightsRail_me.graphql"
import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { useFragment, graphql } from "react-relay"
import {
  CareerHighlightKind,
  CareerHighlightPromotionalCard,
  CareerHighlightsCard,
} from "./CareerHighlightCard"
interface CareerHighlightsRailProps {
  me: CareerHighlightsRail_me$key
}

export const CareerHighlightsRail: React.FC<CareerHighlightsRailProps> = (props) => {
  const color = useColor()
  const me = useFragment(fragment, props.me)

  if (!me?.myCollectionInfo?.artistInsightsCount) {
    return null
  }

  const careerHighlightData = Object.entries(me.myCollectionInfo.artistInsightsCount)
    .map((a) => ({
      kind: a[0] as CareerHighlightKind,
      count: a[1],
    }))
    .filter((a) => a.count > 0)

  if (careerHighlightData.length === 0) {
    return null
  }

  const careerHighlightsAvailableTypes: CareerHighlightKind[] = []
  careerHighlightData.map((i) => {
    return careerHighlightsAvailableTypes.push(i.kind)
  })

  return (
    <Flex py={1} mb={4} backgroundColor={color("mono5")}>
      <EmbeddedCarousel
        testID="career-highlight-cards-flatlist"
        ListFooterComponent={() => (
          <Flex ml={2} mr={2}>
            <CareerHighlightPromotionalCard
              onPress={() => {
                navigate("/my-collection/career-highlights", {
                  passProps: { openPromoCard: true, careerHighlightsAvailableTypes },
                })
              }}
              onButtonPress={() => {
                navigate("my-collection/artworks/new", {
                  passProps: {
                    source: Tab.insights,
                  },
                })
              }}
            />
          </Flex>
        )}
        data={careerHighlightData}
        renderItem={({ item }) => (
          <CareerHighlightsCard
            count={item.count}
            type={item.kind}
            onPress={() => {
              navigate("/my-collection/career-highlights", {
                passProps: { type: item.kind, careerHighlightsAvailableTypes },
              })
            }}
          />
        )}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment CareerHighlightsRail_me on Me {
    myCollectionInfo {
      artistInsightsCount {
        BIENNIAL: biennialCount
        COLLECTED: collectedCount
        GROUP_SHOW: groupShowCount
        SOLO_SHOW: soloShowCount
        REVIEWED: reviewedCount
      }
    }
  }
`
