import { AuctionIcon, Box, Button, EditIcon, EnvelopeIcon, Flex, Sans, Separator, Spacer } from "@artsy/palette"
import React from "react"
import { ScrollView } from "react-native"

export const ConsignmentsHome = () => {
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
              <Flex flexDirection="row" mb={2}>
                <Flex flexDirection="row" alignItems="center" mr={2} width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
                <Flex flexDirection="row" alignItems="center" mr={2} width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
                <Flex flexDirection="row" alignItems="center" width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
              </Flex>
              <Flex flexDirection="row" mb={2}>
                <Flex flexDirection="row" alignItems="center" mr={2} width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
                <Flex flexDirection="row" alignItems="center" mr={2} width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
                <Flex flexDirection="row" alignItems="center" width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
              </Flex>
              <Flex flexDirection="row" mb={2}>
                <Flex flexDirection="row" alignItems="center" mr={2} width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
                <Flex flexDirection="row" alignItems="center" mr={2} width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
                <Flex flexDirection="row" alignItems="center" width="300">
                  <Box width={76} height={70} bg="black60" mr={1} />
                  <Sans size="4">Alex Katz</Sans>
                </Flex>
              </Flex>
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
