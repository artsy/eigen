import { Spacer, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { toTitleCase } from "@artsy/to-title-case"
import { ShowCard_show$data } from "__generated__/ShowCard_show.graphql"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/system/navigation/navigate"
import { compact } from "lodash"
import { GestureResponderEvent, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const WIDTH = 295
const HEIGHT = 230

interface ShowCardProps extends ViewProps {
  show: ShowCard_show$data
  onPress?(event: GestureResponderEvent): void
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, onPress }) => {
  const imageURL = show.metaImage?.url

  const onTap = (event: GestureResponderEvent) => {
    onPress?.(event)
    if (show.href) {
      navigate(show.href)
    }
  }

  const showCity = getShowCity({
    showName: show.name,
    showCity: show.city,
    partnerCities: show.partner?.cities,
    externalPartnerCity: show.partner?.city,
  })

  const formattedDate = `${show.formattedStartAt}-${show.formattedEndAt}`

  const formattedCityAndDate = compact([showCity, formattedDate]).join(" • ")

  return (
    <Flex width={WIDTH}>
      <Touchable haptic onPress={onTap}>
        <Flex width={WIDTH} overflow="hidden">
          {!!imageURL && <ImageView imageURL={imageURL} width={WIDTH} height={HEIGHT} />}
          <Spacer y={1} />
          <Text numberOfLines={3} ellipsizeMode="tail" variant="lg-display">
            {show.name}
          </Text>
          <Text color="black60">{show.partner?.name}</Text>
          <Text>{formattedCityAndDate}</Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}

export const getShowCity = ({
  showName,
  showCity,
  partnerCities,
  externalPartnerCity,
}: {
  showName: ShowCard_show$data["name"]
  showCity: ShowCard_show$data["city"]
  partnerCities: NonNullable<ShowCard_show$data["partner"]>["cities"]
  externalPartnerCity: NonNullable<ShowCard_show$data["partner"]>["city"]
}) => {
  if (showCity) {
    return showCity
  }

  if (!showName) {
    return null
  }

  if (partnerCities?.length) {
    const matchingCity = partnerCities.find((partnerCity) => {
      if (partnerCity) {
        return showName.toLowerCase().includes(partnerCity?.toLowerCase())
      }
    })

    return matchingCity ? toTitleCase(matchingCity) : null
  }

  if (externalPartnerCity && showName.toLowerCase().includes(externalPartnerCity?.toLowerCase())) {
    return toTitleCase(externalPartnerCity)
  }

  return null
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
      city
      partner {
        ... on Partner {
          name
          cities
        }
        ... on ExternalPartner {
          name
          city
        }
      }
    }
  `,
})
