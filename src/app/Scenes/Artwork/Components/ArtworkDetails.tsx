import { ArtworkDetails_artwork$data } from "__generated__/ArtworkDetails_artwork.graphql"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { Box, Join, Spacer, Text } from "palette"
import React, { useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkDetailsRow } from "./ArtworkDetailsRow"
import { ArtworkMediumModalFragmentContainer } from "./ArtworkMediumModal"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork$data
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ artwork }) => {
  const enableLotConditionReport = useFeatureFlag("AROptionsLotConditionReport")
  const [showArtworkMediumModal, setShowArtworkMediumModal] = useState(false)

  const listItems = [
    {
      title: "Medium",
      value: !!artwork.mediumType ? (
        <TouchableWithoutFeedback onPress={() => setShowArtworkMediumModal(true)}>
          <Text color="black60" style={{ textDecorationLine: "underline" }}>
            {artwork.category}
          </Text>
        </TouchableWithoutFeedback>
      ) : (
        artwork.category
      ),
    },
    {
      title: "Condition",
      value:
        enableLotConditionReport && artwork.canRequestLotConditionsReport ? (
          <RequestConditionReportQueryRenderer artworkID={artwork.slug} />
        ) : (
          artwork.conditionDescription && artwork.conditionDescription.details
        ),
    },
    { title: "Signature", value: artwork.signatureInfo && artwork.signatureInfo.details },
    {
      title: "Certificate of Authenticity",
      value: artwork.certificateOfAuthenticity && artwork.certificateOfAuthenticity.details,
    },
    { title: "Frame", value: artwork.framed && artwork.framed.details },
    { title: "Series", value: artwork.series },
    { title: "Publisher", value: artwork.publisher },
    { title: "Manufacturer", value: artwork.manufacturer },
    { title: "Image rights", value: artwork.image_rights },
  ]

  const displayItems = listItems.filter((i) => i.value != null && i.value !== "")

  return (
    <Box>
      <Join separator={<Spacer my={1} />}>
        <Text variant="md">Artwork details</Text>
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
      <ArtworkMediumModalFragmentContainer
        artwork={artwork}
        visible={showArtworkMediumModal}
        onClose={() => setShowArtworkMediumModal(false)}
      />
    </Box>
  )
}

export const ArtworkDetailsFragmentContainer = createFragmentContainer(ArtworkDetails, {
  artwork: graphql`
    fragment ArtworkDetails_artwork on Artwork {
      ...ArtworkMediumModal_artwork
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
