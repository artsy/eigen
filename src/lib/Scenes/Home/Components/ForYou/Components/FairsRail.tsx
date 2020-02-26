import colors from "lib/data/colors"
import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import SectionTitle from "lib/Scenes/Home/Components/SectionTitle"

import { Sans, Separator } from "@artsy/palette"
import { FairsRail_fairs_module } from "__generated__/FairsRail_fairs_module.graphql"
import { Card, CardScrollView } from "lib/Components/Home/CardScrollView"
import { View } from "react-native"

// TODO: Move this to a shared file.
const CARD_WIDTH = 270

interface Props {
  fairs_module: FairsRail_fairs_module
}

export class FairsRail extends Component<Props, null> {
  render() {
    if (!this.props.fairs_module.results.length) {
      return
    }

    const fairCards = this.props.fairs_module.results.map(result => {
      return (
        <Card onPress={() => Switchboard.presentNavigationViewController(this, `${result.slug}?entity=fair`)}>
          <View>
            <ArtworkImageContainer />
            <Sans size="3t">{result.name}</Sans>
            <Sans size="3t">{result.exhibitionPeriod}</Sans>
          </View>
        </Card>
      )
    })

    return (
      <View>
        <Title>
          <SectionTitle>Recommended Art Fairs</SectionTitle>
        </Title>
        <CardScrollView>{fairCards}</CardScrollView>
        <Separator />
      </View>
    )
  }
}

const Title = styled(SectionTitle)`
  margin-left: 20;
`

const ArtworkImageContainer = styled.View`
  width: 100%;
  height: 130px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default createFragmentContainer(FairsRail, {
  fairs_module: graphql`
    fragment FairsRail_fairs_module on HomePageFairsModule {
      results {
        id
        slug
        profile {
          slug
        }
        name
        exhibitionPeriod
        followedArtistArtworks: filterArtworksConnection(first: 3, includeArtworksByFollowedArtists: true) {
          edges {
            node {
              title
              href
              artist {
                name
              }
            }
          }
        }
        otherArtworks: filterArtworksConnection(first: 3) {
          edges {
            node {
              title
              href
              artist {
                name
              }
            }
          }
        }
      }
    }
  `,
})
