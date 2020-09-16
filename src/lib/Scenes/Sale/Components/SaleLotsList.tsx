import { SaleLotsList_saleArtworks } from "__generated__/SaleLotsList_saleArtworks.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  saleArtworks: SaleLotsList_saleArtworks
}

export const SaleLotsList: React.FC<Props> = ({ saleArtworks }) => {
  console.log("=========")
  console.log({ saleArtworks })
  return (
    <Flex mt={3}>
      <Flex mx={2}>
        <SectionTitle title="Sorted by lot number (ascending)" subtitle="Showing 84 of 84 lots" />
      </Flex>
    </Flex>
  )
}

export const SaleLotsListContainer = createFragmentContainer(SaleLotsList, {
  saleArtworks: graphql`
    fragment SaleLotsList_saleArtworks on SaleArtwork @relay(plural: true) {
      artwork {
        image {
          url(version: "small")
        }
        href
        saleMessage
        artistNames
        slug
        internalID
        sale {
          isAuction
          isClosed
          displayTimelyAt
          endAt
        }
        saleMessage
        saleArtwork {
          counts {
            bidderPositions
          }
          currentBid {
            display
          }
        }
        partner {
          name
        }
      }
      lotLabel
    }
  `,
})
