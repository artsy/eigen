import { ShowCard_show } from "__generated__/ShowCard_show.graphql"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { Flex, Spacer, Text, Touchable } from "palette"
import React from "react"
import { GestureResponderEvent, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const WIDTH = 295
const HEIGHT = 230

interface ShowCardProps extends ViewProps {
  show: ShowCard_show
  onPress?(event: GestureResponderEvent): void
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, onPress }) => {
  const imageURL = show.metaImage?.url

  const onTap = (event: GestureResponderEvent) => {
    onPress?.(event)
    navigate(show.href!)
  }

  return (
    <Flex width={WIDTH}>
      <Touchable haptic onPress={onTap}>
        <Flex width={WIDTH} overflow="hidden">
          {!!imageURL && <ImageView imageURL={imageURL} width={WIDTH} height={HEIGHT} />}
          <Spacer mb={1} />
          <Text numberOfLines={3} ellipsizeMode="tail" variant="lg">
            {show.name}
          </Text>
          <Text color="black60">{show.partner?.name}</Text>
          <Text color="black60">
            {show.formattedStartAt} - {show.formattedEndAt}
          </Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}

export const ShowCardContainer = createFragmentContainer(ShowCard, {
  show: graphql`
    fragment ShowCard_show on Show {
      name
      formattedStartAt: startAt(format: "MMM D")
      formattedEndAt: endAt(format: "MMM D")
      href
      metaImage {
        url(version: "small")
      }
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
    }
  `,
})
