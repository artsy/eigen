import { Spacer, Flex, Text, useScreenDimensions, Image } from "@artsy/palette-mobile"
import { PartnerShowRailItem_show$data } from "__generated__/PartnerShowRailItem_show.graphql"
import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"
import { navigate } from "app/system/navigation/navigate"
import { Schema } from "app/utils/track"
import { first } from "lodash"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  show: PartnerShowRailItem_show$data
}

export const PartnerShowRailItem: React.FC<Props> = (props) => {
  const { width: windowWidth } = useScreenDimensions()
  const tracking = useTracking()

  const onPress = () => {
    tracking.trackEvent(tracks.tapPartnerShowRailItem(props.show.internalID, props.show.slug))
    navigate(`/show/${props.show.slug}`)
  }

  const { show } = props
  const { name, exhibitionPeriod, endAt, coverImage, images } = show
  const imageURL = coverImage?.url || first(images)?.url

  const sectionWidth = windowWidth - 100

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Flex my="15px" mr={2} width={sectionWidth}>
        {!!imageURL && (
          <Image height={200} width={sectionWidth} src={imageURL} blurhash={coverImage?.blurhash} />
        )}
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

const tracks = {
  tapPartnerShowRailItem: (internalID: string, id: string) => ({
    action_name: Schema.ActionNames.NearbyShow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: internalID,
    owner_slug: id,
    owner_type: Schema.OwnerEntityTypes.Show,
  }),
}
