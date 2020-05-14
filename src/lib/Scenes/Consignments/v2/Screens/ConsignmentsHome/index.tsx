import { AuctionIcon, Box, Button, EditIcon, EnvelopeIcon, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import { ConsignmentsHome_artists } from "__generated__/ConsignmentsHome_artists.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useRef } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"
import SwitchBoard from "../../../../../NativeModules/SwitchBoard"
import { ArtistListFragmentContainer as ArtistList, FOCUSED_20_ARTIST_IDS } from "./ArtistList"

// TODO:
//  - build a placeholder

interface Props {
  artists: ConsignmentsHome_artists
}

export const ConsignmentsHome: React.FC<Props> = props => {
  const navRef = useRef<ScrollView>(null)
  const { artists } = props
  const handlePress = () => {
    if (navRef.current) {
      const route = "/collections/my-collection/artworks/new/submissions/new"
      SwitchBoard.presentModalViewController(navRef.current, route)
    }
  }

  return (
    <ScrollView ref={navRef}>
      <Box px={2} py={6}>
        <Box>
          <Sans size="8" textAlign="center" px={2}>
            Sell Art From Your Collection
          </Sans>

          <Spacer my={0.5} />

          <Sans size="4" textAlign="center">
            Reach art buyers all over the world.
          </Sans>
        </Box>

        <Spacer mb={2} />

        <Button variant="primaryBlack" block onPress={handlePress}>
          <Sans size="3" weight="medium">
            Start selling
          </Sans>
        </Button>
      </Box>

      <Separator my={3} />

      <Box px={2}>
        <Box>
          <Sans size="4" mb={2}>
            Recently sold with Artsy
          </Sans>

          <Flex flexDirection="row">
            <Join separator={<Spacer mr={0.5} />}>
              <ArtworkTileRailCard
                saleMessage="Sold for $6,400"
                artistNames="Kehinde Wiley"
                imageURL="https://d32dm0rphc51dk.cloudfront.net/JB8GqSuSHtsDHDIQ9nyPUw/square.jpg"
                key="1"
                onPress={() => {
                  console.log("hi")
                }}
              />
              <ArtworkTileRailCard
                saleMessage="Sold for $1,200"
                artistNames="Kehinde Wiley"
                imageURL="https://d32dm0rphc51dk.cloudfront.net/JB8GqSuSHtsDHDIQ9nyPUw/square.jpg"
                key="1"
                onPress={() => {
                  console.log("hi")
                }}
              />
              <ArtworkTileRailCard
                saleMessage="Sold for $3,100"
                artistNames="Kehinde Wiley"
                imageURL="https://d32dm0rphc51dk.cloudfront.net/JB8GqSuSHtsDHDIQ9nyPUw/square.jpg"
                key="1"
                onPress={() => {
                  console.log("hi")
                }}
              />
            </Join>
          </Flex>
        </Box>
      </Box>

      <Separator my={3} />

      <Box px={2}>
        <Sans size="8">How it works</Sans>

        <Spacer mb={2} />
        <Flex flexDirection="row">
          <Box pr={2}>
            <EditIcon width={30} height={30} />
          </Box>

          <FlexChildThatWontStretchOutsideOfParent>
            <Sans size="4">Submit Once</Sans>
            <Spacer mb={0.3} />
            <Sans color="black60" size="3t">
              With a single submission, you'll access art buyers around the world.
            </Sans>
          </FlexChildThatWontStretchOutsideOfParent>
        </Flex>
        <Spacer mb={2} />
        <Flex flexDirection="row">
          <Box pr={2}>
            <AuctionIcon width={30} height={30} />
          </Box>

          <FlexChildThatWontStretchOutsideOfParent>
            <Sans size="4">Make Your Sale</Sans>
            <Spacer mb={0.3} />
            <Sans color="black60" size="3t">
              Choose from several Artsy marketplace resale options.
            </Sans>
          </FlexChildThatWontStretchOutsideOfParent>
        </Flex>
        <Spacer mb={2} />
        <Flex flexDirection="row">
          <Box pr={2}>
            <EnvelopeIcon width={30} height={30} />
          </Box>

          <FlexChildThatWontStretchOutsideOfParent>
            <Sans size="4">Receive Payment</Sans>
            <Spacer mb={0.3} />
            <Sans color="black60" size="3t">
              Keep the work until it sells, ship it with our help, and receive payment.
            </Sans>
          </FlexChildThatWontStretchOutsideOfParent>
        </Flex>
      </Box>

      <Separator my={3} />

      <Box px={2}>
        <Box>
          <Sans size="4">Artists collectors are looking to buy</Sans>

          <Spacer mb={2} />

          <ScrollView horizontal>
            <ArtistList artists={artists} />
          </ScrollView>
        </Box>
      </Box>

      <Separator my={3} />

      <Box px={2} pb={6}>
        <Sans size="8">Why sell with Artsy?</Sans>

        <Spacer mb={2} />

        <Flex flexDirection="row">
          <NumberBox pl={0.5} pr={1}>
            <Sans size="4">1</Sans>
          </NumberBox>

          <FlexChildThatWontStretchOutsideOfParent>
            <Sans size="4">Simple Steps</Sans>
            <Spacer mb={0.3} />
            <Sans color="black60" size="3t">
              Submit your work once, pick the best offer, and ship the work when it sells.
            </Sans>
          </FlexChildThatWontStretchOutsideOfParent>
        </Flex>

        <Spacer mb={2} />

        <Flex flexDirection="row">
          <NumberBox pl={0.5} pr={1}>
            <Sans size="4">2</Sans>
          </NumberBox>

          <FlexChildThatWontStretchOutsideOfParent>
            <Sans size="4">Industry Expertise</Sans>
            <Spacer mb={0.3} />
            <Sans color="black60" size="3t">
              Receive virtual valuation and expert guidance on the best sales strategies.
            </Sans>
          </FlexChildThatWontStretchOutsideOfParent>
        </Flex>

        <Spacer mb={2} />

        <Flex flexDirection="row">
          <NumberBox pl={0.5} pr={1}>
            <Sans size="4">3</Sans>
          </NumberBox>

          <FlexChildThatWontStretchOutsideOfParent>
            <Sans size="4">Global Reach</Sans>
            <Spacer mb={0.3} />
            <Sans color="black60" size="3t">
              Your work will reach the world's collectors, galleries, and auction houses.
            </Sans>
          </FlexChildThatWontStretchOutsideOfParent>
        </Flex>

        <Spacer mb={3} />

        <Button variant="primaryBlack" block onPress={handlePress}>
          <Sans size="3">Start selling</Sans>
        </Button>
      </Box>
    </ScrollView>
  )
}

const FlexChildThatWontStretchOutsideOfParent = styled(Box)`
  flex: 1;
`

const NumberBox = styled(Box)`
  flex-basis: 30px;
  flex-shrink: 0;
  flex-grow: 0;
`

const ConsignmentsHomeContainer = createFragmentContainer(ConsignmentsHome, {
  artists: graphql`
    fragment ConsignmentsHome_artists on Artist @relay(plural: true) {
      ...ArtistList_artists
    }
  `,
})

export const ConsignmentsHomeQueryRenderer: React.FC = () => {
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
