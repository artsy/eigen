import { ShowCard_show } from "__generated__/ShowCard_show.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { GestureResponderEvent, TouchableWithoutFeedback, View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const WIDTH = 295
const HEIGHT = 230

interface ShowCardProps extends ViewProps {
  show: ShowCard_show
  isFluid?: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, onPress, isFluid }) => {
  const imageURL = show.metaImage?.url

  const onTap = (event: GestureResponderEvent) => {
    onPress?.(event)
    navigate(show.href!)
  }

  return (
    <Flex width={isFluid ? "100%" : WIDTH}>
      <TouchableWithoutFeedback onPress={onTap}>
        <Flex width={isFluid ? "100%" : WIDTH} overflow="hidden">
          {!!imageURL &&
            (isFluid ? (
              <View style={{ width: "100%", aspectRatio: 1.33, flexDirection: "row" }}>
                <ImageView imageURL={show.metaImage?.url} style={{ flex: 1 }} />
              </View>
            ) : (
              <ImageView imageURL={show.metaImage?.url} width={WIDTH} height={HEIGHT} />
            ))}
          <Spacer mb={1} />
          <Text numberOfLines={3} ellipsizeMode="tail" variant="lg">
            {show.name}
          </Text>
          <Text color="black60">{show.partner?.name}</Text>
          <Text color="black60">
            {show.formattedStartAt} - {show.formattedEndAt}
          </Text>
        </Flex>
      </TouchableWithoutFeedback>
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
        url(version: "large")
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
