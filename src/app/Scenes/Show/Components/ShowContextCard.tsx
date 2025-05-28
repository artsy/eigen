import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Box, BoxProps, Text, useScreenDimensions, Image } from "@artsy/palette-mobile"
import { ShowContextCard_show$data } from "__generated__/ShowContextCard_show.graphql"
import { SmallCard } from "app/Components/Cards"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export interface ShowContextCardProps extends BoxProps {
  show: ShowContextCard_show$data
}

export const ShowContextCard: React.FC<ShowContextCardProps> = ({ show, ...rest }) => {
  const { isFairBooth, fair, partner } = show

  const { onPress, ...card } = isFairBooth
    ? extractPropsFromFair(fair)
    : extractPropsFromPartner(partner)

  const tracking = useTracking()

  const props = {
    onPress: () => {
      onPress()

      const context = {
        type: "thumbnail",
        context_screen_owner_type: OwnerType.show,
        context_screen_owner_id: show.internalID,
        context_screen_owner_slug: show.slug,
      }

      if (isFairBooth) {
        const data = {
          ...context,
          action: ActionType.tappedFairCard,
          context_module: ContextModule.presentingFair,
          destination_screen_owner_type: OwnerType.fair,
          destination_screen_owner_id: fair?.internalID,
          destination_screen_owner_slug: fair?.slug,
        }

        tracking.trackEvent(data)
      } else {
        const data = {
          ...context,
          action: ActionType.tappedPartnerCard,
          context_module: ContextModule.presentingPartner,
          destination_screen_owner_type: OwnerType.partner,
          destination_screen_owner_id: partner?.internalID,
          destination_screen_owner_slug: partner?.slug,
        }

        tracking.trackEvent(data)
      }
    },
    ...card,
    ...rest,
  }

  return <ContextCard {...props} />
}

interface ContextCardProps {
  /** Large title for the card, will truncate if long enough */
  sectionTitle: string

  /** 1-3 primary images */
  imageUrls: string[]

  /** Smaller, nested image */
  iconUrl?: string

  /** Full title of the entity, will wrap if long enough */
  title: string

  /** Secondary info */
  subtitle?: string

  /** Event handler for navigation */
  onPress: () => void
}

const ContextCard: React.FC<ContextCardProps> = ({
  sectionTitle,
  imageUrls,
  iconUrl,
  title,
  subtitle,
  onPress,
  ...rest
}) => {
  const { width } = useScreenDimensions()
  const hasMultipleImages = imageUrls.length > 1

  const imageElement = hasMultipleImages ? (
    <SmallCard images={imageUrls} /> // 3-up image layout
  ) : (
    <Flex width="100%" borderRadius={4} overflow="hidden">
      <Image testID="main-image" width={width} aspectRatio={1.5} src={imageUrls[0]} />
    </Flex>
  )

  return (
    <Box {...rest} testID="ShowContextCard">
      <SectionTitle title={sectionTitle} onPress={onPress} />

      <TouchableOpacity accessibilityRole="button" onPress={onPress}>
        <Box position="relative">
          {imageElement}

          {!!iconUrl && (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="mono0"
              width={80}
              height={60}
              px={1}
              position="absolute"
              bottom={0}
              left={2}
            >
              <Image testID="icon-image" width={60} height={40} src={iconUrl} />
            </Flex>
          )}
        </Box>

        <Text variant="sm" mt={0.5}>
          {title}
        </Text>

        {!!subtitle && (
          <Text variant="xs" color="mono60">
            {subtitle}
          </Text>
        )}
      </TouchableOpacity>
    </Box>
  )
}

export const ShowContextCardFragmentContainer = createFragmentContainer(ShowContextCard, {
  show: graphql`
    fragment ShowContextCard_show on Show {
      internalID
      slug
      isFairBooth
      fair {
        internalID
        slug
        name
        exhibitionPeriod(format: SHORT)
        profile {
          icon {
            imageUrl: url(version: "untouched-png")
          }
        }
        image {
          imageUrl: url(version: "large_rectangle")
        }
      }
      partner {
        ... on Partner {
          internalID
          slug
          name
          profile {
            slug
          }
          cities
          artworksConnection(sort: MERCHANDISABILITY_DESC, first: 3) {
            edges {
              node {
                image {
                  url(version: "larger")
                }
              }
            }
          }
        }
      }
    }
  `,
})

const extractPropsFromFair = (fair: ShowContextCard_show$data["fair"]): ContextCardProps => ({
  sectionTitle: `Part of ${fair?.name}`,
  imageUrls: [fair?.image?.imageUrl ?? ""],
  iconUrl: fair?.profile?.icon?.imageUrl ?? "",
  title: fair?.name ?? "",
  subtitle: fair?.exhibitionPeriod ?? "",
  onPress: () => navigate(`fair/${fair?.slug}`),
})

// TODO: confirm against bestiary of Show types? (regular, reference, online, stub)
const extractPropsFromPartner = (
  partner: ShowContextCard_show$data["partner"]
): ContextCardProps => ({
  sectionTitle: `Presented by ${partner?.name}`,
  imageUrls:
    (partner?.artworksConnection?.edges
      ?.map((edge) => edge?.node?.image?.url)
      .filter(Boolean) as string[]) || [],
  title: partner?.name ?? "",
  subtitle: partner?.cities?.join(", ") ?? "",
  onPress: () => navigate(partner?.profile?.slug ?? ""),
})
