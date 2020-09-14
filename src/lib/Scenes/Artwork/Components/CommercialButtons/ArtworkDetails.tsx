import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import ChevronIcon from "lib/Icons/ChevronIcon"
import { Flex, Separator, Text } from "palette"
import React, { useState } from "react"
import { LayoutAnimation, TouchableOpacity } from "react-native"

interface ArtworkProps {
  artwork: any
}

const makeRow = (name: string, value: string) => (
  <Flex flexDirection="row" mb={1}>
    <Text style={{ flex: 1 }}>{name}</Text>
    <Text color="black60" style={{ flex: 1, flexGrow: 3 }}>
      {value}
    </Text>
  </Flex>
)

export const ArtworkDetails: React.FC<ArtworkProps> = ({ artwork }) => {
  const [isExpanded, setExpanded] = useState(false)
  const toggleExpanded = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
    setExpanded(!isExpanded)
  }
  console.log(artwork)
  return (
    <>
      <TouchableOpacity onPress={() => toggleExpanded()}>
        <Flex flexDirection="row" padding={2}>
          <OpaqueImageView height={40} imageURL={artwork.imageUrl} width={40} />
          <Flex ml={2} style={{ flex: 1 }}>
            <Text mb={0.25}>{artwork.artist.name}</Text>
            <Text color="black60" variant="caption">
              {artwork.title}
            </Text>
          </Flex>
          <ChevronIcon color="black" expanded={isExpanded} initialDirection="down" />
        </Flex>
      </TouchableOpacity>
      {isExpanded && (
        <Flex mx={2} mb={1}>
          {makeRow("Materials", artwork.medium)}
          {makeRow("Size", artwork.dimensions.in + "\n" + artwork.dimensions.cm)}
          {!!artwork.availability && makeRow("Availability", artwork.availability)}
          {!!artwork.signatureInfo && makeRow("Availability", artwork.signatureInfo.details)}
        </Flex>
      )}
      <Separator />
    </>
  )
}
