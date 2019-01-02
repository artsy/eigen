import { Box, Flex, Sans, space, Spacer } from "@artsy/palette"
import { FairHeader_fair } from "__generated__/FairHeader_fair.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import moment from "moment"
import React from "react"
import { Dimensions, Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { CountdownTimer } from "./CountdownTimer"

interface Props {
  fair: FairHeader_fair
  onSaveShowPressed?: () => Promise<void>
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
    const { artists_names, counts, exhibitors_grouped_by_name } = this.props.fair
    let { artists: artistsCount, partners: exhibitorsCount } = counts
    const {
      edges: [
        {
          node: { name: firstArtistName },
        },
        {
          node: { name: lastArtistName },
        },
      ],
    } = artists_names
    const [
      {
        exhibitors: [firstExhibitorName],
      },
      {
        exhibitors: [lastExhibitorName],
      },
    ] = exhibitors_grouped_by_name

    artistsCount = !firstArtistName ? artistsCount : artistsCount - 1
    artistsCount = !lastArtistName ? artistsCount : artistsCount - 1
    exhibitorsCount = !firstExhibitorName ? exhibitorsCount : exhibitorsCount - 1
    exhibitorsCount = !lastExhibitorName ? exhibitorsCount : exhibitorsCount - 1

    return (
      <>
        {(!firstArtistName && !lastArtistName) || !artistsCount ? null : (
          <Flex flexDirection="row" flexWrap="wrap">
            <Sans size="3">Works by </Sans>
            {firstArtistName && (
              <Sans weight="medium" size="3">
                {firstArtistName + ", "}
              </Sans>
            )}
            {lastArtistName && (
              <Sans weight="medium" size="3">
                {lastArtistName + ", "}
              </Sans>
            )}
            {(firstArtistName || lastArtistName) && <Sans size="3">and </Sans>}
            <Sans weight="medium" size="3">
              {artistsCount + " others."}
            </Sans>
          </Flex>
        )}
        {(!firstExhibitorName && !lastExhibitorName) || !exhibitorsCount ? null : (
          <Flex flexDirection="row" flexWrap="wrap">
            <Sans size="3">From </Sans>
            {firstExhibitorName && (
              <Sans weight="medium" size="3">
                {firstExhibitorName + ", "}
              </Sans>
            )}
            {lastExhibitorName && (
              <Sans weight="medium" size="3">
                {lastExhibitorName + ", "}
              </Sans>
            )}
            {(firstExhibitorName || lastExhibitorName) && <Sans size="3">and </Sans>}
            <Sans weight="medium" size="3">
              {exhibitorsCount + " others"}
            </Sans>
          </Flex>
        )}
      </>
    )
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
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
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
        <Spacer m={1} />
        <Box mx={2}>{this.getContextualDetails()}</Box>
        <Box px={2}>
          <Spacer m={2} />
          <InvertedButton text="Save" />
          <Spacer m={1} />
          <CaretButton text="View more information" />
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

      exhibitors_grouped_by_name {
        exhibitors
      }

      counts {
        artists
        partners
      }

      artists_names: artists(first: 2) {
        edges {
          node {
            name
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
