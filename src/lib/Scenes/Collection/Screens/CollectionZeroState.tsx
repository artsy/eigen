import { Button, color, Flex, Sans } from "@artsy/palette"
import { Collection_collection } from "__generated__/Collection_collection.graphql"
import { ArtworkFilterContext } from "lib/utils/ArtworkFiltersStore"
import { Schema } from "lib/utils/track"
import React, { useContext } from "react"
import { useTracking } from "react-tracking"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"

interface CollectionZeroStateProps {
  id: Collection_collection["id"]
  slug: Collection_collection["slug"]
}

export const CollectionZeroState: React.SFC<CollectionZeroStateProps> = props => {
  const { id, slug } = props
  const { dispatch } = useContext(ArtworkFilterContext)
  const tracking = useTracking()

  const refetchArtworks = () => {
    dispatch({ type: "clearFiltersZeroState" })
  }

  return (
    <ZeroStateContainer>
      <ZeroStateMessage size="3">Unfortunately, there are no works that meet your criteria.</ZeroStateMessage>
      <ButtonBox>
        <Button
          size="medium"
          variant="secondaryGray"
          onPress={() => {
            tracking.trackEvent({
              action_name: "clearFilters",
              context_screen: Schema.ContextModules.Collection,
              context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
              context_screen_owner_id: id,
              context_screen_owner_slug: slug,
              action_type: Schema.ActionTypes.Tap,
            })

            refetchArtworks()
          }}
        >
          Clear filters
        </Button>
      </ButtonBox>
    </ZeroStateContainer>
  )
}

const ZeroStateMessage = styled(Sans)`
  color: ${color("black100")};
  text-align: center;
`
const ZeroStateContainer = styled(Flex)`
  padding: 25px 35px 50px 35px;
  flex-direction: column;
`

const ButtonBox = styled(Flex)`
  margin: 0 auto;
  padding: 15px 0 25px 0;
`
