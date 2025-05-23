import {
  Box,
  Flex,
  Screen,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Tabs,
} from "@artsy/palette-mobile"
import { PartnerQuery } from "__generated__/PartnerQuery.graphql"
import { Partner_partner$data } from "__generated__/Partner_partner.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React from "react"

import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "./Components/PartnerArtwork"
import { PartnerHeaderContainer as PartnerHeader } from "./Components/PartnerHeader"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "./Components/PartnerOverview"
import { PartnerShowsFragmentContainer as PartnerShows } from "./Components/PartnerShows"
import { PartnerSubscriberBannerFragmentContainer as PartnerSubscriberBanner } from "./Components/PartnerSubscriberBanner"

interface PartnerProps {
  partner: Partner_partner$data
  initialTab?: string
  relay: RelayRefetchProp
}

const Partner: React.FC<PartnerProps> = (props) => {
  const { partner, initialTab } = props
  const { partnerType, displayFullPartnerPage } = partner

  if (!displayFullPartnerPage && partnerType !== "Brand") {
    return (
      <ProvideScreenTracking
        info={{
          context_screen: Schema.PageNames.PartnerPage,
          context_screen_owner_slug: props.partner.slug,
          context_screen_owner_id: props.partner.internalID,
          context_screen_owner_type: Schema.OwnerEntityTypes.Partner,
        }}
      >
        <Tabs.TabsWithHeader
          title={partner.name ?? ""}
          initialTabName={initialTab}
          BelowTitleHeaderComponent={() => <PartnerHeader partner={partner} />}
          headerProps={{ onBack: goBack }}
        >
          <Tabs.Tab name="Overview" label="Overview">
            <Tabs.ScrollView>
              <PartnerSubscriberBanner partner={partner} />
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.TabsWithHeader>
      </ProvideScreenTracking>
    )
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.PartnerPage,
        context_screen_owner_slug: props.partner.slug,
        context_screen_owner_id: props.partner.internalID,
        context_screen_owner_type: Schema.OwnerEntityTypes.Partner,
      }}
    >
      <Tabs.TabsWithHeader
        title={partner.name ?? ""}
        initialTabName={initialTab}
        BelowTitleHeaderComponent={() => <PartnerHeader partner={partner} showOnlyFollowButton />}
        headerProps={{ onBack: goBack }}
      >
        <Tabs.Tab name="Overview" label="Overview">
          <Tabs.Lazy>
            <PartnerOverview partner={partner} />
          </Tabs.Lazy>
        </Tabs.Tab>
        <Tabs.Tab name="Artworks" label="Artworks">
          <Tabs.Lazy>
            <ArtworkFiltersStoreProvider>
              <PartnerArtwork partner={partner} />
            </ArtworkFiltersStoreProvider>
          </Tabs.Lazy>
        </Tabs.Tab>
        <Tabs.Tab name="Shows" label="Shows">
          <Tabs.Lazy>
            <PartnerShows partner={partner} />
          </Tabs.Lazy>
        </Tabs.Tab>
      </Tabs.TabsWithHeader>
    </ProvideScreenTracking>
  )
}

export const PartnerContainer = createRefetchContainer(
  Partner,
  {
    partner: graphql`
      fragment Partner_partner on Partner {
        id
        name
        internalID
        slug
        partnerType
        displayFullPartnerPage
        ...PartnerArtwork_partner @arguments(input: { sort: "-partner_updated_at" })
        ...PartnerOverview_partner
        ...PartnerShows_partner
        ...PartnerHeader_partner
        ...PartnerSubscriberBanner_partner
      }
    `,
  },
  graphql`
    query PartnerRefetchQuery($id: ID!) {
      node(id: $id) {
        ...Partner_partner
      }
    }
  `
)

export const PartnerQueryRenderer: React.FC<{
  partnerID: string
  isVisible: boolean
}> = ({ partnerID, ...others }) => {
  return (
    <QueryRenderer<PartnerQuery>
      environment={getRelayEnvironment()}
      query={PartnerScreenQuery}
      variables={{
        partnerID,
      }}
      cacheConfig={{
        force: false,
      }}
      render={renderWithPlaceholder({
        Container: PartnerContainer,
        initialProps: others,
        renderPlaceholder: () => <PartnerSkeleton />,
      })}
    />
  )
}

export const PartnerScreenQuery = graphql`
  query PartnerQuery($partnerID: String!) {
    partner(id: $partnerID) {
      ...Partner_partner
    }
  }
`

export const PartnerSkeleton: React.FC = () => {
  return (
    <Screen>
      <Screen.Header />
      <Screen.Body fullwidth>
        <Skeleton>
          <Flex px={2} flexDirection="column" testID="PartnerPlaceholder">
            <SkeletonText variant="xl">Gallery Name</SkeletonText>

            <Spacer y={1} />

            <SkeletonBox width={100} height={30} />

            <Spacer y={1} />
          </Flex>

          <Spacer y={2} />

          {/* Tabs */}
          <Flex justifyContent="space-around" flexDirection="row" px={2}>
            <SkeletonText variant="xs">Overview</SkeletonText>
            <SkeletonText variant="xs">Artworks</SkeletonText>
            <SkeletonText variant="xs">Shows</SkeletonText>
          </Flex>
        </Skeleton>

        <Separator mt={1} mb={2} />

        <Box px={2}>
          <SkeletonBox width="100%" height={100} />

          <Spacer y={1} />

          <SkeletonText variant="xs">Has 1 location in Dubai</SkeletonText>

          <Spacer y={1} />

          <SkeletonBox width="100%" height={50} />

          <Spacer y={2} />

          <SkeletonText variant="xs">Artists (110)</SkeletonText>

          <Spacer y={2} />

          {/* Artists list */}
          {Array.from({ length: 10 }).map((_, i) => {
            return (
              <Flex
                flexDirection="row"
                key={i}
                width="100%"
                justifyContent="space-between"
                mb={1}
                alignItems="center"
              >
                <Flex width="50%" flexDirection="row" alignItems="center">
                  <SkeletonBox width={50} height={50} />
                  <Flex flexDirection="column" ml={1}>
                    <SkeletonText variant="xs" mb={0.5}>
                      Artist Name
                    </SkeletonText>
                    <SkeletonText variant="xs">Japanese, b, 1995</SkeletonText>
                  </Flex>
                </Flex>
                <SkeletonBox width={50} height={30} />
              </Flex>
            )
          })}
        </Box>
      </Screen.Body>
    </Screen>
  )
}
