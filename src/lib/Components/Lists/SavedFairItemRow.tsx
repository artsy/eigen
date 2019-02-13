import React from "react"
import styled from "styled-components/native"

import { Flex } from "@artsy/palette"
import { SavedFairItemRowMutation } from "__generated__/SavedFairItemRowMutation.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import { Colors } from "lib/data/colors"
import fonts from "lib/data/fonts"
import Switchboard from "lib/NativeModules/SwitchBoard"
import moment from "moment"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, graphql, RelayProp } from "react-relay"

interface State {
  isSaved: boolean
}

const Container = styled.View`
  margin: 9px 20px 0;
  height: 95px;
`

const Content = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const SaveLabel = styled.Text`
  font-family: ${fonts["unica77ll-regular"]};
  font-size: 14px;
  color: ${Colors.GraySemibold};
  text-align: right;
  flex: 1;
  font-weight: 500;
  margin-bottom: 30px;
`

const Title = styled.Text`
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 14px;
  letter-spacing: 0.5;
  color: black;
  margin-left: 13px;
  margin-bottom: 2px;
  margin-top: 15px;
  flex: 1;
  font-weight: 500;
  width: 197px;
`

const Subtitle = styled.Text`
  font-family: ${fonts["unica77ll-regular"]};
  font-size: 13px;
  letter-spacing: 0.5;
  color: ${Colors.GraySemibold}
  margin-left: 13px;
  flex: 1;
`

const ImageView = styled(OpaqueImageView)`
  height: 50px;
  width: 50px;
`

const ImageContainer = styled.View`
  height: 50px;
  width: 50px;
  overflow: hidden;
  margin-top: 21px;
`

const Separator = styled.View`
  height: 1;
  width: 100%;
  background-color: ${Colors.GrayRegular};
  margin-top: 9px;
`

interface Props {
  node: {
    profile: {
      __id: string
      id: string
    }
    href: string
    name: string
    image: {
      url: string | null
    }
    square_image?: boolean | undefined
    counts: {
      partners: number
    }
    start_at: string
    end_at: string
  }
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
                  id
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
                id: fairID,
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
        <Container>
          <Content>
            <ImageContainer style={{ borderRadius: 25 }}>
              <ImageView imageURL={imageURL} />
            </ImageContainer>
            <Flex flexDirection="column">
              <Title>{item.name.toUpperCase()}</Title>
              {item.counts && <Subtitle>{item.counts.partners + " Exhbitors"}</Subtitle>}
              {item.start_at &&
                item.end_at && (
                  <Subtitle>
                    {moment(item.start_at).format("MMM D")} - {moment(item.end_at).format("D")}
                  </Subtitle>
                )}
            </Flex>
            <TouchableWithoutFeedback onPress={() => this.handleSave(item.profile.__id, item.profile.id)}>
              <SaveLabel>{this.state.isSaved ? "Saved" : "Save"}</SaveLabel>
            </TouchableWithoutFeedback>
          </Content>
          <Separator />
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}
