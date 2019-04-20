import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import { EventMutation } from "__generated__/EventMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
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
    const { gravityID, _id, is_followed } = props.event
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
      owner_id: _id,
      owner_slug: gravityID,
    } as any
  })
  handleSaveChange() {
    const node = this.props.event
    const { gravityID: showSlug, __id: nodeID, _id: showID, is_followed: isShowFollowed } = node

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
                    gravityID
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
                  gravityID: showSlug,
                  _id: showID,
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
  trackShowTap(_actionName, _slug, _id) {
    return null
  }

  handleTap = () => {
    const { section } = this.props
    const { gravityID, _id } = this.props.event
    if (section === "bmw") {
      this.trackShowTap(Schema.ActionNames.OpenBMWShow, gravityID, _id)
    }
    SwitchBoard.presentNavigationViewController(this, `/show/${gravityID}`)
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
            <Flex maxWidth={102} height={34} flexBasis="29%" flexDirection="row" flexGrow={1}>
              <InvertedButton
                grayBorder={true}
                text={is_followed ? "Saved" : "Save"}
                onPress={() => this.handleSaveChange()}
                selected={is_followed}
                inProgress={isFollowedSaving}
              />
            </Flex>
          </Flex>
        </Box>
      </TouchableWithoutFeedback>
    )
  }
}
