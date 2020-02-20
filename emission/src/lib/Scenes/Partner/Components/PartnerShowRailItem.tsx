import { Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { PartnerShowRailItem_show } from "__generated__/PartnerShowRailItem_show.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { exhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { get } from "lib/utils/get"
import { Schema, track } from "lib/utils/track"
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
  show: PartnerShowRailItem_show
}

@track()
export class PartnerShowRailItem extends React.Component<Props> {
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
    const { name, exhibitionPeriod, endAt } = show

    const imageURL = get(show, s => s.images[0].url)

    return (
      <TouchableWithoutFeedback onPress={() => this.onPress()}>
        <Flex my={15} mr={2} width={windowWidth - 100}>
          <ImageView imageURL={imageURL} style={{ alignItems: "center", justifyContent: "center" }} />
          <Spacer mb={1} />
          <Sans size="2" weight="medium" numberOfLines={1}>
            {name}
          </Sans>
          <Serif size="2" color="black60">
            {exhibitionDates(exhibitionPeriod, endAt)}
          </Serif>
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
      exhibitionPeriod
      endAt
      images {
        url
      }
    }
  `,
})
