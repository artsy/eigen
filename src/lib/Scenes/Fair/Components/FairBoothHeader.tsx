import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { FairBoothHeader_show } from "__generated__/FairBoothHeader_show.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  show: FairBoothHeader_show
  onSaveShowPressed: () => void
  onTitlePressed: (id: string) => void
}

const formatCounts = ({ artists, artworks }) => {
  const artistLabel = artists === 1 ? "artist" : "artists"
  const worksLabel = artworks === 1 ? "work" : "works"
  return `${artworks} ${worksLabel} by ${artists} ${artistLabel}`
}

export const FairBoothHeader: React.SFC<Props> = ({
  show: {
    partner: { name: partnerName, href: partnerId },
    fair: { name: fairName },
    location: { display: boothLocation },
    counts,
  },
  onSaveShowPressed,
  onTitlePressed,
}) => {
  return (
    <Box pt={12} px={2}>
      <TouchableOpacity onPress={() => onTitlePressed(partnerId)}>
        <Serif size="8">{partnerName}</Serif>
      </TouchableOpacity>
      <Spacer m={0.3} />
      <Sans weight="medium" size="3t">
        {fairName}
      </Sans>
      <Spacer m={0.5} />
      {boothLocation && (
        <>
          <Serif size="3t">{boothLocation}</Serif>
          <Spacer m={0.3} />
        </>
      )}
      <Sans size="3t" color="black60">
        {formatCounts(counts)}
      </Sans>
      <Spacer m={3} />
      <InvertedButton text="Follow gallery" onPress={() => onSaveShowPressed()} />
      <Spacer m={0.5} />
    </Box>
  )
}

export const FairBoothHeaderContainer = createFragmentContainer(
  FairBoothHeader,
  graphql`
    fragment FairBoothHeader_show on Show {
      fair {
        name
      }
      partner {
        ... on Partner {
          name
          id
          href
        }
        ... on ExternalPartner {
          name
          id
        }
      }
      counts {
        artworks
        artists
      }
      location {
        display
      }
    }
  `
)
