import React from "react"

import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { ShowHeader_show } from "__generated__/ShowHeader_show.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import { createFragmentContainer, graphql } from "react-relay"

import { Carousel } from "./Components/Carousel"

interface Props {
  show: ShowHeader_show
  onSaveShowPressed: () => Promise<void>
  onMoreInformationPressed: () => void
}

export class ShowHeader extends React.Component<Props> {
  render() {
    const {
      show: { images, name, partner, exhibition_period, description },
      onSaveShowPressed,
    } = this.props

    const hasImages = !!images.length

    return (
      <>
        <Box px={2} pt={hasImages ? 3 : 150} pb={hasImages ? 0 : 150}>
          <Spacer m={2} />
          <Sans size="3" mb={0.5}>
            {partner.name}
          </Sans>
          <Serif size="8" lineHeight={34}>
            {name}
          </Serif>
          <Sans size="3">{exhibition_period}</Sans>
        </Box>
        {hasImages && (
          <Carousel
            sources={(images || []).map(({ url: imageURL, aspect_ratio: aspectRatio }) => ({ imageURL, aspectRatio }))}
          />
        )}
        <Box px={2}>
          <Spacer m={2} />
          <InvertedButton
            text="Save show"
            onPress={() => {
              onSaveShowPressed()
            }}
          />
          <Spacer m={1} />
          <Serif size="3t">{description}</Serif>
          <Spacer m={1} />
          <Sans size="3" weight="medium">
            View more information
          </Sans>
        </Box>
      </>
    )
  }
}

export const ShowHeaderContainer = createFragmentContainer(
  ShowHeader,
  graphql`
    fragment ShowHeader_show on Show {
      name
      description
      press_release
      exhibition_period
      status
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
      images {
        url
        aspect_ratio
      }
    }
  `
)
