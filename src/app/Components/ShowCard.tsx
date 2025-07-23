import { toTitleCase } from "@artsy/to-title-case"
import { ShowCard_show$data } from "__generated__/ShowCard_show.graphql"
import { CardWithMetaData } from "app/Components/Cards/CardWithMetaData"
import { compact } from "lodash"
import { memo } from "react"
import { GestureResponderEvent, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ShowCardProps extends ViewProps {
  show: ShowCard_show$data
  isFluid: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ShowCard: React.FC<ShowCardProps> = memo(({ show, isFluid, onPress }) => {
  const imageURL = show.metaImage?.url

  const showCity = getShowCity({
    showName: show.name,
    showCity: show.city,
    partnerCities: show.partner?.cities,
    externalPartnerCity: show.partner?.city,
  })

  const formattedDate = `${show.formattedStartAt}-${show.formattedEndAt}`

  const formattedCityAndDate = compact([showCity, formattedDate]).join(" • ")

  return (
    <CardWithMetaData
      isFluid={isFluid}
      href={show.href}
      imageURL={imageURL}
      title={show.name}
      subtitle={show.partner?.name}
      tag={formattedCityAndDate}
      onPress={onPress}
    />
  )
})

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
        url(version: "larger")
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
