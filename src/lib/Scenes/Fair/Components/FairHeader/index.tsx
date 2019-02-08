import { Box, Flex, Sans, space, Spacer } from "@artsy/palette"
import { FairHeader_fair } from "__generated__/FairHeader_fair.graphql"
import { FairHeaderMutation } from "__generated__/FairHeaderMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import { EntityList } from "lib/Components/EntityList"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import moment from "moment"
import React from "react"
import { Dimensions, Image } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { CountdownTimer } from "./CountdownTimer"

interface Props {
  fair: FairHeader_fair
  onSaveShowPressed?: () => Promise<void>
  viewAllExhibitors: () => void
  viewAllArtists: () => void
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

const Logo = styled(Image)`
  width: 150;
  height: 150;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  margin-bottom: ${space(1)};
  tint-color: white;
`

const CountdownContainer = styled.View`
  position: absolute;
  bottom: ${space(1)};
  left: 0;
  width: 100%;
`

export class FairHeader extends React.Component<Props, State> {
  state = { isSavedFairStateUpdating: false }

  getContextualDetails() {
    const { viewAllArtists, viewAllExhibitors } = this.props
    const { artists_names, counts, partner_names } = this.props.fair

    const artistList = artists_names.edges.map(i => i.node).filter(Boolean)
    const partnerList = partner_names.edges.map(i => i.node.partner.profile).filter(Boolean)

    return (
      <>
        <EntityList
          prefix="Works by"
          list={artistList}
          count={counts.artists}
          displayedItems={2}
          onItemSelected={this.handlePress}
          onViewAllPressed={viewAllArtists}
        />
        <EntityList
          prefix="From"
          list={partnerList}
          count={counts.partners}
          displayedItems={2}
          onItemSelected={this.handlePress}
          onViewAllPressed={viewAllExhibitors}
        />
      </>
    )
  }

  handlePress = url => {
    Switchboard.presentNavigationViewController(this, url)
  }

  handleSaveFair() {
    const {
      relay,
      fair: {
        profile: { __id: fairProfile, id: fairID, is_followed: isFairFollowed },
      },
    } = this.props

    this.setState(
      {
        isSavedFairStateUpdating: true,
      },
      () => {
        if (fairProfile) {
          return commitMutation<FairHeaderMutation>(relay.environment, {
            onCompleted: () => {
              this.setState({
                isSavedFairStateUpdating: false,
              })
            },
            mutation: graphql`
              mutation FairHeaderMutation($input: FollowProfileInput!) {
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
                profile_id: fairProfile,
                unfollow: isFairFollowed,
              },
            },
            optimisticResponse: {
              followProfile: {
                profile: {
                  __id: fairProfile,
                  is_followed: !isFairFollowed,
                  id: fairID,
                },
              },
            },
            updater: store => {
              store.get(fairProfile).setValue(!isFairFollowed, "is_followed")
            },
          })
        }
      }
    )
  }

  render() {
    const {
      fair: { image, name, profile, start_at, end_at },
    } = this.props
    const { width: screenWidth } = Dimensions.get("window")
    const imageHeight = 567
    const { isSavedFairStateUpdating } = this.state

    return (
      <>
        <Box style={{ height: imageHeight, width: screenWidth, position: "relative" }}>
          <BackgroundImage imageURL={image.url} height={imageHeight} width={screenWidth} />
          <Flex flexDirection="row" justifyContent="center" alignItems="center" px={2} height={imageHeight}>
            <Flex alignItems="center" flexDirection="column" flexGrow={1}>
              {profile && <Logo source={{ uri: profile.icon.url }} />}
              <Sans size="3t" weight="medium" textAlign="center" color="white100">
                {name}
              </Sans>
              <Sans size="3" textAlign="center" color="white100">
                {moment(start_at).format("MMM Do")} - {moment(end_at).format("MMM Do")}
              </Sans>
            </Flex>
          </Flex>
        </Box>
        <CountdownContainer>
          <CountdownTimer startAt={start_at} endAt={end_at} />
        </CountdownContainer>
        <Spacer mt={2} />
        <Box mx={2}>{this.getContextualDetails()}</Box>
        <Box px={2} width={375} height={95}>
          <Spacer m={2} mt={1} />
          <InvertedButton
            text={profile.is_followed ? "Fair Saved" : "Save Fair"}
            onPress={() => this.handleSaveFair()}
            selected={profile.is_followed}
            inProgress={isSavedFairStateUpdating}
            grayBorder={true}
          />
          <Spacer m={1} />
        </Box>
      </>
    )
  }
}

export const FairHeaderContainer = createFragmentContainer(
  FairHeader,
  graphql`
    fragment FairHeader_fair on Fair {
      id
      name

      counts {
        artists
        partners
      }

      partner_names: shows_connection(first: 2) {
        edges {
          node {
            partner {
              ... on Partner {
                profile {
                  name
                  href
                }
              }
            }
          }
        }
      }
      artists_names: artists(first: 2) {
        edges {
          node {
            name
            href
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
          id
          href
          height
          width
          url
        }
        __id
        id
        name
        is_followed
      }

      start_at
      end_at
    }
  `
)
