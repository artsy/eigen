import { Flex, Text } from "@artsy/palette-mobile"
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

  const metadata = [
    { label: "Materials", value: medium },
    { label: "Dimensions", value: regularDimensionText },
    { label: "Framed Dimensions", value: hasFramedDimensions ? framedDimensionText : null },
    { label: "Rarity", value: attributionClass?.name },
    { label: "Medium", value: mediumType?.name },
    { label: "Condition", value: condition?.displayText },
    { label: "Signature", value: signatureInfo?.details },
    { label: "Certificate of Authenticity", value: certificateOfAuthenticity?.details },
    { label: "Publisher", value: publisher },
    { label: "Frame", value: isFramed ? "Frame included" : "Frame not included" },
  ].filter(({ value }) => !!value)

  return (
    <Flex gap={1}>
      {metadata.map(({ label, value }) => (
        <Flex key={label} flexDirection="row">
          <Flex width="35%">
            <Text variant="xs" color="mono60">
              {label}
            </Text>
          </Flex>
          <Flex width="65%">
            <Text variant="xs">{value}</Text>
          </Flex>
        </Flex>
      ))}
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
