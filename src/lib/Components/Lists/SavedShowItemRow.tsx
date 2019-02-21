import { Box, color, Flex, Sans, Separator } from "@artsy/palette"
import { SavedShowItemRowMutation } from "__generated__/SavedShowItemRowMutation.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, graphql, RelayProp } from "react-relay"

interface Props {
  __id: string
  _id: string
  id: string
  href: string
  name: string
  status: string
  images: {
    url: string
  }
  partner: {
    name: string
  }
  is_followed: boolean
  relayEnvironment: RelayProp
}

export default class SavedShowItemRow extends React.Component<Props> {
  handleTap() {
    Switchboard.presentNavigationViewController(this, this.props.href)
  }

  handleSave() {
    const { id: showSlug, __id: relayID, _id: showID, is_followed: isShowFollowed } = this.props

    if (showID && showSlug && relayID) {
      return commitMutation<SavedShowItemRowMutation>(this.props.relayEnvironment.environment, {
        mutation: graphql`
          mutation SavedShowItemRowMutation($input: FollowShowInput!) {
            followShow(input: $input) {
              show {
                id
                is_followed
                _id
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
              id: showSlug,
            },
          },
        },
        updater: store => {
          store.get(relayID).setValue(!isShowFollowed, "is_followed")
        },
      })
    }
  }

  render() {
    const item = this.props
    const imageURL = item.images[0] && item.images[0].url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <Box height="95" mx="20" mt="9">
          <Flex flexGrow="1" flexDirection="row" alignItems="center">
            <Box height="50" width="50" style={{ overflow: "hidden" }}>
              <OpaqueImageView width={50} height={50} imageURL={imageURL} />
            </Box>
            <Flex flexDirection="column" flexGrow="1" width="197">
              {item.partner &&
                item.partner.name && (
                  <Sans size="3" color="black" weight="medium" numberOfLines={1} ml="13">
                    {item.partner.name}
                  </Sans>
                )}
              {item.name && (
                <Sans size="2" color={color("black60")} ml="13" numberOfLines={1}>
                  {item.name}
                </Sans>
              )}
              {item.status && (
                <Sans size="2" color={color("black60")} ml="13">
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Sans>
              )}
            </Flex>
            <TouchableWithoutFeedback onPress={() => this.handleSave()}>
              <Flex flexGrow="1">
                <Sans weight="medium" mb="30" size="3" color={color("black60")} textAlign="right">
                  {item.is_followed ? "Saved" : "Save"}
                </Sans>
              </Flex>
            </TouchableWithoutFeedback>
          </Flex>
          <Separator />
        </Box>
      </TouchableWithoutFeedback>
    )
  }
}
