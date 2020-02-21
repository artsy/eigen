import React from "react"
import { Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Button, Sans } from "@artsy/palette"
import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import styled from "styled-components/native"
import { compact } from "lodash"

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
    const artworkImages = compact(artist.artworksConnection.edges.map(edge => edge.node.image.url))
    const artworkImageWidth = (CARD_WIDTH - (artworkImages.length - 1)) / artworkImages.length

    return (
      <View>
        <Card onPress={this.handleTap.bind(this)}>
          <View>
            <ArtworkImageContainer>
              {artworkImages.map((url, index) => (
                <ImageView key={index} imageURL={url} width={artworkImageWidth} height={130} />
              ))}
            </ArtworkImageContainer>
            <MetadataContainer>
              <ImageView imageURL={avatarImageURL} />
              <Sans size="3">TODO: Artist metadata will go here</Sans>
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
`

const ArtworkImageContainer = styled.View`
  width: 100%;
  height: 130px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const MetadataContainer = styled.View`
  margin: 15px 16px 0;
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
        url(version: "large")
      }
      artworksConnection(first: 3) {
        edges {
          node {
            image {
              url(version: "medium")
            }
          }
        }
      }
    }
  `,
})
