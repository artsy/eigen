import { Spacer, Flex, Box, Text, Join } from "@artsy/palette-mobile"
import { ArtworkDetails_artwork$key } from "__generated__/ArtworkDetails_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, useFragment } from "react-relay"
import { ArtworkDetailsRow } from "./ArtworkDetailsRow"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

// Number of items to display when read more is visible
const COLLAPSED_COUNT = 4

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork$key
  showReadMore?: boolean
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({
  artwork,
  showReadMore = false,
}) => {
  const artworkData = useFragment(artworkDetailsFragment, artwork)

  const listItems = [
    {
      title: "Medium",
      value: artworkData?.mediumType?.name && (
        <TouchableWithoutFeedback onPress={() => navigate(`/artwork/${artworkData.slug}/medium`)}>
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
      title: "Edition",
      value: (artworkData.editionSets ?? []).length < 2 ? artworkData.editionOf : null,
    },
    {
      title: "Condition",
      value: artworkData?.canRequestLotConditionsReport ? (
        //  this is here to reset the margin that lives in the RequestConditionReport component
        //  https://github.com/artsy/eigen/blob/32c80bf3883cc1a1ce6016dce193b1e24822a57f/src/app/Scenes/Artwork/Components/RequestConditionReport.tsx#L122
        //  this is because the component is being used in many places we didn't remove the margin from there.
        <Flex mt={-1}>
          <RequestConditionReportQueryRenderer artworkID={artworkData.slug} />
        </Flex>
      ) : (
        artworkData?.conditionDescription?.details
      ),
    },
    {
      title: "Signature",
      value: artworkData?.signatureInfo?.details,
    },
    {
      title: "Series",
      value: artworkData?.series,
    },
    { title: "Publisher", value: artworkData?.publisher },
    { title: "Manufacturer", value: artworkData?.manufacturer },
    {
      title: "Image rights",
      value: artworkData?.imageRights,
    },
  ]

  const allDisplayItems = listItems.filter((item) => !!item.value)

  const [isCollapsed, setIsCollapsed] = React.useState(showReadMore && allDisplayItems.length > 3)

  const displayItems = isCollapsed ? allDisplayItems.slice(0, COLLAPSED_COUNT) : allDisplayItems

  if (!displayItems.length) {
    return null
  }

  return (
    <Box accessibilityLabel="Artwork Details">
      <Join separator={<Spacer y={1} />}>
        {displayItems.map((item, index) => (
          <ArtworkDetailsRow key={`${item.title}-${index}`} title={item.title} value={item.value} />
        ))}

        {!!isCollapsed && (
          <Text
            mt={1}
            variant="sm"
            color="black100"
            textAlign="center"
            underline
            onPress={() => setIsCollapsed(false)}
          >
            Read More
          </Text>
        )}
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
    editionSets {
      internalID
    }
  }
`
