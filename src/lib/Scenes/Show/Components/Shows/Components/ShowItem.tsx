import { ShowItem_show } from "__generated__/ShowItem_show.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Pin } from "lib/Icons/Pin"
import { navigate } from "lib/navigation/navigate"
import { exhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { Schema, track } from "lib/utils/track"
import { Flex, Sans } from "palette"
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
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      images: [image],
    } = this.props.show

    return (image || { url: "" }).url
  }

  @track((props) => ({
    action_name: Schema.ActionNames.NearbyShow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show.internalID,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  onPress() {
    navigate(`/show/${this.props.show.slug}`)
  }

  render() {
    const { show } = this.props

    const {
      name,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
            <Sans size="3t" weight="medium" numberOfLines={1}>
              {name}
            </Sans>
            <Sans size="3t" color="black60">
              {galleryName}
            </Sans>
            <Sans size="3t" color="black60">
              {exhibitionDates(
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                exhibition_period,
                end_at
              )}
            </Sans>
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
