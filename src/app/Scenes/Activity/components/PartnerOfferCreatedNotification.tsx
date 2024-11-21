import {
  DEFAULT_HIT_SLOP,
  Flex,
  Screen,
  Spacer,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { PartnerOfferCreatedNotification_notification$key } from "__generated__/PartnerOfferCreatedNotification_notification.graphql"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { CommercialButtonsQueryRenderer } from "app/Scenes/Activity/components/NotificationCommercialButtons"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { getTimer } from "app/utils/getTimer"
import { ImageBackground } from "react-native"
import { graphql, useFragment } from "react-relay"

export interface PartnerOffer {
  internalID: string
  endAt: string | null | undefined
  isAvailable: boolean | null | undefined
  note: string | null | undefined
}

interface PartnerOfferCreatedNotificationProps {
  notification: PartnerOfferCreatedNotification_notification$key
}

export const PartnerOfferCreatedNotification: React.FC<PartnerOfferCreatedNotificationProps> = ({
  notification,
}) => {
  const { headline, item, notificationType, artworksConnection } = useFragment(
    PartnerOfferCreatedNotificationFragment,
    notification
  )

  const color = useColor()

  const { hasEnded } = getTimer(item?.partnerOffer?.endAt || "")
  const noLongerAvailable = !item?.partnerOffer?.isAvailable
  const isOfferFromSaves = item?.partnerOffer?.source === "SAVE"

  let subtitle = isOfferFromSaves
    ? "Review the offer on your saved artwork"
    : "Review the offer before it expires"

  if (noLongerAvailable) {
    subtitle =
      "Sorry, this artwork is sold or no longer available. Please create an alert or contact orders@artsy.net to find similar artworks"
  } else if (hasEnded) {
    subtitle = "This offer has expired. Please make a new offer or contact the gallery"
  }

  const note = item?.partnerOffer?.note
  const artworks = extractNodes(artworksConnection)

  const partnerIcon = artworks[0]?.partner?.profile?.icon?.url

  const handleManageSaves = () => {
    navigate("/favorites/saves")
  }

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Offers"
        rightElements={
          isOfferFromSaves ? (
            <Touchable haptic="impactLight" onPress={handleManageSaves} hitSlop={DEFAULT_HIT_SLOP}>
              <Text variant="xs">Manage Saves</Text>
            </Touchable>
          ) : null
        }
      />
      <Screen.Body fullwidth scroll>
        <Flex mt={2} mb={4}>
          <Flex mx={2}>
            <PartnerOfferBadge notificationType={notificationType} />

            <Spacer y={0.5} />

            <Text variant="lg-display">{headline}</Text>

            <Spacer y={0.5} />

            <Text variant="sm-display">{subtitle}</Text>

            <Spacer y={0.5} />

            {/* @ts-ignore: fix ExpiresInTimer fragment data */}
            {shouldDisplayExpiresInTimer(notificationType, item) && <ExpiresInTimer item={item} />}

            <Spacer y={2} />
          </Flex>

          <NotificationArtworkList
            artworksConnection={artworksConnection}
            priceOfferMessage={{
              priceListedMessage: artworks[0]?.price || "Not publicly listed",
              priceWithDiscountMessage: item?.partnerOffer?.priceWithDiscount?.display || "",
            }}
            partnerOffer={item?.partnerOffer}
          />

          <CommercialButtonsQueryRenderer
            artworkID={extractNodes(artworksConnection)[0]?.internalID}
            partnerOffer={item?.partnerOffer}
          />

          {!!item?.partnerOffer?.note && (
            <Flex width="100%" flexDirection="row" p={2}>
              <Flex width="100%" flexDirection="row" bg="black5" p={1}>
                {!!partnerIcon && (
                  <Flex mr={1}>
                    <ImageBackground
                      source={{ uri: partnerIcon }}
                      style={{ width: 30, height: 30 }}
                      imageStyle={{
                        borderRadius: 15,
                        borderColor: color("black30"),
                        borderWidth: 1,
                      }}
                    />
                  </Flex>
                )}
                <Flex flex={1}>
                  <Text variant="sm" color="black100" fontWeight="bold">
                    Note from the gallery
                  </Text>
                  <Text variant="sm" color="black100">
                    "{note}"
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

export const PartnerOfferCreatedNotificationFragment = graphql`
  fragment PartnerOfferCreatedNotification_notification on Notification {
    headline
    notificationType
    targetHref
    item {
      ... on PartnerOfferCreatedNotificationItem {
        expiresAt
        available
        partnerOffer {
          note
          internalID
          endAt
          isAvailable
          priceWithDiscount {
            display
          }
          source
        }
      }
    }
    artworksConnection(first: 10) {
      ...NotificationArtworkList_artworksConnection
      edges {
        node {
          internalID
          partner(shallow: true) {
            profile {
              icon {
                url(version: "square140")
              }
            }
          }
          price
        }
      }
    }
  }
`
