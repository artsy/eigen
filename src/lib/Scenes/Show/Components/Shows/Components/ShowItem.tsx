import { Flex, Sans, Serif } from "@artsy/palette"
import { ShowItem_show } from "__generated__/ShowItem_show.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Pin } from "lib/Icons/Pin"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ExhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { Dimensions, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const { width: windowWidth } = Dimensions.get("window")
const ImageView = styled(OpaqueImageView)`
  height: 120;
  width: 100%;
`

interface Props {
  show: ShowItem_show
}

@track()
export class ShowItem extends React.Component<Props> {
  get imageURL() {
    const {
      images: [image],
    } = this.props.show

    return (image || { url: "" }).url
  }

  @track(props => ({
    action_name: Schema.ActionNames.NearbyShow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show.internalID,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  onPress() {
    SwitchBoard.presentNavigationViewController(this, `/show/${this.props.show.slug}`)
  }

  render() {
    const { show } = this.props

    const {
      name,
      partner: { name: galleryName },
      exhibition_period,
      end_at,
    } = show

    const placeholder = this.imageURL ? null : <Pin color="white" />

    return (
      <TouchableOpacity onPress={() => this.onPress()}>
        <Flex my={15} mr={2} width={windowWidth - 100} height={200}>
          <ImageView imageURL={this.imageURL} style={{ alignItems: "center", justifyContent: "center" }}>
            {placeholder}
          </ImageView>
          <Flex my={2}>
            <Sans size="2" weight="medium" numberOfLines={1} mb={0.5}>
              {name}
            </Sans>
            <Serif size="2" color="black60">
              {galleryName}
            </Serif>
            <Serif size="2" color="black60">
              {ExhibitionDates(exhibition_period, end_at)}
            </Serif>
          </Flex>
        </Flex>
      </TouchableOpacity>
    )
  }
}

export const ShowItemContainer = createFragmentContainer(ShowItem, {
  show: graphql`
    fragment ShowItem_show on Show {
      internalID
      slug
      name
      exhibition_period: exhibitionPeriod
      end_at: endAt
      images {
        url
      }
      partner {
        ... on Partner {
          name
        }
      }
    }
  `,
})
