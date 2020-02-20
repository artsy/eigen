import { Flex, Theme } from "@artsy/palette"
import { Partner_partner } from "__generated__/Partner_partner.graphql"
import { PartnerQuery } from "__generated__/PartnerQuery.graphql"
import { RetryErrorBoundary } from "lib/Components/RetryErrorBoundary"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "./Components/PartnerArtwork"
import { PartnerHeaderContainer as PartnerHeader } from "./Components/PartnerHeader"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "./Components/PartnerOverview"
import { PartnerShowsFragmentContainer as PartnerShows } from "./Components/PartnerShows"

interface Props {
  partner: Partner_partner
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
    return (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <StickyTabPage
              headerContent={<PartnerHeader partner={partner} />}
              tabs={[
                {
                  title: "Overview",
                  content: <PartnerOverview partner={partner} />,
                },
                {
                  title: "Artworks",
                  initial: true,
                  content: <PartnerArtwork partner={partner} />,
                },
                {
                  title: "Shows",
                  content: <PartnerShows partner={partner} />,
                },
              ]}
            />
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
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
        profile {
          id
          isFollowed
          internalID
        }

        ...PartnerArtwork_partner
        ...PartnerOverview_partner
        ...PartnerShows_partner
        ...PartnerHeader_partner
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

export const PartnerRenderer: React.SFC<{ partnerID: string; safeAreaInsets: SafeAreaInsets; isVisible: boolean }> = ({
  partnerID,
  ...others
}) => {
  return (
    <RetryErrorBoundary
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
            variables={{
              partnerID,
            }}
            cacheConfig={{
              // Bypass Relay cache on retries.
              ...(isRetry && { force: true }),
            }}
            render={renderWithLoadProgress(PartnerContainer, others)}
          />
        )
      }}
    />
  )
}
