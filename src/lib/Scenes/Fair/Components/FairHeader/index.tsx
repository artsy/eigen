import { Box, Flex, Sans, space, Spacer } from "@artsy/palette"
import { FairHeader_fair } from "__generated__/FairHeader_fair.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import moment from "moment"
import React from "react"
import { Dimensions, Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { CountdownTimer } from "./CountdownTimer"

interface Props {
  fair: FairHeader_fair
  onSaveShowPressed?: () => Promise<void>
  viewAllExhibitors: () => void
  viewAllArtists: () => void
}

const BackgroundImage = styled(OpaqueImageView)<{ width: number }>`
  flex: 1;
  height: 530;
  align-self: center;
  flex-direction: row;
  align-items: center;
`

// Set background color of overlay based on logo color
const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
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
    const { artists_names, counts, partner_names } = this.props.fair
    let { artists: artistsCount, partners: partnersCount } = counts
    const {
      edges: [
        {
          node: { name: firstArtistName, href: firstArtistSlug },
        },
        {
          node: { name: lastArtistName, href: lastArtistSlug },
        },
      ],
    } = artists_names
    const {
      edges: [
        {
          node: {
            partner: {
              profile: { name: firstExhibitorName, href: firstPartnerSlug },
            },
          },
        },
        {
          node: {
            partner: {
              profile: { name: lastExhibitorName, href: lastPartnerSlug },
            },
          },
        },
      ],
    } = partner_names

    // @ts-ignore
    artistsCount = artistsCount - Boolean(firstArtistName) - Boolean(lastArtistName)
    // @ts-ignore
    partnersCount = partnersCount - Boolean(firstExhibitorName) - Boolean(lastExhibitorName)

    return (
      <>
        {(!firstArtistName && !lastArtistName) || !artistsCount ? null : (
          <Flex flexDirection="row" flexWrap="wrap" mb={"8"}>
            <Sans size="3" lineHeight="19">
              Works by{" "}
            </Sans>
            {firstArtistName && (
              <TouchableOpacity onPress={() => this.handlePress(this, firstArtistSlug)}>
                <Sans weight="medium" size="3" lineHeight="19">
                  {firstArtistName + ", "}
                </Sans>
              </TouchableOpacity>
            )}
            {lastArtistName && (
              <TouchableOpacity onPress={() => this.handlePress(this, lastArtistSlug)}>
                <Sans weight="medium" size="3" lineHeight="19">
                  {lastArtistName + ", "}
                </Sans>
              </TouchableOpacity>
            )}
            {(firstArtistName || lastArtistName) && (
              <Sans size="3" lineHeight="19">
                and{" "}
              </Sans>
            )}
            <TouchableOpacity onPress={() => this.props.viewAllArtists()}>
              <Sans weight="medium" size="3" lineHeight="19">
                {artistsCount + " others"}
              </Sans>
            </TouchableOpacity>
          </Flex>
        )}
        {(!firstExhibitorName && !lastExhibitorName) || !partnersCount ? null : (
          <Flex flexDirection="row" flexWrap="wrap">
            <Sans size="3" lineHeight="19">
              From{" "}
            </Sans>
            {firstExhibitorName && (
              <TouchableOpacity onPress={() => this.handlePress(this, firstPartnerSlug)}>
                <Sans weight="medium" size="3" lineHeight="19">
                  {firstExhibitorName + ", "}
                </Sans>
              </TouchableOpacity>
            )}
            {lastExhibitorName && (
              <TouchableOpacity onPress={() => this.handlePress(this, lastPartnerSlug)}>
                <Sans weight="medium" size="3" lineHeight="19">
                  {lastExhibitorName + ", "}
                </Sans>
              </TouchableOpacity>
            )}
            {(firstExhibitorName || lastExhibitorName) && (
              <Sans size="3" lineHeight="19">
                and{" "}
              </Sans>
            )}
            <TouchableOpacity onPress={() => this.props.viewAllExhibitors()}>
              <Sans weight="medium" size="3" lineHeight="19">
                {partnersCount + " others"}
              </Sans>
            </TouchableOpacity>
          </Flex>
        )}
      </>
    )
  }

  handlePress(component, url) {
    Switchboard.presentNavigationViewController(component, url)
  }

  render() {
    const {
      fair: { image, name, profile, start_at, end_at },
    } = this.props
    const { width: screenWidth } = Dimensions.get("window")

    return (
      <>
        <BackgroundImage imageURL={image.url} aspectRatio={image.aspect_ratio} width={screenWidth}>
          <Overlay />
          <Flex flexDirection="row" justifyContent="center" alignItems="center" px={2}>
            <Flex flexDirection="column" flexGrow={1}>
              {profile && <Logo source={{ uri: profile.icon.url }} />}
              <Sans size="3t" weight="medium" textAlign="center" color="white100">
                {name}
              </Sans>
              <Sans size="3" textAlign="center" color="white100">
                {moment(start_at).format("MMM Do")} - {moment(end_at).format("MMM Do")}
              </Sans>
            </Flex>
          </Flex>
          <CountdownContainer>
            <CountdownTimer startAt={start_at} endAt={end_at} />
          </CountdownContainer>
        </BackgroundImage>
        <Spacer mt={2} />
        <Box mx={2}>{this.getContextualDetails()}</Box>
        <Box px={2}>
          <Spacer m={2} mt={1} />
          <InvertedButton text="Save" />
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
        name
      }

      start_at
      end_at
    }
  `
)
