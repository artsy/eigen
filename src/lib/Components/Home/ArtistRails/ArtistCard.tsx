import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Button, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import colors from "lib/data/colors"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { compact, floor } from "lodash"
import styled from "styled-components/native"

const CARD_WIDTH = 270

interface Props {
  artist: ArtistCard_artist
  onFollow?: (completion: (followStatus: boolean) => void) => void
}

interface State {
  processingChange: boolean
  following?: boolean
}

export class ArtistCard extends React.Component<Props, State> {
  state = {
    processingChange: false,
    following: null,
  }

  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href)
  }

  handleFollowChange = () => {
    this.setState({ processingChange: true })
    this.props.onFollow((followStatus: boolean) => {
      this.setState({ processingChange: false, following: followStatus })
    })
  }

  render() {
    const artist = this.props.artist
    const avatarImageURL = artist.avatar && artist.avatar.url
    const artworkImages = compact(artist.artworksConnection.edges.map(edge => edge.node.image?.url))
    // Subtract the number of artwork images (less one) to provide a 1px separation between each image.
    // We need to floor this because the RN layout doesn't handle fractional pixels well. To get
    // consistent spacing between the images, we'll also use a Spacer component. Any extra pixels get
    // pushed off to the right.
    const artworkImageWidth = floor((CARD_WIDTH - artworkImages.length + 1) / artworkImages.length)

    return (
      <View>
        <Card onPress={this.handleTap.bind(this)}>
          <View>
            <ArtworkImageContainer>
              {artworkImages.length ? (
                <Join separator={<Spacer mr="1px" />}>
                  {artworkImages.map((url, index) => (
                    <ImageView key={index} imageURL={url} width={artworkImageWidth} height={130} />
                  ))}
                </Join>
              ) : (
                /* Show an empty image block if there are no images for this artist */
                <ImageView imageURL={null} width={CARD_WIDTH} height={130} />
              )}
            </ArtworkImageContainer>
            <MetadataContainer>
              <ArtistAvatar>
                <ImageView imageURL={avatarImageURL} width={40} height={40} />
              </ArtistAvatar>
              <Flex flexDirection="column" ml={10} mr={2}>
                <Sans size="3t" weight="medium" numberOfLines={1}>
                  {artist.name}
                </Sans>
                <Sans size="3t" numberOfLines={1}>
                  {artist.formattedNationalityAndBirthday}
                </Sans>
              </Flex>
            </MetadataContainer>
            <FollowButtonContainer>
              <Button
                variant={this.state.following ? "secondaryOutline" : "secondaryGray"}
                onPress={this.handleFollowChange}
                size="small"
                block
                loading={this.state.processingChange}
              >
                {this.state.following ? "Following" : "Follow"}
              </Button>
            </FollowButtonContainer>
          </View>
        </Card>
      </View>
    )
  }
}

const Card = styled.TouchableHighlight.attrs({ underlayColor: "transparent" })`
  width: ${CARD_WIDTH}px;
  margin-left: 15px;
  border: 1px solid ${colors["gray-regular"]};
  border-radius: 4px;
  overflow: hidden;
`

const ArtworkImageContainer = styled.View`
  width: 100%;
  height: 130px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ArtistAvatar = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
`

const MetadataContainer = styled.View`
  margin: 15px 16px 0;
  flex-direction: row;
`

const FollowButtonContainer = styled.View`
  margin: 12px 16px;
`

export const ArtistCardContainer = createFragmentContainer(ArtistCard, {
  artist: graphql`
    fragment ArtistCard_artist on Artist {
      id
      slug
      internalID
      href
      name
      formattedNationalityAndBirthday
      avatar: image {
        url(version: "small")
      }
      artworksConnection(first: 3) {
        edges {
          node {
            image {
              url(version: "small")
            }
          }
        }
      }
    }
  `,
})
