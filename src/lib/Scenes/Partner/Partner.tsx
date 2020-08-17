import { Flex, Separator, Spacer, Theme } from "@artsy/palette"
import { Partner_partner } from "__generated__/Partner_partner.graphql"
import { PartnerQuery } from "__generated__/PartnerQuery.graphql"
import { RetryErrorBoundary } from "lib/Components/RetryErrorBoundary"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { PlaceholderImage, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Schema, screenTrack } from "lib/utils/track"
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
              content: <PartnerArtwork partner={partner} />,
            },
            {
              title: "Shows",
              content: <PartnerShows partner={partner} />,
            },
          ]}
        />
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

export const PartnerQueryRenderer: React.SFC<{
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}> = ({ partnerID, ...others }) => {
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
              // TODO: Remove this if committed, only for testing placeholder
              force: true,
            }}
            render={renderWithPlaceholder({
              Container: PartnerContainer,
              renderPlaceholder: () => <PartnerPlaceholder />,
            })}
          />
        )
      }}
    />
  )
}

const PartnerPlaceholder: React.FC = () => (
  <Theme>
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
        <Flex>
          <Spacer mb={75} />
          {/* artist name */}
          <PlaceholderText width={180} />
          <Spacer mb={1} />
          {/* birth year, nationality */}
          <PlaceholderText width={100} />
          {/* works, followers */}
          <PlaceholderText width={150} />
        </Flex>
        <PlaceholderText width={70} alignSelf="flex-end" />
      </Flex>
      <Spacer mb={3} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width={40} />
        <PlaceholderText width={50} />
        <PlaceholderText width={40} />
      </Flex>
      <Spacer mb={1} />
      <Separator />
      <Spacer mb={3} />
      {/* masonry grid */}
      <Flex mx={2} flexDirection="row">
        <Flex mr={1} style={{ flex: 1 }}>
          <PlaceholderImage height={92} />
          <PlaceholderImage height={172} />
          <PlaceholderImage height={82} />
        </Flex>
        <Flex ml={1} style={{ flex: 1 }}>
          <PlaceholderImage height={182} />
          <PlaceholderImage height={132} />
          <PlaceholderImage height={86} />
        </Flex>
      </Flex>
    </Flex>
  </Theme>
)
