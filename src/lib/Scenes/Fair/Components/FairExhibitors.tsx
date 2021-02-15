import { ActionType, ContextModule, OwnerType, TappedShowMore } from "@artsy/cohesion"
import { FairExhibitors_fair } from "__generated__/FairExhibitors_fair.graphql"
import { Col } from "lib/Components/Bidding/Elements/Grid"
import { FAIR2_EXHIBITORS_PAGE_SIZE } from "lib/data/constants"
import { Row } from "lib/Scenes/Consignments/Components/FormElements"
import { Box, Button } from "palette"
import React, { useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { FairExhibitorRailFragmentContainer } from "./FairExhibitorRail"

interface FairExhibitorsProps {
  fair: FairExhibitors_fair
  relay: RelayPaginationProp
}

const FairExhibitors: React.FC<FairExhibitorsProps> = ({ fair, relay }) => {
  const tracking = useTracking()
  const [isLoading, setIsLoading] = useState(false)

  const trackTappedShowMore = () => {
    const trackTappedShowMoreProps: TappedShowMore = {
      action: ActionType.tappedShowMore,
      context_module: ContextModule.exhibitorsTab,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      subject: "Show More",
    }
    tracking.trackEvent(trackTappedShowMoreProps)
  }

  const handlePress = () => {
    trackTappedShowMore()
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    setIsLoading(true)

    relay.loadMore(FAIR2_EXHIBITORS_PAGE_SIZE, (err) => {
      setIsLoading(false)

      if (err) {
        console.error(err)
      }
    })
  }

  return (
    <>
      {fair?.exhibitors?.edges?.map((item) => {
        const show = item?.node
        if ((show?.counts?.artworks ?? 0) === 0 || !show?.partner) {
          // Skip rendering of booths without artworks
          return null
        }

        return (
          <Box key={show.id} mb="3">
            <FairExhibitorRailFragmentContainer key={show.id} show={show} />
          </Box>
        )
      })}
      <Row>
        <Col sm="6" mx={15}>
          <Button
            variant="secondaryGray"
            size="large"
            block
            loading={isLoading}
            onPress={handlePress}
            disabled={!relay.hasMore()}
          >
            Show more
          </Button>
        </Col>
      </Row>
    </>
  )
}

export const FairExhibitorsFragmentContainer = createPaginationContainer(
  FairExhibitors,
  {
    fair: graphql`
      fragment FairExhibitors_fair on Fair
      @argumentDefinitions(first: { type: "Int", defaultValue: 30 }, after: { type: "String" }) {
        internalID
        slug
        exhibitors: showsConnection(first: $first, after: $after, sort: FEATURED_ASC)
          @connection(key: "FairExhibitorsQuery_exhibitors") {
          edges {
            node {
              id
              counts {
                artworks
              }
              partner {
                ... on Partner {
                  id
                }
                ... on ExternalPartner {
                  id
                }
              }
              ...FairExhibitorRail_show
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getVariables({ fair: { slug: id } }, { cursor: after }, { first }) {
      return { first, after, id }
    },
    query: graphql`
      query FairExhibitorsQuery($id: String!, $first: Int!, $after: String) {
        fair(id: $id) {
          ...FairExhibitors_fair @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)
