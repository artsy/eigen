import { Skeleton, SkeletonText, Tabs } from "@artsy/palette-mobile"
import { InfiniteDiscoveryBottomSheetTabsQuery } from "__generated__/InfiniteDiscoveryBottomSheetTabsQuery.graphql"
import {
  InfiniteDiscoveryAboutTheWorkTab,
  InfiniteDiscoveryAboutTheWorkTabSkeleton,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryAboutTheWorkTab"
import { InfiniteDiscoveryOtherWorksTab } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryOtherWorksTab"
import { FC } from "react"
import { PreloadedQuery } from "react-relay"

interface InfiniteDiscoveryOtherWorksTabProps {
  queryRef: PreloadedQuery<InfiniteDiscoveryBottomSheetTabsQuery>
}

export const InfiniteDiscoveryTabs: FC<InfiniteDiscoveryOtherWorksTabProps> = ({ queryRef }) => {
  return (
    <Tabs>
      <Tabs.Tab name="About the work" label="About the work">
        <InfiniteDiscoveryAboutTheWorkTab queryRef={queryRef} />
      </Tabs.Tab>
      <Tabs.Tab name="Other works" label="Other works">
        <InfiniteDiscoveryOtherWorksTab />
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
        <Tabs.Tab name="Other works" label="Other works">
          <SkeletonText variant="xs">Other works</SkeletonText>
        </Tabs.Tab>
      </Tabs>
    </Skeleton>
  )
}
