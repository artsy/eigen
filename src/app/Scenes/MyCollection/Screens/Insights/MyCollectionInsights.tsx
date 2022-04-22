import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { Flex, Text, useSpace } from "palette"
import React, { Suspense } from "react"

export const MyCollectionInsights = () => {
  const space = useSpace()
  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingTop: space("2") }}>
      <Text>My Collection Insights</Text>
    </StickyTabPageScrollView>
  )
}

export const MyCollectionInsightsQR: React.FC<{}> = () => (
  <Suspense fallback={<MyCollectionInsightsPlaceHolder />}>
    <MyCollectionInsights />
  </Suspense>
)

const MyCollectionInsightsPlaceHolder = () => (
  <Flex>
    <Text>A Placeholder</Text>
  </Flex>
)
