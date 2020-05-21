import { Box, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import React from "react"

export const RecentlySold: React.FC = () => {
  return (
    <>
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
    </>
  )
}
