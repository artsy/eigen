import { OwnerType } from "@artsy/cohesion"
import { Flex, Box, Text } from "@artsy/palette-mobile"
import { PartnerHeader_partner$data } from "__generated__/PartnerHeader_partner.graphql"
import { ItineraryItemSaveControl } from "app/Components/ItineraryItemSaveControl"
import { PartnerBanner } from "app/Components/PartnerBanner"
import { Stack } from "app/Components/Stack"
import { TypeEyebrow } from "app/Components/TypeEyebrow"
import { formatLargeNumberOfItems } from "app/utils/formatLargeNumberOfItems"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerFollowButtonFragmentContainer as FollowButton } from "./PartnerFollowButton"

const PartnerHeader: React.FC<{
  partner: PartnerHeader_partner$data
  locationID?: string
  showOnlyFollowButton?: boolean
}> = ({ partner, locationID, showOnlyFollowButton }) => {
  const eligibleArtworks = partner.counts?.eligibleArtworks ?? 0

  const galleryBadges = ["Black Owned", "Women Owned"]

  const eligibleCategories = (partner.categories || []).filter(Boolean)

  const categoryNames: string[] = eligibleCategories.map((category) => category?.name || "")
  const firstEligibleBadgeName: string | undefined = galleryBadges.find((badge) =>
    categoryNames.includes(badge)
  )

  if (!!showOnlyFollowButton && !!partner.profile) {
    return (
      <Wrapper>
        {!!partner.type && <TypeEyebrow>{partner.type}</TypeEyebrow>}

        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1} mr={1}>
            <Text variant="lg-display">{partner.name}</Text>
          </Flex>

          <SaveToItinerary partner={partner} locationID={locationID} />
        </Flex>

        <Flex flexGrow={0} flexShrink={0} pt={1}>
          <FollowButton partner={partner} />
        </Flex>
      </Wrapper>
    )
  }

  return (
    <>
      <Wrapper>
        {!!partner.type && <TypeEyebrow>{partner.type}</TypeEyebrow>}

        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1} mr={1}>
            <Text variant="lg-display">{partner.name}</Text>
          </Flex>

          <SaveToItinerary partner={partner} locationID={locationID} />
        </Flex>

        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mt={1}>
          <Stack spacing={0.5}>
            {!!eligibleArtworks && (
              <Text variant="sm">
                {!!eligibleArtworks && formatLargeNumberOfItems(eligibleArtworks, "work", "works")}
              </Text>
            )}
          </Stack>
          {!!partner.profile && (
            <Flex flexGrow={0} flexShrink={0}>
              <FollowButton partner={partner} />
            </Flex>
          )}
        </Flex>
      </Wrapper>
      {!!firstEligibleBadgeName && <PartnerBanner bannerText={firstEligibleBadgeName} />}
    </>
  )
}

/** Adds the location a City Guide stop named, or else the partner's only location in a City
 *  Guide city: with several and no stop to go by, which one the plus adds would be a guess. */
const SaveToItinerary: React.FC<{ partner: PartnerHeader_partner$data; locationID?: string }> = ({
  partner,
  locationID,
}) => {
  const guideLocations = (partner.itineraryLocations ?? []).filter(
    (location) => !!location?.cityGuideCity
  )
  const location =
    guideLocations.find((each) => !!locationID && each?.internalID === locationID) ??
    (guideLocations.length === 1 ? guideLocations[0] : null)

  if (!location) return null

  return (
    <ItineraryItemSaveControl
      itemType="LOCATION"
      itemID={location.internalID}
      name={partner.name ?? ""}
      contextScreenOwnerType={OwnerType.partner}
      contextScreenOwnerId={partner.internalID}
      contextScreenOwnerSlug={partner.slug}
    />
  )
}

export const PartnerHeaderContainer = createFragmentContainer(PartnerHeader, {
  partner: graphql`
    fragment PartnerHeader_partner on Partner {
      internalID
      slug
      name
      # The partner's user-facing category ("Gallery", "Institution", "Auction House" …), shown
      # as an eyebrow above the name. partnerType is the raw enum value this is derived from —
      # not user-facing on its own (eg "Institutional Seller" here reads "Institution").
      type
      profile {
        # Only fetch something so we can see if the profile exists.
        name
      }
      categories {
        name
      }
      counts {
        eligibleArtworks
      }
      itineraryLocations: locations {
        internalID
        cityGuideCity {
          slug
        }
      }
      ...PartnerFollowButton_deprecated_partner
    }
  `,
})

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box px={2} py={1}>
      {children}
    </Box>
  )
}
