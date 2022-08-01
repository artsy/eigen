import { CareerHighlightsRail_me$key } from "__generated__/CareerHighlightsRail_me.graphql"
import { Flex, Spacer, useColor } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
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
      kind: a[0],
      count: a[1],
    }))
    .filter((a) => a.count > 0)

  if (careerHighlightData.length === 0) {
    return null
  }

  return (
    <Flex px={2} py={1} mb={2} backgroundColor={color("black5")}>
      <FlatList
        testID="career-highlight-cards-flatlist"
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Spacer mx={1} />}
        ListFooterComponent={() => (
          <Flex ml={2}>
            <CareerHighlightPromotionalCard />
          </Flex>
        )}
        style={{ overflow: "visible" }}
        data={careerHighlightData}
        renderItem={({ item }) => (
          <CareerHighlightsCard count={item.count} type={item.kind as CareerHighlightKind} />
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
