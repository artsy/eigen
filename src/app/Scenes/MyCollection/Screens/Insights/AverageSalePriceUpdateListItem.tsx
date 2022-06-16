import { AverageSalePriceUpdatesRail_me$data } from "__generated__/AverageSalePriceUpdatesRail_me.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Flex, NoArtworkIcon, Text } from "palette"
import React from "react"

export type AverageSalePriceUpdate = NonNullable<
  NonNullable<
    NonNullable<AverageSalePriceUpdatesRail_me$data["averageSalePriceUpdates"]>["edges"]
  >[0]
>["node"]

interface Props {
  artworks: AverageSalePriceUpdate[]
  onPress?: () => void
  showArtistName?: boolean
}

export const AverageSalePriceUpdateListItem: React.FC<Props> = ({ artworks, showArtistName }) => {
  const artist = artworks[0]?.artist

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="row" alignItems="center">
        <Flex
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor="black10"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          style={{ marginTop: 3 }}
        >
          {!artist?.imageUrl ? (
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          ) : (
            <OpaqueImageView width={40} height={40} imageURL={artist?.imageUrl} />
          )}
        </Flex>
        <Flex pl={15}>
          {!!showArtistName && !!artist?.name && (
            <Text variant="xs" ellipsizeMode="middle">
              {artist?.name}
            </Text>
          )}
          <Text variant="xs" ellipsizeMode="middle" color="black60">
            {artist?.formattedNationalityAndBirthday}
          </Text>
        </Flex>
      </Flex>
      {artworks.map((artwork) => (
        <Flex key={artwork?.internalID} pt={2} flexDirection="row" justifyContent="space-between">
          <Flex flex={1}>
            <Text variant="xs">{artwork?.medium}</Text>
          </Flex>
          <Flex alignItems="flex-end" pl={15}>
            <Flex alignItems="flex-end">
              <Text variant="xs" fontWeight="500" numberOfLines={1}>
                {formattedAverageSalePrice(
                  artwork?.marketPriceInsights?.annualLotsSold,
                  artwork?.marketPriceInsights?.annualValueSoldCents
                )}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

const formattedAverageSalePrice = (
  annualLotsSold: number | null | undefined,
  annualValueSoldCents: number
) => {
  const averageSalePrice = Math.floor(
    (annualValueSoldCents as number) / 100 / (annualLotsSold || 1)
  )
  return `US$${averageSalePrice.toLocaleString()}`
}
