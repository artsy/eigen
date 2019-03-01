import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import { SavedShowItemRow_show } from "__generated__/SavedShowItemRow_show.graphql"
import { SavedShowItemRowMutation } from "__generated__/SavedShowItemRowMutation.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import { dateRange } from "lib/utils/dateFormatter"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

interface Props {
  show: SavedShowItemRow_show
  relay?: RelayProp
}

interface State {
  isFollowedSaving: boolean
}

const track: Track<Props, {}> = _track

@track()
export class SavedShowItemRow extends React.Component<Props, State> {
  state = {
    isFollowedSaving: false,
  }

  handleTap() {
    Switchboard.presentNavigationViewController(this, `/show/${this.props.show.id}`)
  }

  @track(props => {
    const {
      show: { id: slug, _id, is_followed },
    } = props
    return {
      action_name: is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
      context_screen: Schema.PageNames.SavesAndFollows,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: _id,
      owner_slug: slug,
    } as any
  })
  handleSave() {
    const {
      show: { id: showSlug, __id: relayID, _id: showID, is_followed: isShowFollowed },
    } = this.props

    if (showID && showSlug && relayID && !this.state.isFollowedSaving) {
      this.setState(
        {
          isFollowedSaving: true,
        },
        () => {
          return commitMutation<SavedShowItemRowMutation>(this.props.relay.environment, {
            onCompleted: () => this.handleShowSuccessfullyUpdated(),
            mutation: graphql`
              mutation SavedShowItemRowMutation($input: FollowShowInput!) {
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
                  id: showSlug,
                  _id: showID,
                  is_followed: !isShowFollowed,
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
  }

  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedSaving: false,
    })
  }

  render() {
    const { show } = this.props
    const imageURL = show.cover_image && show.cover_image.url
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <Box py={2}>
          <Flex flexGrow="1" flexDirection="row" alignItems="center">
            <OpaqueImageView width={58} height={58} imageURL={imageURL} />
            <Flex flexDirection="column" flexGrow="1" width="197">
              {show.partner &&
                show.partner.name && (
                  <Sans size="3t" color="black" weight="medium" numberOfLines={1} ml={15}>
                    {show.partner.name}
                  </Sans>
                )}
              {show.name && (
                <TightendSerif size="3t" color={color("black60")} ml={15} numberOfLines={1}>
                  {show.name}
                </TightendSerif>
              )}
              {show.status && (
                <Sans size="3t" color={color("black60")} ml={15}>
                  {show.status.includes("closed")
                    ? show.status.charAt(0).toUpperCase() + show.status.slice(1)
                    : show.start_at && show.end_at && dateRange(show.start_at, show.end_at)}
                </Sans>
              )}
            </Flex>
            <TouchableWithoutFeedback onPress={() => this.handleSave()}>
              <Flex flexGrow="1">
                <Sans
                  weight="medium"
                  mb="30"
                  size="3"
                  color={show.is_followed ? color("black60") : color("purple100")}
                  textAlign="right"
                >
                  {show.is_followed ? "Saved" : "Save"}
                </Sans>
              </Flex>
            </TouchableWithoutFeedback>
          </Flex>
        </Box>
      </TouchableWithoutFeedback>
    )
  }
}
export const SavedShowItemRowContainer = createFragmentContainer(SavedShowItemRow, {
  show: graphql`
    fragment SavedShowItemRow_show on Show {
      id
      _id
      __id
      is_followed
      name
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
      href
      status
      cover_image {
        url
        aspect_ratio
      }
      start_at
      end_at
    }
  `,
})

const TightendSerif = styled(Serif)`
  top: 3;
`
