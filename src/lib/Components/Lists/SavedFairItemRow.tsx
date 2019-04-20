import { Box, color, Flex, Sans, Separator } from "@artsy/palette"
import { Fairs_me } from "__generated__/Fairs_me.graphql"
import { SavedFairItemRowMutation } from "__generated__/SavedFairItemRowMutation.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, graphql, RelayProp } from "react-relay"

interface State {
  isSaved: boolean
}

interface Props {
  node: Fairs_me["followsAndSaves"]["fairs"]["edges"][0]["node"]
  relayEnvironment: RelayProp
}

export default class SavedFairItemRow extends React.Component<Props, State> {
  state = {
    isSaved: true,
  }

  handleTap() {
    Switchboard.presentNavigationViewController(this, this.props.node.href)
  }

  handleSave(fairProfileID, fairID) {
    this.setState({ isSaved: !this.state.isSaved }, () => {
      if (fairProfileID) {
        return commitMutation<SavedFairItemRowMutation>(this.props.relayEnvironment.environment, {
          mutation: graphql`
            mutation SavedFairItemRowMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  gravityID
                  is_followed
                  __id
                }
              }
            }
          `,
          variables: {
            input: {
              profile_id: fairProfileID,
              unfollow: !this.state.isSaved,
            },
          },
          optimisticResponse: {
            followProfile: {
              profile: {
                __id: fairProfileID,
                is_followed: !this.state.isSaved,
                gravityID: fairID,
              },
            },
          },
          updater: store => {
            store.get(fairProfileID).setValue(!this.state.isSaved, "is_followed")
          },
        })
      }
    })
  }

  render() {
    const item = this.props.node
    const imageURL = item.image && item.image.url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <Box height="95" mx="20" mt="9">
          <Flex flexGrow="1" flexDirection="row" alignItems="center">
            <Box height="50" width="50" mt="21" style={{ borderRadius: 25, overflow: "hidden" }}>
              <OpaqueImageView width={50} height={50} imageURL={imageURL} />
            </Box>
            <Flex flexDirection="column" flexGrow="1" width="197">
              <Sans size="3" color="black" weight="medium" numberOfLines={1} ml="13">
                {item.name}
              </Sans>
              {item.counts &&
                item.counts.partners && (
                  <Sans size="2" color={color("black60")} ml="13">
                    {item.counts.partners + " Exhbitors"}
                  </Sans>
                )}
              {item.exhibition_period && (
                <Sans size="2" color={color("black60")} ml="13">
                  {item.exhibition_period}
                </Sans>
              )}
            </Flex>
            <TouchableWithoutFeedback onPress={() => this.handleSave(item.profile.__id, item.profile.gravityID)}>
              <Flex flexGrow="1">
                <Sans weight="medium" mb="30" size="3" color={color("black60")} textAlign="right">
                  {this.state.isSaved ? "Saved" : "Save"}
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
