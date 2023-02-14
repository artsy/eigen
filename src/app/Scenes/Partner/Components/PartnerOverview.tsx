import { Spacer, Box } from "@artsy/palette-mobile"
import { PartnerOverview_partner$data } from "__generated__/PartnerOverview_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { extractNodes } from "app/utils/extractNodes"
import { Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"

export const PartnerOverview: React.FC<{
  partner: PartnerOverview_partner$data
}> = ({ partner }) => {
  const artistsData = extractNodes(partner.artists)

  const renderArtists = () => {
    return artistsData.map((artist) => {
      return (
        <Box key={artist.id}>
          <ArtistListItem artist={artist} />
          <Spacer y={2} />
        </Box>
      )
    })
  }

  const aboutText = partner.profile?.bio

  if (!aboutText && !artistsData && !partner.cities) {
    return (
      <StickyTabPageScrollView>
        <TabEmptyState text="There is no information for this gallery yet" />
      </StickyTabPageScrollView>
    )
  }

  return (
    // TODO: Switch to StickyTabPageFlatList
    <StickyTabPageScrollView>
      <Spacer y={2} />
      {!!aboutText && (
        <>
          <ReadMore content={aboutText} maxChars={300} textStyle="sans" />
          <Spacer y={2} />
        </>
      )}
      <PartnerLocationSection partner={partner} />
      {!!artistsData && artistsData.length > 0 && (
        <>
          <Text>
            <Text variant="sm-display">Artists ({artistsData.length})</Text>
          </Text>
          <Spacer y={2} />
          {renderArtists()}
          <Spacer y={4} />
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
      artists: allArtistsConnection(
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
