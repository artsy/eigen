import { Skeleton, SkeletonText, Tabs } from "@artsy/palette-mobile"
import { TabsContainerProps } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import { InfiniteDiscoveryBottomSheetTabsQuery } from "__generated__/InfiniteDiscoveryBottomSheetTabsQuery.graphql"
import {
  InfiniteDiscoveryAboutTheWorkTab,
  InfiniteDiscoveryAboutTheWorkTabSkeleton,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryAboutTheWorkTab"
import { InfiniteDiscoveryMoreWorksTab } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryMoreWorksTab"
import { FC } from "react"
import { PreloadedQuery } from "react-relay"

interface InfiniteDiscoveryOtherWorksTabProps {
  queryRef: PreloadedQuery<InfiniteDiscoveryBottomSheetTabsQuery>
  onTabChange: TabsContainerProps["onTabChange"]
}

export const TABS = ["About the work", "More works by artist"]

export const InfiniteDiscoveryTabs: FC<InfiniteDiscoveryOtherWorksTabProps> = ({
  queryRef,
  onTabChange,
}) => {
  return (
    <Tabs onTabChange={onTabChange}>
      <Tabs.Tab name={TABS[0]} label={TABS[0]}>
        <InfiniteDiscoveryAboutTheWorkTab queryRef={queryRef} />
      </Tabs.Tab>
      <Tabs.Tab name={TABS[1]} label={TABS[1]}>
        <InfiniteDiscoveryMoreWorksTab queryRef={queryRef} />
      </Tabs.Tab>
    </Tabs>
  )
}

export const InfiniteDiscoveryTabsSkeleton: FC = () => {
  return (
    <Skeleton>
      <Tabs>
        <Tabs.Tab name="About the work" label="About the work">
          <InfiniteDiscoveryAboutTheWorkTabSkeleton />
        </Tabs.Tab>
        <Tabs.Tab name="More works by artist" label="More works by artist">
          <SkeletonText variant="xs">More works by artist</SkeletonText>
        </Tabs.Tab>
      </Tabs>
    </Skeleton>
  )
}
