import { Box, Flex, Sans, space, Spacer } from "@artsy/palette"
import { FairHeader_fair } from "__generated__/FairHeader_fair.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import { EntityList } from "lib/Components/EntityList"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import moment from "moment"
import React from "react"
import { Dimensions, Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { CountdownTimer } from "./CountdownTimer"

interface Props {
  fair: FairHeader_fair
  onSaveShowPressed?: () => Promise<void>
  viewAllExhibitors: () => void
  viewAllArtists: () => void
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

export class FairHeader extends React.Component<Props> {
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

  render() {
    const {
      fair: { image, name, profile, start_at, end_at },
    } = this.props
    const { width: screenWidth } = Dimensions.get("window")
    const imageHeight = 567

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
        <Box px={2}>
          <Spacer m={2} mt={1} />
          <InvertedButton text="Save fair" />
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
        name
      }

      start_at
      end_at
    }
  `
)
