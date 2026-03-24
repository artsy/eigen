import { Box, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkDetails_artwork$key } from "__generated__/ArtworkDetails_artwork.graphql"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useArtworkDimensions } from "app/utils/hooks/useArtworkDimensions"
import { Schema } from "app/utils/track"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkDetailsRow } from "./ArtworkDetailsRow"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

// Number of items to display when read more is visible
const COLLAPSED_COUNT = 3

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork$key
  showReadMore?: boolean
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({
  artwork,
  showReadMore = false,
}) => {
  const artworkData = useFragment(artworkDetailsFragment, artwork)
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const editionSets = artworkData.editionSets ?? []
  let dimensionsToUse = null
  let framedDimensionsToUse = null

  const getEditionSetDimensions = () => {
    const selectedEdition = editionSets.find((editionSet) => {
      return editionSet?.internalID === selectedEditionId
    })

    if (editionSets && editionSets.length === 1) {
      const singleEditionSet = editionSets[0]

      return {
        dimensions: singleEditionSet?.dimensions,
        framedDimensions: singleEditionSet?.framedDimensions,
      }
    }

    return {
      dimensions: selectedEdition?.dimensions,
      framedDimensions: selectedEdition?.framedDimensions,
    }
  }

  if (editionSets.length) {
    const { dimensions, framedDimensions } = getEditionSetDimensions()
    dimensionsToUse = dimensions
    framedDimensionsToUse = framedDimensions
  } else {
    dimensionsToUse = artworkData?.dimensions
    framedDimensionsToUse = artworkData?.framedDimensions
  }

  const { regularDimensionText, framedDimensionText, hasFramedDimensions, isFramedSizeEnabled } =
    useArtworkDimensions({ dimensions: dimensionsToUse, framedDimensions: framedDimensionsToUse })

  const shouldShowDimensions = isFramedSizeEnabled && hasFramedDimensions

  const listItems = [
    ...(shouldShowDimensions
      ? [
          {
            title: "Size",
            value: (
              <Text variant="xs" color="mono100">
                {regularDimensionText}
              </Text>
            ),
          },
          {
            title: "Framed Size",
            value: (
              <Text variant="xs" color="mono100">
                {framedDimensionText}
              </Text>
            ),
          },
        ]
      : []),
    {
      title: "Medium",
      value: artworkData?.mediumType?.name && (
        <RouterLink to={`/artwork/${artworkData.slug}/medium`} disablePrefetch>
          <Text variant="xs" color="mono100" style={{ textDecorationLine: "underline" }}>
            {artworkData?.mediumType?.name}
          </Text>
        </RouterLink>
      ),
    },
    {
      title: "Condition",
      value: artworkData?.canRequestLotConditionsReport ? (
        //  this is here to reset the margin that lives in the RequestConditionReport component
        //  https://github.com/artsy/eigen/blob/32c80bf3883cc1a1ce6016dce193b1e24822a57f/src/app/Scenes/Artwork/Components/RequestConditionReport.tsx#L122
        //  this is because the component is being used in many places we didn't remove the margin from there.
        <Flex mt={-1} testID="request-condition-report">
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
      title: "Certificate of Authenticity",
      value: artworkData?.certificateOfAuthenticity?.details && (
        <Text variant="xs" color="mono100">
          {artworkData?.certificateOfAuthenticity?.details}
        </Text>
      ),
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

  const [isCollapsed, setIsCollapsed] = React.useState(
    showReadMore && allDisplayItems.length > COLLAPSED_COUNT
  )

  const displayItems = isCollapsed ? allDisplayItems.slice(0, COLLAPSED_COUNT) : allDisplayItems

  const { trackEvent } = useTracking()

  const handleReadMoreTap = () => {
    const properties = {
      action_type: Schema.ActionTypes.Tap,
      context_module: "artworkDetails",
      subject: "Read more",
      type: "Link",
    }
    trackEvent(properties)
    setIsCollapsed(false)
  }

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
            ml={1}
            variant="xs"
            color="mono100"
            textAlign="center"
            underline
            onPress={() => handleReadMoreTap()}
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
    framedDimensions {
      in
      cm
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
      dimensions {
        cm
        in
      }
      framedDimensions {
        in
        cm
      }
    }
  }
`
