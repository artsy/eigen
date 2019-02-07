import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { ShowHeader_show } from "__generated__/ShowHeader_show.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import { EntityList } from "lib/Components/EntityList"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Dimensions } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { Carousel } from "./Components/Carousel"

interface Props {
  show: ShowHeader_show
  onSaveShowPressed: () => Promise<void>
  onViewAllArtistsPressed: () => void
}

const { height: windowHeight } = Dimensions.get("window")
export class ShowHeader extends React.Component<Props> {
  render() {
    const {
      show: { artists, images, name, partner, exhibition_period },
      onSaveShowPressed,
      onViewAllArtistsPressed,
    } = this.props

    const hasImages = !!images.length
    const noImagesPadding = windowHeight / 2 - 200

    return (
      <>
        <Box px={2} pt={hasImages ? 3 : noImagesPadding} pb={hasImages ? 0 : noImagesPadding}>
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
        <Box px={2} mb={2}>
          <EntityList
            prefix="Works by"
            list={artists}
            count={artists.length}
            displayedItems={2}
            onItemSelected={url => {
              SwitchBoard.presentNavigationViewController(this, url)
            }}
            onViewAllPressed={onViewAllArtistsPressed}
          />
          <Spacer mt={1} />
          <InvertedButton
            text="Save show"
            onPress={() => {
              onSaveShowPressed()
            }}
          />
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
      artists {
        name
        href
      }
    }
  `
)
