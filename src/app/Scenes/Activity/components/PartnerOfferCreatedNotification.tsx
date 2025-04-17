import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { PartnerOfferCreatedNotification_notification$key } from "__generated__/PartnerOfferCreatedNotification_notification.graphql"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { CommercialButtonsQueryRenderer } from "app/Scenes/Activity/components/NotificationCommercialButtons"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { goBack } from "app/system/navigation/navigate"
import { RouterLink } from "app/system/navigation/RouterLink"
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
  const artwork = artworks[0]

  const partnerIcon = artwork.partner?.profile?.icon?.url

  return (
    <AnalyticsContextProvider
      contextScreenOwnerId={artwork.internalID}
      contextScreenOwnerSlug={artwork.slug}
      contextScreenOwnerType={OwnerType.notification}
    >
      <Screen>
        <Screen.Header
          onBack={goBack}
          title="Offers"
          rightElements={
            isOfferFromSaves ? (
              <RouterLink to="/favorites/saves">
                <Text variant="xs">Manage Saves</Text>
              </RouterLink>
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
              {shouldDisplayExpiresInTimer(notificationType, item) && (
                /* @ts-ignore: fix ExpiresInTimer fragment data */
                <ExpiresInTimer item={item} />
              )}

              <Spacer y={2} />
            </Flex>

            <NotificationArtworkList
              artworksConnection={artworksConnection}
              priceOfferMessage={{
                priceListedMessage: artwork.price || "Not publicly listed",
                priceWithDiscountMessage: item?.partnerOffer?.priceWithDiscount?.display || "",
              }}
              partnerOffer={item?.partnerOffer}
            />

            <CommercialButtonsQueryRenderer
              artworkID={artwork.internalID}
              partnerOffer={item?.partnerOffer}
            />

            {!!item?.partnerOffer?.note && (
              <Flex width="100%" flexDirection="row" p={2}>
                <Flex width="100%" flexDirection="row" bg="mono5" p={1}>
                  {!!partnerIcon && (
                    <Flex mr={1}>
                      <ImageBackground
                        source={{ uri: partnerIcon }}
                        style={{ width: 30, height: 30 }}
                        imageStyle={{
                          borderRadius: 15,
                          borderColor: color("mono30"),
                          borderWidth: 1,
                        }}
                      />
                    </Flex>
                  )}
                  <Flex flex={1}>
                    <Text variant="sm" color="mono100" fontWeight="bold">
                      Note from the gallery
                    </Text>
                    <Text variant="sm" color="mono100">
                      "{note}"
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Screen.Body>
      </Screen>
    </AnalyticsContextProvider>
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
          slug
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
