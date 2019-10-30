import { Box, Flex, Theme } from "@artsy/palette"
import { Partner_partner } from "__generated__/Partner_partner.graphql"
import { PartnerQuery } from "__generated__/PartnerQuery.graphql"
import { RetryErrorBoundary } from "lib/Components/RetryErrorBoundary"
import { ScrollableTab } from "lib/Components/ScrollableTabBar"
import TabBar from "lib/Components/TabBar"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { track } from "lib/utils/track"
import React from "react"
import ScrollableTabView from "react-native-scrollable-tab-view"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "./Components/PartnerArtwork"
import { PartnerHeaderContainer as PartnerHeader } from "./Components/PartnerHeader"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "./Components/PartnerOverview"
import { PartnerShowsFragmentContainer as PartnerShows } from "./Components/PartnerShows"

const INITIAL_TAB = 1

interface Props {
  partner: Partner_partner
  relay: RelayRefetchProp
}

@track()
class Partner extends React.Component<Props> {
  state = {
    selectedTab: INITIAL_TAB,
    scrollY: 0,
  }

  render() {
    const { partner } = this.props
    return (
      <Theme>
        <Flex style={{ flex: 1 }}>
          <PartnerHeader partner={partner} />
          <ScrollableTabView
            initialPage={INITIAL_TAB}
            prerenderingSiblingsNumber={2}
            onChangeTab={tab => this.setState({ selectedTab: tab })}
            renderTabBar={props => (
              <Box>
                <TabBar spaceEvenly {...props} />
              </Box>
            )}
          >
            <ScrollableTab tabLabel="Overview" key="overviewTab">
              <PartnerOverview partner={partner} />
            </ScrollableTab>
            <ScrollableTab tabLabel="Artwork" key="artworkTab">
              <PartnerArtwork partner={partner} />
            </ScrollableTab>
            <ScrollableTab tabLabel="Shows" key="showsTab">
              <PartnerShows partner={partner} />
            </ScrollableTab>
          </ScrollableTabView>
        </Flex>
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
