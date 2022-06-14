import { Partner_partner$data } from "__generated__/Partner_partner.graphql"
import { PartnerQuery } from "__generated__/PartnerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { HeaderTabsGridPlaceholder } from "app/Components/HeaderTabGridPlaceholder"
import { RetryErrorBoundaryLegacy } from "app/Components/RetryErrorBoundary"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Schema, screenTrack } from "app/utils/track"
import { Separator } from "palette"
import React from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "./Components/PartnerArtwork"
import { PartnerHeaderContainer as PartnerHeader } from "./Components/PartnerHeader"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "./Components/PartnerOverview"
import { PartnerShowsFragmentContainer as PartnerShows } from "./Components/PartnerShows"
import { PartnerSubscriberBannerFragmentContainer as PartnerSubscriberBanner } from "./Components/PartnerSubscriberBanner"

interface Props {
  partner: Partner_partner$data
  relay: RelayRefetchProp
}

@screenTrack((props: Props) => ({
  context_screen: Schema.PageNames.PartnerPage,
  context_screen_owner_slug: props.partner.slug,
  context_screen_owner_id: props.partner.internalID,
  context_screen_owner_type: Schema.OwnerEntityTypes.Partner,
}))
class Partner extends React.Component<Props> {
  render() {
    const { partner } = this.props
    const { partnerType, displayFullPartnerPage } = partner

    if (!displayFullPartnerPage && partnerType !== "Brand") {
      return (
        <>
          <PartnerHeader partner={partner} />
          <Separator my={2} />
          <PartnerSubscriberBanner partner={partner} />
        </>
      )
    }

    return (
      <StickyTabPage
        staticHeaderContent={<PartnerHeader partner={partner} />}
        tabs={[
          {
            title: "Overview",
            content: <PartnerOverview partner={partner} />,
          },
          {
            title: "Artworks",
            initial: true,
            content: (
              <ArtworkFiltersStoreProvider>
                <PartnerArtwork partner={partner} />
              </ArtworkFiltersStoreProvider>
            ),
          },
          {
            title: "Shows",
            content: <PartnerShows partner={partner} />,
          },
        ]}
      />
    )
  }
}

export const PartnerContainer = createRefetchContainer(
  Partner,
  {
    partner: graphql`
      fragment Partner_partner on Partner {
        id
        internalID
        slug
        partnerType
        displayFullPartnerPage
        profile {
          id
          isFollowed
          internalID
        }

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
    <RetryErrorBoundaryLegacy
      render={({ isRetry }) => {
        return (
          <QueryRenderer<PartnerQuery>
            environment={defaultEnvironment}
            query={graphql`
              query PartnerQuery($partnerID: String!) {
                partner(id: $partnerID) {
                  ...Partner_partner
                }
              }
            `}
            variables={{ partnerID }}
            cacheConfig={{
              // Bypass Relay cache on retries.
              ...(isRetry && { force: true }),
            }}
            render={renderWithPlaceholder({
              Container: PartnerContainer,
              initialProps: others,
              renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
            })}
          />
        )
      }}
    />
  )
}
