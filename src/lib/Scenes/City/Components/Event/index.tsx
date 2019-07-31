import { Box, Button, color, Flex, Sans, Serif } from "@artsy/palette"
import { EventMutation } from "__generated__/EventMutation.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ExhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { Show } from "lib/Scenes/Map/types"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

const TextContainer = styled(Box)`
  width: 200;
`

interface Props {
  relay: RelayProp
  event: Show
  section?: string
}

interface State {
  isFollowedSaving: boolean
}

const track: Track<Props, {}> = _track

@track()
export class Event extends React.Component<Props, State> {
  state = {
    isFollowedSaving: false,
  }

  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedSaving: false,
    })
  }

  @track(props => {
    const { slug, internalID, is_followed } = props.event
    const { section } = props
    let actionName
    if (!!section && section === "bmw") {
      actionName = is_followed ? Schema.ActionNames.UnsaveBMWShow : Schema.ActionNames.SaveBMWShow
    } else {
      actionName = is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow
    }
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Success,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: internalID,
      owner_slug: slug,
    } as any
  })
  handleSaveChange() {
    const node = this.props.event
    const { slug: showSlug, id: nodeID, internalID: showID, is_followed: isShowFollowed } = node

    if (showID && showSlug && nodeID && !this.state.isFollowedSaving) {
      this.setState(
        {
          isFollowedSaving: true,
        },
        () => {
          return commitMutation<EventMutation>(this.props.relay.environment, {
            onCompleted: () => this.handleShowSuccessfullyUpdated(),
            mutation: graphql`
              mutation EventMutation($input: FollowShowInput!) {
                followShow(input: $input) {
                  show {
                    slug
                    internalID
                    is_followed: isFollowed
                  }
                }
              }
            `,
            variables: {
              input: {
                partnerShowID: showID,
                unfollow: isShowFollowed,
              },
            },
            optimisticResponse: {
              followShow: {
                show: {
                  slug: showSlug,
                  internalID: showID,
                  is_followed: !isShowFollowed,
                },
              },
            },
            updater: store => {
              store.get(nodeID).setValue(!isShowFollowed, "is_followed")
            },
          })
        }
      )
    }
  }

  @track((__, _, args) => {
    const actionName = args[0]
    const slug = args[1]
    const id = args[2]
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: id,
      owner_slug: slug,
    } as any
  })
  trackShowTap(_actionName, _slug, _internalID) {
    return null
  }

  handleTap = () => {
    const { section } = this.props
    const { slug, internalID } = this.props.event
    if (section === "bmw") {
      this.trackShowTap(Schema.ActionNames.OpenBMWShow, slug, internalID)
    }
    SwitchBoard.presentNavigationViewController(this, `/show/${slug}`)
  }

  render() {
    const node = this.props.event
    const { name, exhibition_period, partner, cover_image, is_followed, end_at } = node
    const { name: partnerName } = partner
    const { isFollowedSaving } = this.state
    const url = cover_image ? cover_image.url : null
    return (
      <TouchableWithoutFeedback onPress={() => this.handleTap()}>
        <Box mb={2} px={2}>
          {!!url && (
            <Box mb={2}>
              <OpaqueImageView imageURL={url} height={145} />
            </Box>
          )}
          <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
            <TextContainer mb={2}>
              <Sans size="3" weight="medium" numberOfLines={1} ellipsizeMode="tail">
                {partnerName}
              </Sans>
              <Serif size="3t" numberOfLines={1} ellipsizeMode="tail">
                {name}
              </Serif>
              {!!exhibition_period && (
                <Sans size="2" color={color("black60")}>
                  {ExhibitionDates(exhibition_period, end_at)}
                </Sans>
              )}
            </TextContainer>
            <Button
              variant={is_followed ? "secondaryOutline" : "primaryBlack"}
              loading={isFollowedSaving}
              onPress={() => this.handleSaveChange()}
              longestText="Saved"
              size="small"
            >
              {is_followed ? "Saved" : "Save"}
            </Button>
          </Flex>
        </Box>
      </TouchableWithoutFeedback>
    )
  }
}
