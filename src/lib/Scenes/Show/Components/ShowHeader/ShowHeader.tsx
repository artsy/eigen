import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { ShowHeader_show } from "__generated__/ShowHeader_show.graphql"
import { ShowHeaderFollowShowMutation } from "__generated__/ShowHeaderFollowShowMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import { EntityList } from "lib/Components/EntityList"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { Carousel } from "./Components/Carousel"

interface Props {
  show: ShowHeader_show
  onViewAllArtistsPressed: () => void
  relay: RelayProp
}

interface State {
  isFollowedSaving: boolean
}

const ButtonWrapper = styled(Box)`
  width: 100%;
  height: 85;
`

export class ShowHeader extends React.Component<Props, State> {
  state = { isFollowedSaving: false }

  handlePartnerTitleClick = () => {
    const {
      show: { partner },
    } = this.props
    SwitchBoard.presentNavigationViewController(this, `/${partner.id}?entity=gallery`)
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
          onCompleted: () => {
            this.setState({
              isFollowedSaving: false,
            })
          },
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

  render() {
    const { isFollowedSaving } = this.state
    const {
      show: { artists, images, is_followed, name, partner, exhibition_period },
      onViewAllArtistsPressed,
    } = this.props
    const hasImages = !!images.length
    const singleImage = hasImages && images.length === 1 ? true : false
    console.log("images[0].url", images[0].url)

    return (
      <>
        <Box px={2} pt={3} pb={hasImages ? 0 : 4}>
          <Spacer m={2} />
          <TouchableWithoutFeedback onPress={this.handlePartnerTitleClick}>
            <Sans size="3" mb={0.5} weight="medium">
              {partner.name}
            </Sans>
          </TouchableWithoutFeedback>
          <Serif size="8" lineHeight={34}>
            {name}
          </Serif>
          <Sans size="3">{exhibition_period}</Sans>
        </Box>
        {hasImages &&
          !singleImage && (
            <Carousel
              sources={(images || []).map(({ url: imageURL, aspect_ratio: aspectRatio }) => ({
                imageURL,
                aspectRatio,
              }))}
            />
          )}
        {singleImage && (
          <Box px={2} py={2}>
            <OpaqueImageView imageURL={images[0].url} aspectRatio={images[0].aspect_ratio} />
          </Box>
        )}
        <Box px={2}>
          <EntityList
            prefix="Works by"
            list={artists}
            count={artists.length}
            displayedItems={2}
            onItemSelected={url => {
              SwitchBoard.presentNavigationViewController(this, url)
            }}
            onViewAllPressed={onViewAllArtistsPressed}
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
      exhibition_period
      status
      partner {
        ... on Partner {
          name
          id
        }
        ... on ExternalPartner {
          name
        }
      }
      images {
        url
        aspect_ratio
      }
      artists {
        name
        href
      }
    }
  `
)
