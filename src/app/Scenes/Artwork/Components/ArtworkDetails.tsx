import { ArtworkDetails_artwork$key } from "__generated__/ArtworkDetails_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { Box, Join, Spacer, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, useFragment } from "react-relay"
import { ArtworkDetailsRow } from "./ArtworkDetailsRow"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork$key
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ artwork }) => {
  const artworkData = useFragment(artworkDetailsFragment, artwork)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const listItems = [
    {
      title: "Medium",
      value: artworkData?.mediumType?.name && (
        <TouchableWithoutFeedback
          onPress={() => navigate(`/artwork/${artworkData.slug}/medium`, { modal: true })}
        >
          <Text variant="sm" color="black100" style={{ textDecorationLine: "underline" }}>
            {artworkData?.mediumType?.name}
          </Text>
        </TouchableWithoutFeedback>
      ),
    },
    {
      title: "Materials",
      value: artworkData?.medium,
    },
    {
      title: "Size",
      value: preferredMetric === "cm" ? artworkData?.dimensions?.cm : artworkData?.dimensions?.in,
    },
    {
      title: "Rarity",
      value: artworkData?.attributionClass?.name && (
        <TouchableWithoutFeedback
          onPress={() => navigate(`/artwork-classifications`, { modal: true })}
        >
          <Text variant="sm" color="black100" style={{ textDecorationLine: "underline" }}>
            {artworkData?.attributionClass?.name}
          </Text>
        </TouchableWithoutFeedback>
      ),
    },
    {
      title: "Edition",
      value: artworkData?.editionOf,
    },
    {
      title: "Certificate of Authenticity",
      value: artworkData?.certificateOfAuthenticity?.details && (
        <TouchableWithoutFeedback
          onPress={() => navigate(`/artwork-certificate-of-authenticity`, { modal: true })}
        >
          <Text variant="sm" color="black100" style={{ textDecorationLine: "underline" }}>
            {artworkData?.certificateOfAuthenticity?.details}
          </Text>
        </TouchableWithoutFeedback>
      ),
    },
    {
      title: "Condition",
      value: artworkData?.canRequestLotConditionsReport ? (
        <RequestConditionReportQueryRenderer artworkID={artworkData.slug} />
      ) : (
        artworkData?.conditionDescription?.details
      ),
    },
    {
      title: "Frame",
      value: artworkData?.framed?.details,
    },
    {
      title: "Signature",
      value: artworkData?.signatureInfo?.details,
    },
    {
      title: "Series",
      value: artworkData?.series,
    },
    { title: "Publisher", value: artworkData.publisher },
    { title: "Manufacturer", value: artworkData?.manufacturer },
    {
      title: "Image rights",
      value: artworkData?.imageRights,
    },
  ]

  const displayItems = listItems.filter((item) => !!item.value)

  return (
    <Box>
      <Join separator={<Spacer mt={1} />}>
        {displayItems.map((item, index) => (
          <ArtworkDetailsRow
            key={item.title + index.toString()}
            title={item.title}
            value={item.value}
          />
        ))}
      </Join>
    </Box>
  )
}

const artworkDetailsFragment = graphql`
  fragment ArtworkDetails_artwork on Artwork {
    slug
    mediumType {
      name
    }
    medium
    dimensions {
      cm
      in
    }
    attributionClass {
      name
    }
    certificateOfAuthenticity {
      label
      details
    }
    conditionDescription {
      label
      details
    }
    canRequestLotConditionsReport
    framed {
      label
      details
    }
    signatureInfo {
      label
      details
    }
    series
    publisher
    manufacturer
    imageRights
    editionOf
  }
`
