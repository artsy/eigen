import { Flex, FlexProps, Text, TextProps } from "@artsy/palette-mobile"
import { ArtworkDetailSection_artwork$key } from "__generated__/ArtworkDetailSection_artwork.graphql"
import { useArtworkDimensions } from "app/utils/hooks/useArtworkDimensions"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface ArtworkDetailSectionProps {
  artwork: ArtworkDetailSection_artwork$key
}

export const ArtworkDetailSection: FC<ArtworkDetailSectionProps> = ({ artwork }) => {
  const data = useFragment(fragment, artwork)
  const { regularDimensionText, framedDimensionText, hasFramedDimensions } = useArtworkDimensions({
    dimensions: data.dimensions,
    framedDimensions: data.framedDimensions,
  })

  const {
    medium,
    attributionClass,
    mediumType,
    condition,
    signatureInfo,
    certificateOfAuthenticity,
    publisher,
    isFramed,
  } = data

  return (
    <Flex gap={1}>
      <Flex flexDirection="row">
        <Text {...labelStyle}>Materials</Text>
        <Text {...valueStyle}>{medium}</Text>
      </Flex>

      {!!regularDimensionText && (
        <Flex flexDirection="row">
          <Text {...labelStyle}>Dimensions</Text>
          <Text {...valueStyle}>{regularDimensionText}</Text>
        </Flex>
      )}

      {!!hasFramedDimensions && !!framedDimensionText && (
        <Flex flexDirection="row">
          <Text {...labelStyle}>Framed Dimensions</Text>
          <Text {...valueStyle}>{framedDimensionText}</Text>
        </Flex>
      )}

      <Flex flexDirection="row">
        <Text {...labelStyle}>Rarity</Text>
        <Text {...valueStyle}>{attributionClass?.name}</Text>
      </Flex>

      {!!mediumType?.name && (
        <Flex flexDirection="row" width="100%">
          <Text {...labelStyle}>Medium</Text>
          <Text {...valueStyle}>{mediumType.name}</Text>
        </Flex>
      )}

      {!!condition?.displayText && (
        <Flex flexDirection="row">
          <Text {...labelStyle}>Condition</Text>
          <Text {...valueStyle}>{condition.displayText}</Text>
        </Flex>
      )}

      {!!signatureInfo?.details && (
        <Flex flexDirection="row">
          <Text {...labelStyle}>Signature</Text>
          <Text {...valueStyle}>{signatureInfo.details}</Text>
        </Flex>
      )}

      {!!certificateOfAuthenticity?.details && (
        <Flex flexDirection="row">
          <Text {...labelStyle}>Certificate of Authenticity</Text>
          <Text {...valueStyle}>{certificateOfAuthenticity.details}</Text>
        </Flex>
      )}

      {!!publisher && (
        <Flex flexDirection="row">
          <Text {...labelStyle}>Publisher</Text>
          <Text {...valueStyle}>{publisher}</Text>
        </Flex>
      )}

      <Flex flexDirection="row">
        <Text {...labelStyle}>Frame</Text>
        <Text {...valueStyle}>{isFramed ? "Frame included" : "Frame not included"}</Text>
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtworkDetailSection_artwork on Artwork {
    medium
    dimensions {
      in
      cm
    }
    framedDimensions {
      in
      cm
    }
    attributionClass {
      name
    }
    mediumType {
      name
    }
    condition {
      displayText
    }
    signatureInfo {
      details
    }
    certificateOfAuthenticity {
      details
    }
    publisher
    isFramed
  }
`

export const labelStyle = {
  width: "35%",
  variant: "xs",
  color: "mono60",
} satisfies TextProps | FlexProps

export const valueStyle = {
  width: "65%",
  variant: "xs",
} satisfies TextProps | FlexProps
