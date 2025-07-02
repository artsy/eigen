import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { RegisterToBidButton_me$key } from "__generated__/RegisterToBidButton_me.graphql"
import { SaleTabHeader_sale$key } from "__generated__/SaleTabHeader_sale.graphql"
import { CascadingEndTimesBanner } from "app/Scenes/Artwork/Components/CascadingEndTimesBanner"
import { RegisterToBidButtonContainer } from "app/Scenes/Sale/Components/RegisterToBidButton"
import { SaleActiveBidsContainer } from "app/Scenes/Sale/Components/SaleActiveBids"
import { saleStatus } from "app/Scenes/Sale/helpers"
import { RouterLink } from "app/system/navigation/RouterLink"
import { getAbsoluteTimeOfSale, saleTime, useRelativeTimeOfSale } from "app/utils/saleTime"
import { DateTime } from "luxon"
import { FC } from "react"
import { useWindowDimensions } from "react-native"
import { graphql, useFragment } from "react-relay"

interface SaleTabHeaderProps {
  sale: SaleTabHeader_sale$key
  me: RegisterToBidButton_me$key
}

export const COVER_IMAGE_HEIGHT = 240

export const SaleTabHeader: FC<SaleTabHeaderProps> = ({ me, sale }) => {
  const { width } = useWindowDimensions()
  // const color = useColor()
  const data = useFragment(fragment, sale)
  const relativeTimeOfSale = useRelativeTimeOfSale({
    endAt: data?.endAt,
    timeZone: data?.timeZone,
    endedAt: data?.endedAt,
    startAt: data?.startAt,
  })

  if (!data) {
    return null
  }

  const showAuctionClosedBanner =
    !!data.endAt &&
    !data.cascadingEndTimeIntervalMinutes &&
    DateTime.now() > DateTime.fromISO(data.endAt)

  const saleTimeDetails = saleTime(data)
  const absoluteTimeOfSale = getAbsoluteTimeOfSale(data)
  const showRegisterToBidButton =
    saleStatus(data.startAt, data.endAt, data.registrationEndsAt) !== "closed"
  const showCascadingEndTimesBanner =
    !!data.cascadingEndTimeIntervalMinutes &&
    !data.isClosed &&
    saleStatus(data.startAt, data.endAt, data.registrationEndsAt) !== "closed"

  return (
    <Flex pointerEvents="box-none" gap={2}>
      {!!data.coverImage?.url && (
        <Image
          pointerEvents="none"
          src={data.coverImage.url}
          width={width}
          height={COVER_IMAGE_HEIGHT}
        />
      )}

      <Flex pointerEvents="none">
        <Text variant="sm-display" px={2}>
          {data.name}
        </Text>
      </Flex>

      {!showAuctionClosedBanner && (
        <Flex
          justifyContent="center"
          pointerEvents="none"
          alignItems="center"
          backgroundColor="mono100"
        >
          <Text variant="sm-display" fontWeight="500" color="mono0">
            Auction closed
          </Text>
        </Flex>
      )}
      {!!data.cascadingEndTimeIntervalMinutes ? (
        <>
          <Flex pointerEvents="none" px={2}>
            {!!relativeTimeOfSale?.copy && (
              <Text variant="sm" color={relativeTimeOfSale.color}>
                {relativeTimeOfSale.copy}
              </Text>
            )}
            {!!absoluteTimeOfSale && <Text variant="sm">{absoluteTimeOfSale}</Text>}
          </Flex>
          <Flex pointerEvents="none" px={2}>
            <Text variant="xs">
              {`Lots close at ${data.cascadingEndTimeIntervalMinutes}-minute intervals`}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex pointerEvents="none" px={2}>
          {!!saleTimeDetails.absolute && (
            <Text variant="sm" weight="medium">
              {saleTimeDetails.absolute}
            </Text>
          )}
          {!!saleTimeDetails.relative && <Text variant="xs">{saleTimeDetails.relative}</Text>}
        </Flex>
      )}

      <RouterLink to={`auction/${data.slug}/info`}>
        <Flex alignItems="center" flexDirection="row" gap={0.5} px={2}>
          <Text variant="sm" weight="medium">
            More info about this auction
          </Text>
          <ChevronRightIcon />
        </Flex>
      </RouterLink>

      {!!showRegisterToBidButton && (
        <Flex px={2} pointerEvents="box-none">
          <RegisterToBidButtonContainer
            sale={data}
            me={me}
            contextType={OwnerType.sale}
            contextModule={ContextModule.auctionHome}
          />
        </Flex>
      )}

      {!!showCascadingEndTimesBanner && (
        <Flex pointerEvents="none">
          <CascadingEndTimesBanner
            cascadingEndTimeInterval={data.cascadingEndTimeIntervalMinutes}
            extendedBiddingIntervalMinutes={data.extendedBiddingIntervalMinutes}
          />
        </Flex>
      )}

      <SaleActiveBidsContainer me={me} saleID={data.internalID} />
    </Flex>
  )
}

const fragment = graphql`
  fragment SaleTabHeader_sale on Sale {
    ...RegisterToBidButton_sale

    cascadingEndTimeIntervalMinutes
    coverImage {
      url(version: "wide")
    }
    endAt
    endedAt
    extendedBiddingIntervalMinutes
    internalID @required(action: NONE)
    isClosed
    liveStartAt
    name @required(action: NONE)
    registrationEndsAt
    slug @required(action: NONE)
    startAt
    timeZone
  }
`
