import { PartnerOverview_partner$data } from "__generated__/PartnerOverview_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"

export const PartnerOverview: React.FC<{
  partner: PartnerOverview_partner$data
}> = ({ partner }) => {
  const artists = extractNodes(partner.allArtistsConnection)

  const renderArtists = () => {
    return artists.map((artist) => {
      return (
        <Box key={artist.id}>
          <ArtistListItem artist={artist} />
          <Spacer mb={2} />
        </Box>
      )
    })
  }

  const aboutText = partner.profile?.bio

  if (!aboutText && !artists && !partner.cities) {
    return (
      <StickyTabPageScrollView>
        <TabEmptyState text="There is no information for this gallery yet" />
      </StickyTabPageScrollView>
    )
  }

  return (
    // TODO: Switch to StickyTabPageFlatList
    <StickyTabPageScrollView>
      <Spacer mb={2} />
      {!!aboutText && (
        <>
          <ReadMore content={aboutText} maxChars={300} textStyle="sans" />
          <Spacer mb={2} />
        </>
      )}
      <PartnerLocationSection partner={partner} />
      {!!artists && artists.length > 0 && (
        <>
          <Text>
            <Text variant="sm-display">Artists ({artists.length})</Text>
          </Text>
          <Spacer mb={2} />
          {renderArtists()}
          <Spacer mb={3} />
        </>
      )}
    </StickyTabPageScrollView>
  )
}

export const PartnerOverviewFragmentContainer = createFragmentContainer(PartnerOverview, {
  partner: graphql`
    fragment PartnerOverview_partner on Partner {
      internalID
      name
      cities
      profile {
        bio
      }
      allArtistsConnection(
        displayOnPartnerProfile: true
        hasNotRepresentedArtistWithPublishedArtworks: true
      ) {
        edges {
          node {
            id
            ...ArtistListItem_artist
            counts {
              artworks
            }
          }
        }
      }
      ...PartnerLocationSection_partner
    }
  `,
})
