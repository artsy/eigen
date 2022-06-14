import { PartnerShowRailItem_show$data } from "__generated__/PartnerShowRailItem_show.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"
import { Schema, track } from "app/utils/track"
import { first } from "lodash"
import { Flex, Sans, Spacer } from "palette"
import React from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const { width: windowWidth } = Dimensions.get("window")
const ImageView = styled(OpaqueImageView)`
  height: 200;
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
        <Flex my={15} mr={2} width={windowWidth - 100}>
          <ImageView
            imageURL={imageURL}
            style={{ alignItems: "center", justifyContent: "center" }}
          />
          <Spacer mb={1} />
          <Sans size="3t" numberOfLines={1}>
            {name}
          </Sans>
          {!!(exhibitionPeriod && endAt) && (
            <Sans size="3t" color="black60">
              {exhibitionDates(exhibitionPeriod, endAt)}
            </Sans>
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
      }
      images {
        url
      }
    }
  `,
})
