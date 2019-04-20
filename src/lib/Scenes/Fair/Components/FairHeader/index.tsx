import { Box, Flex, Sans, space, Spacer } from "@artsy/palette"
import { FairHeader_fair } from "__generated__/FairHeader_fair.graphql"
import { EntityList } from "lib/Components/EntityList"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, Track, track as _track } from "lib/utils/track"
import { uniq } from "lodash"
import React from "react"
import { Dimensions, Image } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { CountdownTimer } from "./CountdownTimer"

interface Props {
  fair: FairHeader_fair
  onSaveShowPressed?: () => Promise<void>
  relay: RelayProp
}

interface State {
  isSavedFairStateUpdating: boolean
}

const BackgroundImage = styled(OpaqueImageView)<{ height: number; width: number }>`
  position: absolute;
  height: 100%;
  width: 100%;
`

// Set background color of overlay based on logo color
const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
`

const Logo = styled(Image)`
  width: 140;
  height: 140;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  margin-bottom: ${space(1)};
  /* stylelint-disable */
  tint-color: white;
`

const CountdownContainer = styled.View`
  position: absolute;
  bottom: ${space(4)};
  left: 0;
  width: 100%;
`

const track: Track<Props, State> = _track

@track()
export class FairHeader extends React.Component<Props, State> {
  state = { isSavedFairStateUpdating: false }

  viewAllArtists() {
    SwitchBoard.presentNavigationViewController(this, `/fair/${this.props.fair.gravityID}/artists`)
  }

  viewAllExhibitors() {
    SwitchBoard.presentNavigationViewController(this, `/fair/${this.props.fair.gravityID}/exhibitors`)
  }

  getContextualDetails() {
    const { followed_content, artists_names, counts } = this.props.fair
    const fairfollowedArtistList = (followed_content && followed_content.artists) || []
    const artistList = artists_names.edges.map(i => i.node).filter(Boolean)
    const uniqArtistList = uniq(fairfollowedArtistList.concat(artistList))

    return (
      <>
        <EntityList
          prefix="Works by"
          list={uniqArtistList}
          count={counts.artists}
          displayedItems={3}
          onItemSelected={this.handleArtistPress.bind(this)}
          onViewAllPressed={this.viewAllArtists.bind(this)}
        />
      </>
    )
  }

  @track((__, _, args) => {
    const slug = args[1]
    const id = args[2]
    return {
      action_name: Schema.ActionNames.ContextualGallery,
      action_type: Schema.ActionTypes.Tap,
      owner_id: id,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Gallery,
    } as any
  })
  handleExhibitorPress(href, _slug, _id) {
    SwitchBoard.presentNavigationViewController(this, `${href}?entity=fair-booth`)
  }

  @track((__, _, args) => {
    const slug = args[1]
    const id = args[2]
    return {
      action_name: Schema.ActionNames.ContextualArtist,
      action_type: Schema.ActionTypes.Tap,
      owner_id: id,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  handleArtistPress(href, _slug, _id) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  render() {
    const {
      fair: { image, name, profile, start_at, end_at, exhibition_period, formattedOpeningHours },
    } = this.props
    const { width: screenWidth } = Dimensions.get("window")
    const imageHeight = 567

    return (
      <>
        <Box style={{ height: imageHeight, width: screenWidth, position: "relative" }}>
          {!!image && <BackgroundImage imageURL={image.url} height={imageHeight} width={screenWidth} />}
          <Overlay />
          <Flex flexDirection="row" justifyContent="center" alignItems="center" px={2} height={imageHeight}>
            <Flex alignItems="center" flexDirection="column" flexGrow={1}>
              {!!profile && <Logo source={{ uri: profile.icon.url }} resizeMode="contain" />}
              <Sans size="3t" weight="medium" textAlign="center" color="white100">
                {name}
              </Sans>
              {!!exhibition_period && (
                <Sans size="3" textAlign="center" color="white100">
                  {exhibition_period}
                </Sans>
              )}
            </Flex>
          </Flex>
          {!!start_at &&
            !!end_at && (
              <CountdownContainer>
                <CountdownTimer startAt={start_at} endAt={end_at} formattedOpeningHours={formattedOpeningHours} />
              </CountdownContainer>
            )}
        </Box>
        <Spacer mt={2} />
        <Box mx={2} mb={2}>
          {this.getContextualDetails()}
        </Box>
      </>
    )
  }
}

export const FairHeaderContainer = createFragmentContainer(FairHeader, {
  fair: graphql`
    fragment FairHeader_fair on Fair {
      gravityID
      _id
      name
      formattedOpeningHours
      counts {
        artists
        partners
      }
      followed_content {
        artists {
          name
          href
          gravityID
          _id
        }
        galleries {
          _id
          name
        }
      }
      partner_names: shows_connection(first: 2) {
        edges {
          node {
            gravityID
            partner {
              ... on Partner {
                profile {
                  name
                  gravityID
                  _id
                }
              }
            }
          }
        }
      }
      artists_names: artists(first: 3) {
        edges {
          node {
            name
            href
            gravityID
            _id
          }
        }
      }

      image {
        image_url
        aspect_ratio
        url
      }

      profile {
        icon {
          gravityID
          href
          height
          width
          url(version: "square140")
        }
        id
        gravityID
        name
        is_followed
      }

      start_at
      end_at
      exhibition_period
    }
  `,
})
