import { Skeleton, SkeletonText, Tabs } from "@artsy/palette-mobile"
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
}

export const InfiniteDiscoveryTabs: FC<InfiniteDiscoveryOtherWorksTabProps> = ({ queryRef }) => {
  return (
    <Tabs>
      <Tabs.Tab name="About the work" label="About the work">
        <InfiniteDiscoveryAboutTheWorkTab queryRef={queryRef} />
      </Tabs.Tab>
      <Tabs.Tab name="More works by artist" label="More works by artist">
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
