import { Spacer, Flex, Text } from "@artsy/palette-mobile"
import { PartnerShowRailItem_show$data } from "__generated__/PartnerShowRailItem_show.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"
import { navigate } from "app/system/navigation/navigate"
import { Schema, track } from "app/utils/track"
import { first } from "lodash"
import React from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const { width: windowWidth } = Dimensions.get("window")
const ImageView = styled(OpaqueImageView)`
  height: 200px;
  width: 100%;
`

interface Props {
  show: PartnerShowRailItem_show$data
}

@track()
export class PartnerShowRailItem extends React.Component<Props> {
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
    const { name, exhibitionPeriod, endAt, coverImage, images } = show
    const imageURL = coverImage?.url || first(images)?.url

    return (
      <TouchableWithoutFeedback onPress={() => this.onPress()}>
        <Flex my="15px" mr={2} width={windowWidth - 100}>
          <ImageView
            imageURL={imageURL}
            blurhash={coverImage?.blurhash}
            style={{ alignItems: "center", justifyContent: "center" }}
          />
          <Spacer y={1} />
          <Text variant="sm" numberOfLines={1}>
            {name}
          </Text>
          {!!(exhibitionPeriod && endAt) && (
            <Text variant="sm" color="black60">
              {exhibitionDates(exhibitionPeriod, endAt)}
            </Text>
          )}
        </Flex>
      </TouchableWithoutFeedback>
    )
  }
}

export const PartnerShowRailItemContainer = createFragmentContainer(PartnerShowRailItem, {
  show: graphql`
    fragment PartnerShowRailItem_show on Show {
      internalID
      slug
      name
      exhibitionPeriod(format: SHORT)
      endAt
      coverImage {
        url
        blurhash
      }
      images {
        url
      }
    }
  `,
})
