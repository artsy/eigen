import { defineMessages } from "@formatjs/intl"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { Box, Join, Spacer, Text } from "palette"
import React from "react"
import { useIntl } from "react-intl"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkDetailsRow } from "./ArtworkDetailsRow"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ artwork }) => {
  const enableLotConditionReport = useFeatureFlag("AROptionsLotConditionReport")
  const intl = useIntl()

  const itemTitles = defineMessages({
    medium: {
      id: "scene.artwork.components.artworkDetails.listItems.medium",
      defaultMessage: "Medium",
    },
    condition: {
      id: "scene.artwork.components.artworkDetails.listItems.condition",
      defaultMessage: "Condition",
    },
    signature: {
      id: "scene.artwork.components.artworkDetails.listItems.signature",
      defaultMessage: "Signature",
    },
    certificateOfAuthenticity: {
      id: "scene.artwork.components.artworkDetails.listItems.certificateOfAuthenticity",
      defaultMessage: "Certificate Of Authenticity",
    },
    frame: {
      id: "scene.artwork.components.artworkDetails.listItems.frame",
      defaultMessage: "Frame",
    },
    series: {
      id: "scene.artwork.components.artworkDetails.listItems.series",
      defaultMessage: "Series",
    },
    publisher: {
      id: "scene.artwork.components.artworkDetails.listItems.publisher",
      defaultMessage: "Publisher",
    },
    manufacturer: {
      id: "scene.artwork.components.artworkDetails.listItems.manufacturer",
      defaultMessage: "Manufacturer",
    },
    imageRights: {
      id: "scene.artwork.components.artworkDetails.listItems.imageRights",
      defaultMessage: "Image rights",
    },
  })

  const listItems = [
    {
      title: intl.formatMessage(itemTitles.medium),
      value: !!artwork.mediumType ? (
        <TouchableWithoutFeedback onPress={() => navigate(`/artwork/${artwork.slug}/medium`)}>
          <Text color="black60" style={{ textDecorationLine: "underline" }}>
            {artwork.category}
          </Text>
        </TouchableWithoutFeedback>
      ) : (
        artwork.category
      ),
    },
    {
      title: intl.formatMessage(itemTitles.condition),
      value:
        enableLotConditionReport && artwork.canRequestLotConditionsReport ? (
          <RequestConditionReportQueryRenderer artworkID={artwork.slug} />
        ) : (
          artwork.conditionDescription && artwork.conditionDescription.details
        ),
    },
    {
      title: intl.formatMessage(itemTitles.signature),
      value: artwork.signatureInfo && artwork.signatureInfo.details,
    },
    {
      title: intl.formatMessage(itemTitles.certificateOfAuthenticity),
      value: artwork.certificateOfAuthenticity && artwork.certificateOfAuthenticity.details,
    },
    {
      title: intl.formatMessage(itemTitles.frame),
      value: artwork.framed && artwork.framed.details,
    },
    { title: intl.formatMessage(itemTitles.series), value: artwork.series },
    { title: intl.formatMessage(itemTitles.publisher), value: artwork.publisher },
    { title: intl.formatMessage(itemTitles.manufacturer), value: artwork.manufacturer },
    { title: intl.formatMessage(itemTitles.imageRights), value: artwork.image_rights },
  ]

  const displayItems = listItems.filter((i) => i.value != null && i.value !== "")

  return (
    <Box>
      <Join separator={<Spacer my={1} />}>
        <Text variant="md">
          {intl.formatMessage({
            id: "scene.artwork.components.artworkDetails.artworkDetails",
            defaultMessage: "Artwork details",
          })}
        </Text>
        {displayItems.map(({ title, value }, index) => (
          <ArtworkDetailsRow
            key={index.toString()}
            title={title}
            value={value}
            tracking={{
              readMore: {
                flow: Schema.Flow.ArtworkDetails,
                contextModule: Schema.ContextModules.ArtworkDetails,
              },
            }}
          />
        ))}
      </Join>
    </Box>
  )
}

export const ArtworkDetailsFragmentContainer = createFragmentContainer(ArtworkDetails, {
  artwork: graphql`
    fragment ArtworkDetails_artwork on Artwork {
      slug
      category
      conditionDescription {
        label
        details
      }
      signatureInfo {
        label
        details
      }
      certificateOfAuthenticity {
        label
        details
      }
      framed {
        label
        details
      }
      series
      publisher
      manufacturer
      image_rights: imageRights
      canRequestLotConditionsReport
      mediumType {
        __typename
      }
    }
  `,
})
