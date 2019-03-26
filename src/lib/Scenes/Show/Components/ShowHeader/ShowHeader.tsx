import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { ShowHeader_show } from "__generated__/ShowHeader_show.graphql"
import { ShowHeaderFollowShowMutation } from "__generated__/ShowHeaderFollowShowMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import { EntityList } from "lib/Components/EntityList"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ExhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { Schema, Track, track as _track } from "lib/utils/track"
import { uniq } from "lodash"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { Carousel } from "./Components/Carousel"

interface Props {
  show: ShowHeader_show
  relay: RelayProp
}

interface State {
  isFollowedSaving: boolean
}

const ButtonWrapper = styled(Box)`
  width: 100%;
  height: 85;
`

const track: Track<Props, State> = _track

@track()
export class ShowHeader extends React.Component<Props, State> {
  state = { isFollowedSaving: false }

  handlePartnerTitleClick = () => {
    const { show } = this.props
    if (show.isStubShow) {
      return
    }
    SwitchBoard.presentNavigationViewController(this, `${show.partner.href}?entity=gallery`)
  }

  handleFollowShow = () => {
    const {
      relay,
      show: { id: showSlugID, __id: relayID, _id: showID, is_followed: isShowFollowed },
    } = this.props

    this.setState(
      {
        isFollowedSaving: true,
      },
      () => {
        commitMutation<ShowHeaderFollowShowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          mutation: graphql`
            mutation ShowHeaderFollowShowMutation($input: FollowShowInput!) {
              followShow(input: $input) {
                show {
                  id
                  _id
                  is_followed
                }
              }
            }
          `,
          variables: {
            input: {
              partner_show_id: showID,
              unfollow: isShowFollowed,
            },
          },
          optimisticResponse: {
            followShow: {
              show: {
                _id: showID,
                is_followed: !isShowFollowed,
                id: showSlugID,
              },
            },
          },
          updater: store => {
            store.get(relayID).setValue(!isShowFollowed, "is_followed")
          },
        })
      }
    )
  }

  @track(props => ({
    action_name: props.show.is_followed ? Schema.ActionNames.SaveShow : Schema.ActionNames.UnsaveShow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.show._id,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedSaving: false,
    })
  }

  @track(props => ({
    action_name: Schema.ActionNames.CarouselSwipe,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show._id,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  handleUserSwipingCarousel() {
    return null
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
  handleArtistSelected(url, _slug, _id) {
    SwitchBoard.presentNavigationViewController(this, url)
  }

  handleViewAllArtistsPressed() {
    SwitchBoard.presentNavigationViewController(this, `/show/${this.props.show.id}/artists`)
  }

  render() {
    const { isFollowedSaving } = this.state
    const {
      show: { artists, images, is_followed, name, partner, followedArtists, end_at, exhibition_period },
    } = this.props
    const fairfollowedArtistList =
      (followedArtists && followedArtists.edges && followedArtists.edges.map(fa => fa.node.artist)) || []
    const uniqArtistList = uniq(fairfollowedArtistList.concat(artists))
    const hasImages = !!images.length
    const singleImage = hasImages && images.length === 1

    return (
      <>
        <Box px={2} pt={5} pb={hasImages ? 0 : 4}>
          <Spacer m={2} />
          <TouchableWithoutFeedback onPress={this.handlePartnerTitleClick}>
            <Sans size="3" mb={0.5} weight="medium">
              {partner.name}
            </Sans>
          </TouchableWithoutFeedback>
          <Serif size="8" lineHeight={34}>
            {name}
          </Serif>
          {!!exhibition_period && <Sans size="3">{ExhibitionDates(exhibition_period, end_at)}</Sans>}
        </Box>
        {!!hasImages &&
          !singleImage && (
            <Carousel
              sources={(images || []).map(({ url: imageURL, aspect_ratio: aspectRatio }) => ({
                imageURL,
                aspectRatio,
              }))}
              onScrollEndDrag={e => {
                if (e.nativeEvent.velocity.x > 0) {
                  this.handleUserSwipingCarousel()
                }
              }}
            />
          )}
        {!!singleImage && (
          <Box px={2} py={2}>
            <OpaqueImageView imageURL={images[0].url} aspectRatio={images[0].aspect_ratio} />
          </Box>
        )}
        <Box px={2}>
          <EntityList
            prefix="Works by"
            list={uniqArtistList}
            count={artists.length}
            displayedItems={3}
            onItemSelected={this.handleArtistSelected.bind(this)}
            onViewAllPressed={this.handleViewAllArtistsPressed.bind(this)}
          />
          <ButtonWrapper>
            <Spacer m={1} mt={1} />
            <InvertedButton
              inProgress={isFollowedSaving}
              text={is_followed ? "Show saved" : "Save show"}
              selected={is_followed}
              onPress={this.handleFollowShow}
              grayBorder={true}
            />
            <Spacer m={1} />
          </ButtonWrapper>
        </Box>
      </>
    )
  }
}

export const ShowHeaderContainer = createFragmentContainer(
  ShowHeader,
  graphql`
    fragment ShowHeader_show on Show {
      id
      _id
      __id
      name
      press_release
      is_followed
      end_at
      exhibition_period
      status
      isStubShow
      partner {
        ... on Partner {
          name
          id
          href
        }
      }
      images {
        url
        aspect_ratio
      }
      followedArtists(first: 3) {
        edges {
          node {
            artist {
              name
              href
              id
              _id
            }
          }
        }
      }
      artists {
        name
        href
        id
        _id
      }
    }
  `
)
