import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Flex,
  // eslint-disable-next-line local-rules/no-palette-icon-imports
  ShareIcon,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Tabs,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { FairQuery } from "__generated__/FairQuery.graphql"
import { Fair_fair$data, Fair_fair$key } from "__generated__/Fair_fair.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { FairArtworks } from "app/Scenes/Fair/Components/FairArtworks"
import { FairExhibitorsFragmentContainer } from "app/Scenes/Fair/Components/FairExhibitors"
import { FairOverview } from "app/Scenes/Fair/FairOverview"
import { goBack } from "app/system/navigation/navigate"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { Suspense } from "react"
import { TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { FairHeader } from "./Components/FairHeader"

interface FairProps {
  fair: Fair_fair$key
}

export const Fair: React.FC<FairProps> = ({ fair }) => {
  const data = useFragment(fragment, fair)
  const tracking = useTracking()
  const toast = useToast()

  if (!data) {
    return null
  }

  const handleSharePress = async () => {
    try {
      const url = getShareURL(`/fair/${data.slug}?utm_content=fair-share`)
      const message = `View ${data.name} on Artsy`

      await RNShare.open({
        title: data.name || "",
        message: message + "\n" + url,
        failOnCancel: true,
      })
      toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
    } catch (error) {
      if (typeof error === "string" && error.includes("User did not share")) {
        console.error("Collection.tsx", error)
      }
    }
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

  const hasExhibitors = !!data._exhibitors?.totalCount

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
        pagerProps={{
          scrollEnabled: false,
        }}
        initialTabName="Overview"
        title={`${data.name}`}
        showLargeHeaderText={false}
        BelowTitleHeaderComponent={() => <FairHeader fair={data} />}
        onTabChange={({ tabName }) => handleTabChange(tabName)}
        headerProps={{
          onBack: goBack,
          rightElements: (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Share Fair"
              onPress={() => {
                handleSharePress()
              }}
            >
              <ShareIcon width={24} height={24} />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Tab name="Overview" label="Overview">
          <Tabs.Lazy>
            <FairOverview fair={data} />
          </Tabs.Lazy>
        </Tabs.Tab>

        {!!hasExhibitors ? (
          <Tabs.Tab name="Exhibitors" label="Exhibitors">
            <Tabs.Lazy>
              <FairExhibitorsFragmentContainer fair={data} />
            </Tabs.Lazy>
          </Tabs.Tab>
        ) : null}

        <Tabs.Tab name="Artworks" label="Artworks">
          <ArtworkFiltersStoreProvider>
            <Suspense
              fallback={
                <Flex flex={1} alignItems="center">
                  <Flex width="100%" justifyContent="space-between" py={2} flexDirection="row">
                    <SkeletonText variant="xs">Showing X works</SkeletonText>
                    <SkeletonText variant="xs">Sort & Filter</SkeletonText>
                  </Flex>
                  <PlaceholderGrid />
                </Flex>
              }
            >
              <FairArtworks fair={data} />
            </Suspense>
          </ArtworkFiltersStoreProvider>
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
    # Used to figure out if we should render the exhibitors tab
    _exhibitors: showsConnection(first: 1, sort: FEATURED_ASC) {
      totalCount
    }
  }
`

export const FairScreenQuery = graphql`
  query FairQuery($fairID: String!) {
    fair(id: $fairID) @principalField {
      ...Fair_fair
    }
  }
`

interface FairQueryRendererProps {
  fairID: string
}

const FairQueryRenderer: React.FC<FairQueryRendererProps> = ({ fairID }) => {
  const data = useLazyLoadQuery<FairQuery>(
    FairScreenQuery,
    { fairID },
    {
      networkCacheConfig: {
        force: false,
      },
    }
  )

  if (!data?.fair) {
    return null
  }

  return <Fair fair={data.fair} />
}

export const FairScreen: React.FC<FairQueryRendererProps> = ({ fairID }) => (
  <Suspense fallback={<FairPlaceholder />}>
    <FairQueryRenderer fairID={fairID} />
  </Suspense>
)

export const FairPlaceholder: React.FC = () => {
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <Flex top={safeAreaInsets.top} testID="FairPlaceholder">
      <Skeleton>
        <Flex p={2}>
          <SkeletonBox width={18} height={18} />
        </Flex>

        <Flex gap={2}>
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
            borderBottomColor="mono10"
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
