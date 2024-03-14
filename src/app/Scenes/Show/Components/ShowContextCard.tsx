import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Box, BoxProps, Text } from "@artsy/palette-mobile"
import { ShowContextCard_show$data } from "__generated__/ShowContextCard_show.graphql"
import { SmallCard } from "app/Components/Cards"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "app/Components/SectionTitle"
import { useConditionalNavigate } from "app/system/newNavigation/useConditionalNavigate"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export interface ShowContextCardProps extends BoxProps {
  show: ShowContextCard_show$data
}

export const ShowContextCard: React.FC<ShowContextCardProps> = ({ show, ...rest }) => {
  const { isFairBooth, fair, partner } = show

  const navigate = useConditionalNavigate()

  const { onPress, ...card } = isFairBooth
    ? extractPropsFromFair(fair, navigate)
    : extractPropsFromPartner(partner, navigate)

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
  const hasMultipleImages = imageUrls.length > 1

  const imageElement = hasMultipleImages ? (
    <SmallCard images={imageUrls} /> // 3-up image layout
  ) : (
    <OpaqueImageView
      style={{ width: "100%", borderRadius: 4, overflow: "hidden" }}
      aspectRatio={1.5}
      imageURL={imageUrls[0]}
    />
  )

  return (
    <Box {...rest} testID="ShowContextCard">
      <SectionTitle title={sectionTitle} onPress={onPress} />

      <TouchableOpacity onPress={onPress}>
        <Box position="relative">
          {imageElement}

          {!!iconUrl && (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="white100"
              width={80}
              height={60}
              px={1}
              position="absolute"
              bottom={0}
              left={2}
            >
              <OpaqueImageView
                width={60}
                height={40}
                imageURL={iconUrl}
                placeholderBackgroundColor="white"
              />
            </Flex>
          )}
        </Box>

        <Text variant="sm" mt={0.5}>
          {title}
        </Text>

        {!!subtitle && (
          <Text variant="xs" color="black60">
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

// TODO: Handle these nav functions in new nav
const extractPropsFromFair = (
  fair: ShowContextCard_show$data["fair"],
  navigate: (routeName: string, params?: object | undefined) => void
): ContextCardProps => ({
  sectionTitle: `Part of ${fair?.name}`,
  imageUrls: [fair?.image?.imageUrl ?? ""],
  iconUrl: fair?.profile?.icon?.imageUrl ?? "",
  title: fair?.name ?? "",
  subtitle: fair?.exhibitionPeriod ?? "",
  onPress: () => navigate(`fair/${fair?.slug}`),
})

// TODO: confirm against bestiary of Show types? (regular, reference, online, stub)
const extractPropsFromPartner = (
  partner: ShowContextCard_show$data["partner"],
  navigate: (routeName: string, params?: object | undefined) => void
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
