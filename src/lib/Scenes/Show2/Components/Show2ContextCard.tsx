import { Show2ContextCard_show } from "__generated__/Show2ContextCard_show.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { Box, BoxProps, Flex, SmallCard, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface Show2ContextCardProps extends BoxProps {
  show: Show2ContextCard_show
}

export const Show2ContextCard: React.FC<Show2ContextCardProps> = ({ show }) => {
  const { isFairBooth, fair, partner } = show

  const props: ContextCardProps = isFairBooth ? extractPropsFromFair(fair) : extractPropsFromPartner(partner)

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

const ContextCard: React.FC<ContextCardProps> = ({ sectionTitle, imageUrls, iconUrl, title, subtitle, onPress }) => {
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
    <>
      <Box m={2}>
        <SectionTitle title={sectionTitle} onPress={onPress} />
        <TouchableOpacity onPress={onPress}>
          <Box style={{ position: "relative" }}>
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
                <OpaqueImageView width={60} height={40} imageURL={iconUrl} placeholderBackgroundColor="white" />
              </Flex>
            )}
          </Box>
          <Text variant="mediumText" mt={0.5}>
            {title}
          </Text>
          {!!subtitle && (
            <Text variant="caption" color="black60">
              {subtitle}
            </Text>
          )}
        </TouchableOpacity>
      </Box>
    </>
  )
}

export const Show2ContextCardFragmentContainer = createFragmentContainer(Show2ContextCard, {
  show: graphql`
    fragment Show2ContextCard_show on Show {
      isFairBooth
      fair {
        name
        slug
        exhibitionPeriod
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

const extractPropsFromFair = (fair: Show2ContextCard_show["fair"]): ContextCardProps => ({
  sectionTitle: `Part of ${fair?.name}`,
  imageUrls: [fair?.image?.imageUrl ?? ""],
  iconUrl: fair?.profile?.icon?.imageUrl ?? "",
  title: fair?.name ?? "",
  subtitle: fair?.exhibitionPeriod ?? "",
  onPress: () => navigate(`fair/${fair?.slug}`),
})

// TODO: confirm against bestiary of Show types? (regular, reference, online, stub)
const extractPropsFromPartner = (partner: Show2ContextCard_show["partner"]): ContextCardProps => ({
  sectionTitle: `Presented by ${partner?.name}`,
  imageUrls: partner?.artworksConnection?.edges?.map((edge) => edge?.node?.image?.url!) || [],
  title: partner?.name ?? "",
  subtitle: partner?.cities?.join(", ") ?? "",
  onPress: () => navigate(partner?.profile?.slug ?? ""),
})
