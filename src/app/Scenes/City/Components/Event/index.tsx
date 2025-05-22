import { Box, Button, Flex, Image, Text } from "@artsy/palette-mobile"
import { EventMutation } from "__generated__/EventMutation.graphql"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"
import { Show } from "app/Scenes/Map/types"
import { navigate } from "app/system/navigation/navigate"
import { track as _track, Schema, Track } from "app/utils/track"
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

  @track((props) => {
    const { slug, internalID, is_followed } = props.event
    const actionName = is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow

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
            // @ts-ignore RELAY 12 MIGRATION
            optimisticResponse: {
              followShow: {
                show: {
                  slug: showSlug,
                  internalID: showID,
                  is_followed: !isShowFollowed,
                },
              },
            },
            updater: (store) => {
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  trackShowTap(_actionName, _slug, _internalID) {
    return null
  }

  handleTap = () => {
    const { slug } = this.props.event

    navigate(`/show/${slug}`)
  }

  render() {
    const node = this.props.event
    const { name, exhibition_period, partner, cover_image, is_followed, end_at } = node
    const partnerName = partner?.name
    const { isFollowedSaving } = this.state
    const url = cover_image ? cover_image.url : null
    return (
      <ThemeAwareClassTheme>
        {({ color }) => (
          <TouchableWithoutFeedback onPress={() => this.handleTap()}>
            <Box mb={2}>
              {!!url && (
                <Box mb={2} justifyContent="center" overflow="hidden">
                  <Image src={url} height={145} />
                </Box>
              )}
              <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
                <TextContainer mb={2}>
                  <Text variant="sm" weight="medium" numberOfLines={1} ellipsizeMode="tail">
                    {partnerName}
                  </Text>
                  <Text variant="sm" numberOfLines={1} ellipsizeMode="tail">
                    {name}
                  </Text>
                  {!!exhibition_period && !!end_at && (
                    <Text variant="xs" color={color("mono60")}>
                      {exhibitionDates(exhibition_period, end_at)}
                    </Text>
                  )}
                </TextContainer>
                <Button
                  variant={is_followed ? "outline" : "fillDark"}
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
        )}
      </ThemeAwareClassTheme>
    )
  }
}
