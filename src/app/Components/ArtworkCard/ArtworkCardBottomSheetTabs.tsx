import { ActionType, ContextModule } from "@artsy/cohesion"
import { Skeleton, SkeletonText, Tabs } from "@artsy/palette-mobile"
import { TabsContainerProps } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import {
  InfiniteDiscoveryAboutTheWorkTab,
  InfiniteDiscoveryAboutTheWorkTabSkeleton,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryAboutTheWorkTab"
import { InfiniteDiscoveryMoreWorksTab } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryMoreWorksTab"
import { FC } from "react"
import { IndexChangeEventData } from "react-native-collapsible-tab-view/lib/typescript/src/types"
import { useTracking } from "react-tracking"

interface ArtworkCardBottomSheetTabsProps {
  artistIDs: string[]
  artworkID: string
  onTabChange: TabsContainerProps["onTabChange"]
}

const TABS = [
  {
    name: "About the work",
    analyticsName: ContextModule.infiniteDiscoveryArtworkAboutTab,
  },
  {
    name: "Other works",
    analyticsName: ContextModule.infiniteDiscoveryArtworkOtherWorksTab,
  },
]

export const ArtworkCardBottomSheetTabs: FC<ArtworkCardBottomSheetTabsProps> = ({
  artistIDs,
  artworkID,
  onTabChange,
}) => {
  const { trackEvent } = useTracking()

  const handleTabChange = (data: IndexChangeEventData) => {
    const contextModule = TABS.find((tab) => tab.name === data.prevTabName)?.analyticsName
    const subject = TABS.find((tab) => tab.name === data.tabName)?.analyticsName

    trackEvent({
      action: ActionType.tappedNavigationTab,
      context_module: contextModule,
      subject: subject,
    })
    onTabChange?.(data)
  }

  return (
    <Tabs onTabChange={handleTabChange}>
      <Tabs.Tab name={TABS[0].name} label={TABS[0].name}>
        <InfiniteDiscoveryAboutTheWorkTab artworkID={artworkID} />
      </Tabs.Tab>
      <Tabs.Tab name={TABS[1].name} label={TABS[1].name}>
        <InfiniteDiscoveryMoreWorksTab artistIDs={artistIDs} />
      </Tabs.Tab>
    </Tabs>
  )
}

export const ArtworkCardBottomSheetTabsSkeleton: FC = () => {
  return (
    <Skeleton>
      <Tabs>
        <Tabs.Tab name={TABS[0].name} label={TABS[0].name}>
          <InfiniteDiscoveryAboutTheWorkTabSkeleton />
        </Tabs.Tab>
        <Tabs.Tab name={TABS[1].name} label={TABS[1].name}>
          <SkeletonText variant="xs">{TABS[1].name}</SkeletonText>
        </Tabs.Tab>
      </Tabs>
    </Skeleton>
  )
}
