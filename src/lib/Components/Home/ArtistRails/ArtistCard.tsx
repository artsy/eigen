import React from "react"
import { ActivityIndicator, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { compact, floor } from "lodash"
import { Button, CloseIcon, color, Flex, Join, Sans, Touchable } from "palette"
import styled from "styled-components/native"
import { CARD_WIDTH, CardRailCard } from "../CardRailCard"

interface Props {
  artist: ArtistCard_artist
  onFollow?: (completion: (followStatus: boolean) => void) => void
  onTap?: () => void
  onDismiss?: () => Promise<void>
  showBasedOn?: boolean
}

interface State {
  processingChange: boolean
  following: boolean | null
  isDismissing: boolean
}

export class ArtistCard extends React.Component<Props, State> {
  state: State = {
    processingChange: false,
    following: this.props.artist.isFollowed,
    isDismissing: false,
  }

  didUnmount = false

  handleTap() {
    this.props.onTap?.()
    if (this.props.artist.href) {
      navigate(this.props.artist.href)
    }
  }

  handleFollowChange = () => {
    this.setState({ processingChange: true })
    this.props.onFollow?.((followStatus: boolean) => {
      this.setState({ processingChange: false, following: followStatus })
    })
  }

  componentWillUnmount() {
    this.didUnmount = true
  }

  handleDismiss = async () => {
    const p = this.props.onDismiss?.()
    if (p) {
      this.setState({ isDismissing: true })
      await p
      if (!this.didUnmount) {
        this.setState({ isDismissing: false })
      }
    }
  }

  render() {
    const artist = this.props.artist
    const avatarImageURL = artist.avatar && artist.avatar.url
    const artworkImages = compact(extractNodes(artist.artworksConnection, (artwork) => artwork.image?.url))
    // Subtract the number of artwork images (less one) to provide a 1px separation between each image.
    // We need to floor this because the RN layout doesn't handle fractional pixels well. To get
    // consistent spacing between the images, we'll also use a Spacer component. Any extra pixels get
    // pushed off to the right.
    const artworkImageWidth = floor((CARD_WIDTH - artworkImages.length + 1) / artworkImages.length)

    return (
      <View
        style={{ opacity: this.state.isDismissing ? 0.6 : 1 }}
        pointerEvents={this.state.isDismissing ? "none" : "auto"}
      >
        <CardRailCard onPress={this.handleTap.bind(this)}>
          <View>
            <ArtworkImageContainer>
              {artworkImages.length ? (
                <Join separator={<Division />}>
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
              <Flex flexDirection="column" ml={10} mr="2" justifyContent="center">
                <Sans size="3t" weight="medium" numberOfLines={1}>
                  {artist.name}
                </Sans>
                {Boolean(artist.formattedNationalityAndBirthday) && (
                  <Sans size="3t" numberOfLines={1} color="black60">
                    {artist.formattedNationalityAndBirthday}
                  </Sans>
                )}
              </Flex>
            </MetadataContainer>
            <FollowButtonContainer>
              <Button
                variant={this.state.following ? "secondaryOutline" : "secondaryGray"}
                onPress={this.handleFollowChange}
                size="small"
                block
                loading={this.state.processingChange}
                haptic
              >
                {this.state.following ? "Following" : "Follow"}
              </Button>
            </FollowButtonContainer>
          </View>
        </CardRailCard>
        {this.props.showBasedOn && artist.basedOn?.name ? (
          <Flex mt="1" flexDirection="row">
            <Sans size="2" color="black60">
              Based on{" "}
            </Sans>
            <Sans size="2" color="black60" weight="medium">
              {artist.basedOn.name}
            </Sans>
          </Flex>
        ) : null}
        {!!this.props.onDismiss && (
          <Touchable
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            activeOpacity={0.2}
            style={{
              backgroundColor: color("white100"),
              position: "absolute",
              top: 6,
              right: 6,
              overflow: "hidden",
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={this.handleDismiss}
          >
            {this.state.isDismissing ? (
              <ActivityIndicator style={{ transform: [{ scale: 0.8 }] }} />
            ) : (
              <CloseIcon fill="black60" width={16} height={16} />
            )}
          </Touchable>
        )}
      </View>
    )
  }
}

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

export const Division = styled.View`
  border: 1px solid white;
  width: 1px;
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
      basedOn {
        name
      }
      isFollowed
      artworksConnection(first: 3) {
        edges {
          node {
            image {
              url(version: "large")
            }
          }
        }
      }
    }
  `,
})
