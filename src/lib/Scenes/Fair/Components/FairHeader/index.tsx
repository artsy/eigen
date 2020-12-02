import { FairHeader_fair } from "__generated__/FairHeader_fair.graphql"
import { LabeledTicker } from "lib/Components/Countdown"
import { CountdownProps, CountdownTimer } from "lib/Components/Countdown/CountdownTimer"
import { EntityList } from "lib/Components/EntityList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema, Track, track as _track } from "lib/utils/track"
import { uniq } from "lodash"
import { Box, Flex, Sans, space, Spacer } from "palette"
import React from "react"
import { Dimensions, Image } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

interface Props {
  fair: FairHeader_fair
  onSaveShowPressed?: () => Promise<void>
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

// Set background color of overlay based on logo color
const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
`

const Logo = styled(Image)`
  width: 140;
  height: 140;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  margin-bottom: ${space(1)};
  /* stylelint-disable */
  tint-color: white;
`

const CountdownContainer = styled.View`
  position: absolute;
  bottom: ${space(4)};
  left: 0;
  width: 100%;
`

const CountdownText: React.FC<CountdownProps> = ({ duration, label }) =>
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  label !== "Closed" && (
    <Flex justifyContent="center" alignItems="center">
      <LabeledTicker
        renderSeparator={() => <Spacer mr={0.5} />}
        textProps={{ color: "white", size: "3t" }}
        duration={duration}
      />
      <Sans size="1" color="white">
        {label}
      </Sans>
    </Flex>
  )

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<Props, State> = _track

@track()
export class FairHeader extends React.Component<Props, State> {
  state = { isSavedFairStateUpdating: false }

  viewAllArtists() {
    navigate(`/fair/${this.props.fair.slug}/artists`)
  }

  viewAllExhibitors() {
    navigate(`/fair/${this.props.fair.slug}/exhibitors`)
  }

  getContextualDetails() {
    const { followedContent, artistsConnection, counts } = this.props.fair
    const fairfollowedArtistList = (followedContent && followedContent.artists) || []
    const artistList = extractNodes(artistsConnection)
    const uniqArtistList = uniq(fairfollowedArtistList.concat(artistList))

    return (
      <>
        <EntityList
          prefix="Works by"
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          list={uniqArtistList}
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          count={counts.artists}
          displayedItems={3}
          onItemSelected={this.handleArtistPress.bind(this)}
          onViewAllPressed={this.viewAllArtists.bind(this)}
        />
      </>
    )
  }

  @track((__, _, args) => {
    const slug = args[1]
    const id = args[2]
    return {
      action_name: Schema.ActionNames.ContextualGallery,
      action_type: Schema.ActionTypes.Tap,
      owner_id: id,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Gallery,
    } as any
  })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  handleExhibitorPress(href, _slug, _internalID) {
    navigate(`${href}?entity=fair-booth`)
  }

  @track((__, _, args) => {
    const slug = args[1]
    const id = args[2]
    return {
      action_name: Schema.ActionNames.ContextualArtist,
      action_type: Schema.ActionTypes.Tap,
      owner_id: id,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  handleArtistPress(href, _slug, _internalID) {
    navigate(href)
  }

  render() {
    const {
      fair: { image, name, profile, startAt, endAt, exhibitionPeriod, formattedOpeningHours },
    } = this.props
    const { width: screenWidth } = Dimensions.get("window")
    const imageHeight = 567

    return (
      <>
        <Box style={{ height: imageHeight, width: screenWidth, position: "relative" }}>
          {!!image && <BackgroundImage imageURL={image.url} height={imageHeight} width={screenWidth} />}
          <Overlay />
          <Flex flexDirection="row" justifyContent="center" alignItems="center" px={2} height={imageHeight}>
            <Flex alignItems="center" flexDirection="column" flexGrow={1}>
              {profile?.icon?.url ? (
                <Logo
                  source={{
                    uri: profile.icon.url,
                  }}
                  resizeMode="contain"
                />
              ) : null}
              <Sans size="3t" weight="medium" textAlign="center" color="white100">
                {name}
              </Sans>
              {!!exhibitionPeriod && (
                <Sans size="3" textAlign="center" color="white100">
                  {exhibitionPeriod}
                </Sans>
              )}
            </Flex>
          </Flex>
          {!!startAt && !!endAt && (
            <CountdownContainer>
              <CountdownTimer
                countdownComponent={CountdownText}
                startAt={startAt}
                endAt={endAt}
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                formattedOpeningHours={formattedOpeningHours}
              />
            </CountdownContainer>
          )}
        </Box>
        <Spacer mt={2} />
        <Box mx={2} mb={2}>
          {this.getContextualDetails()}
        </Box>
      </>
    )
  }
}

export const FairHeaderContainer = createFragmentContainer(FairHeader, {
  fair: graphql`
    fragment FairHeader_fair on Fair {
      slug
      name
      formattedOpeningHours
      startAt
      endAt
      exhibitionPeriod

      counts {
        artists
      }

      image {
        url
      }

      followedContent {
        artists {
          name
          href
          slug
          internalID
        }
      }

      artistsConnection(first: 3) {
        edges {
          node {
            name
            href
            slug
            internalID
          }
        }
      }

      profile {
        id
        icon {
          url(version: "square140")
        }
      }
    }
  `,
})
