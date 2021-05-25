import { SectionTitle } from "lib/Components/SectionTitle"
import { Box, Flex, Sans, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { View } from "react-native"
import { ScrollView } from "react-native"

export interface ShipsToSectionProps {
  artwork: any
}

export const ShipsToSection: React.FC<ShipsToSectionProps> = ({ artwork }) => {
  console.log(artwork, "artwork")

  return (
    <ScrollView>
      <SectionTitle title={`Ships to ${artwork?.partner.name}`} />

      <Box style={{ marginHorizontal: 22 }}>
        <Text>{}</Text>
      </Box>
    </ScrollView>
  )
}
