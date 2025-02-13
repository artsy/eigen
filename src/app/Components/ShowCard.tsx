import {
  Flex,
  Image,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import { toTitleCase } from "@artsy/to-title-case"
import { ShowCard_show$data } from "__generated__/ShowCard_show.graphql"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { RouterLink } from "app/system/navigation/RouterLink"
import { compact } from "lodash"
import { GestureResponderEvent, useWindowDimensions, View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const WIDTH = 295
const HEIGHT = 230

interface ShowCardProps extends ViewProps {
  show: ShowCard_show$data
  isFluid: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, isFluid, onPress }) => {
  const imageURL = show.metaImage?.url

  const showCity = getShowCity({
    showName: show.name,
    showCity: show.city,
    partnerCities: show.partner?.cities,
    externalPartnerCity: show.partner?.city,
  })

  const formattedDate = `${show.formattedStartAt}-${show.formattedEndAt}`

  const formattedCityAndDate = compact([showCity, formattedDate]).join(" • ")

  const { space } = useTheme()
  const { width } = useWindowDimensions()

  return (
    <Flex width={isFluid ? "100%" : WIDTH}>
      <RouterLink haptic onPress={onPress} to={show.href}>
        <Flex width={isFluid ? "100%" : WIDTH} overflow="hidden">
          {!!imageURL &&
            (isFluid ? (
              <>
                <View style={{ width }}>
                  <Image
                    src={imageURL}
                    // aspect ratio is fixed to 1.33 to match the old image aspect ratio
                    aspectRatio={1.33}
                    // 40 here comes from the mx={2} from the parent component
                    width={width - 2 * space(2)}
                  />
                </View>
              </>
            ) : (
              <ImageWithFallback src={imageURL} width={WIDTH} height={HEIGHT} />
            ))}

          <Spacer y={1} />
          <Text numberOfLines={2} ellipsizeMode="tail" variant="sm-display" mb={0.5}>
            {show.name}
          </Text>
          <Text variant="xs" color="black60">
            {show.partner?.name}
          </Text>
          <Text variant="xs">{formattedCityAndDate}</Text>
        </Flex>
      </RouterLink>
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

export const SkeletonShowCard: React.FC = () => {
  return (
    <Flex width={WIDTH} overflow="hidden">
      <SkeletonBox height={HEIGHT} width={WIDTH} />
      <Spacer y={1} />
      <SkeletonText variant="sm-display" mb={0.5}>
        Example Show
      </SkeletonText>
      <SkeletonText variant="xs"></SkeletonText>
      <SkeletonText variant="xs">Berlin • Oct 8-Nov 9</SkeletonText>
    </Flex>
  )
}
