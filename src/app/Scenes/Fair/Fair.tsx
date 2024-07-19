import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Flex,
  Tabs,
  Skeleton,
  SkeletonBox,
  useScreenDimensions,
  SkeletonText,
  useSpace,
} from "@artsy/palette-mobile"
import { FairQuery } from "__generated__/FairQuery.graphql"
import { Fair_fair$data, Fair_fair$key } from "__generated__/Fair_fair.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FairArtworks } from "app/Scenes/Fair/Components/FairArtworks"
import { FairExhibitorsFragmentContainer } from "app/Scenes/Fair/Components/FairExhibitors"
import { FairOverview } from "app/Scenes/Fair/FairOverview"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { useClientQuery } from "app/utils/useClientQuery"
import React from "react"
import { createFragmentContainer, graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { FairHeader } from "./Components/FairHeader"

interface FairProps {
  fair: Fair_fair$key
}

export const Fair: React.FC<FairProps> = ({ fair }) => {
  const data = useFragment(fragment, fair)
  const tracking = useTracking()

  if (!data) {
    return null
  }

  const handleTabChange = (tabName: string) => {
    switch (tabName) {
      case "Exhibitors":
        tracking.trackEvent(tracks.tappedExhibitorsTabProps(data))
        break
      case "Artworks":
        tracking.trackEvent(tracks.tappedArtworkTabProps(data))
        break
    }
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.FairPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
        context_screen_owner_id: data.internalID,
        context_screen_owner_slug: data.slug,
      }}
    >
      <Tabs.TabsWithHeader
        initialTabName="Overview"
        title={`${data.name}`}
        showLargeHeaderText={false}
        BelowTitleHeaderComponent={() => <FairHeader fair={data} />}
        onTabChange={({ tabName }) => handleTabChange(tabName)}
        headerProps={{ onBack: goBack }}
      >
        <Tabs.Tab name="Overview" label="Overview">
          <Tabs.Lazy>
            <FairOverview fair={data} />
          </Tabs.Lazy>
        </Tabs.Tab>

        <Tabs.Tab name="Exhibitors" label="Exhibitors">
          <Tabs.Lazy>
            <FairExhibitorsFragmentContainer fair={data} />
          </Tabs.Lazy>
        </Tabs.Tab>

        <Tabs.Tab name="Artworks" label="Artworks">
          <Tabs.Lazy>
            <ArtworkFiltersStoreProvider>
              <FairArtworks fair={data} />
            </ArtworkFiltersStoreProvider>
          </Tabs.Lazy>
        </Tabs.Tab>
      </Tabs.TabsWithHeader>
    </ProvideScreenTracking>
  )
}

const fragment = graphql`
  fragment Fair_fair on Fair {
    ...FairOverview_fair
    ...FairHeader_fair
    ...FairArtworks_fair @arguments(input: { sort: "-decayed_merch" })
    ...FairExhibitors_fair

    internalID
    slug
    name
  }
`

export const FairFragmentContainer = createFragmentContainer(Fair, {
  fair: fragment,
})

const query = graphql`
  query FairQuery($fairID: String!) {
    fair(id: $fairID) @principalField {
      ...Fair_fair
    }
  }
`

interface FairQueryRendererProps {
  fairID: string
}

export const FairQueryRenderer: React.FC<FairQueryRendererProps> = ({ fairID }) => {
  const res = useClientQuery<FairQuery>({ query, variables: { fairID } })

  if (!res.data?.fair) {
    return <FairPlaceholder />
  }

  return <Fair fair={res.data.fair} />
}

export const FairPlaceholder: React.FC = () => {
  const { safeAreaInsets } = useScreenDimensions()
  const space = useSpace()

  return (
    <Flex top={safeAreaInsets.top}>
      <Skeleton>
        <Flex p={2}>
          <SkeletonBox width={18} height={18} />
        </Flex>

        <Flex gap={space(2)}>
          <SkeletonBox height={400} width="100%" />

          <SkeletonText mx={2}>Fair Text Long Placeholder</SkeletonText>

          <SkeletonText variant="xs" mx={2}>
            Fair Date
          </SkeletonText>

          <Flex
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            pb={2}
            borderBottomColor="black10"
            borderBottomWidth={1}
          >
            <SkeletonText>Overview</SkeletonText>
            <SkeletonText>Exhibitors</SkeletonText>
            <SkeletonText>Artworks</SkeletonText>
          </Flex>

          <SkeletonText mx={2}>Fair Text Long Placeholder</SkeletonText>
        </Flex>
      </Skeleton>
    </Flex>
  )
}

const tracks = {
  tappedArtworkTabProps: (fair: Fair_fair$data) => ({
    action: ActionType.tappedNavigationTab,
    context_screen_owner_type: OwnerType.fair,
    context_screen_owner_id: fair.internalID,
    context_screen_owner_slug: fair.slug,
    context_module: ContextModule.exhibitorsTab,
    subject: "Artworks",
  }),
  tappedExhibitorsTabProps: (fair: Fair_fair$data) => ({
    action: ActionType.tappedNavigationTab,
    context_screen_owner_type: OwnerType.fair,
    context_screen_owner_id: fair.internalID,
    context_screen_owner_slug: fair.slug,
    context_module: ContextModule.artworksTab,
    subject: "Exhibitors",
  }),
}
