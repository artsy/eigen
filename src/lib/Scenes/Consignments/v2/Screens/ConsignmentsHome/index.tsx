import { AuctionIcon, Box, Button, EditIcon, EnvelopeIcon, Flex, Sans, Separator, Spacer } from "@artsy/palette"
import { ConsignmentsHome_artists } from "__generated__/ConsignmentsHome_artists.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtistListFragmentContainer as ArtistList, FOCUSED_20_ARTIST_IDS } from "./ArtistList"

// TODO:
//  - build a placeholder

interface Props {
  artists: ConsignmentsHome_artists
}

export const ConsignmentsHome: React.FC<Props> = ({ artists }) => {
  return (
    <ScrollView>
      <Box px={2} py={6}>
        <Box>
          <Sans size="10" textAlign="center">
            Sell Art From  Your Collection
          </Sans>

          <Spacer my={0.5} />

          <Sans size="4" textAlign="center">
            Get competitive offers from 3,500+ galleries and auction houses
          </Sans>
        </Box>

        <Spacer mb={2} />

        <Flex flexDirection="row" justifyContent="space-between">
          <Flex alignItems="center">
            <EditIcon width={30} height={30} />
            <Sans size="3" weight="medium">
              Submit once
            </Sans>
          </Flex>
          <Flex alignItems="center">
            <EnvelopeIcon width={30} height={30} />
            <Sans size="3" weight="medium">
              Receive offers
            </Sans>
          </Flex>
          <Flex alignItems="center">
            <AuctionIcon width={30} height={30} />
            <Sans size="3" weight="medium">
              Match & sell
            </Sans>
          </Flex>
        </Flex>

        <Spacer mb={3} />

        <Button variant="primaryBlack" block>
          <Sans size="3" weight="medium">
            Submit a work
          </Sans>
        </Button>

        <Spacer mb={3} />

        <Box>
          <Box>
            <Sans size="4">Artists with high demand on Artsy</Sans>
          </Box>

          <Spacer mb={2} />

          <ScrollView horizontal>
            <Box>
              <ArtistList artists={artists} />
            </Box>
          </ScrollView>
        </Box>

        <Spacer mb={3} />

        <Box>
          <Box>
            <Sans size="4">Artists with high demand on Artsy</Sans>
          </Box>

          <Spacer mb={2} />

          <Box>
            <Sans size="3">Artwork Grid</Sans>
          </Box>
        </Box>

        <Box my={3}>
          <Separator />
        </Box>

        <Box>
          <Sans size="4" textAlign="center">
            Our team of specialists is here to value your artworks for free and recommend a tailored sales strategy to
            suit your needs.
          </Sans>
        </Box>

        <Spacer mb={3} />

        <Button variant="primaryBlack" block>
          <Sans size="3">Start today</Sans>
        </Button>
      </Box>
    </ScrollView>
  )
}

const ConsignmentsHomeContainer = createFragmentContainer(ConsignmentsHome, {
  artists: graphql`
    fragment ConsignmentsHome_artists on Artist @relay(plural: true) {
      ...ArtistList_artists
    }
  `,
})

export const ConsignmentsHomeRenderer: React.FC = () => {
  return (
    <QueryRenderer<ConsignmentsHomeQuery>
      environment={defaultEnvironment}
      variables={{ artistIDs: FOCUSED_20_ARTIST_IDS }}
      query={graphql`
        query ConsignmentsHomeQuery($artistIDs: [String!]!) {
          artists(ids: $artistIDs) {
            ...ConsignmentsHome_artists
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: ConsignmentsHomeContainer,
        renderPlaceholder: () => <ConsignmentsHomePlaceholder />,
      })}
    />
  )
}

const ConsignmentsHomePlaceholder: React.FC = () => {
  return <Sans size="5">Coming soon: a placeholder.</Sans>
}
