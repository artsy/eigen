import { SectionTitle } from "lib/Components/SectionTitle"
import { Box, Flex, Sans, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { View } from "react-native"
import { ScrollView } from "react-native"

export interface ArtworkInfoSectionProps {
  artwork: any
}

export const ArtworkInfoSection: React.FC<ArtworkInfoSectionProps> = ({ artwork }) => {
  console.log(artwork, "artwork")

  return (
    <ScrollView>
      <SectionTitle title="Artwork Info" />
      <Box>
        {/* <Spacer mb={10} /> */}
        <Flex>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 14 }}>
            <Box style={{ marginHorizontal: 22 }}>
              <Text>asd</Text>
              <Image source={{ uri: artwork?.image?.resized?.url }} style={{ height: 50, width: 50 }} />
            </Box>
            <Box style={{ flex: 1, flexShrink: 1 }}>
              <Box mb={10}>
                <Sans size="3t" numberOfLines={1} weight="medium">
                  {artwork?.artist_names}
                </Sans>
              </Box>
              <Text color="black60">{artwork?.title}</Text>
            </Box>
          </View>
        </Flex>
      </Box>
    </ScrollView>
  )
}
