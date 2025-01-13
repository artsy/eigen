import { EntityHeader, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { PartnerListItemShortQuery } from "__generated__/PartnerListItemShortQuery.graphql"
import { PartnerListItemShort_partner$key } from "__generated__/PartnerListItemShort_partner.graphql"
import { PartnerFollowButtonQueryRenderer } from "app/Components/PartnerFollowButton"
import { sortByDistance } from "app/Scenes/GalleriesForYou/helpers"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Location, useLocation } from "app/utils/hooks/useLocation"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { pluralize } from "app/utils/pluralize"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface PartnerListItemShortProps {
  partner: PartnerListItemShort_partner$key
}

export const PartnerListItemShort: FC<PartnerListItemShortProps> = ({ partner }) => {
  const data = useFragment(fragment, partner)
  const { location } = useLocation()

  if (!data) {
    return null
  }

  const image = data.profile?.image?.cropped?.url ?? undefined
  const locations = extractNodes(data.locationsConnection)
  const sortedLocations = location
    ? sortByDistance(locations as { coordinates?: Location }[], location)
    : locations

  const handleOnPress = () => {
    navigate(data.href)
  }

  return (
    <>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Touchable onPress={handleOnPress} style={{ flex: 1 }}>
          <EntityHeader
            name={data.name}
            initials={data.initials}
            imageUrl={image}
            meta={
              <>
                {!!sortedLocations[0] && (
                  <Text variant="xs" color="black60">
                    {sortedLocations[0].city}
                    {!!(sortedLocations.length > 1) &&
                      ` and ${sortedLocations.length - 1} more ${pluralize(
                        "location",
                        sortedLocations.length - 1
                      )}`}
                  </Text>
                )}
              </>
            }
            RightButton={<PartnerFollowButtonQueryRenderer partnerID={data.internalID} />}
          />
        </Touchable>
      </Flex>
    </>
  )
}

const fragment = graphql`
  fragment PartnerListItemShort_partner on Partner {
    internalID @required(action: NONE)
    name @required(action: NONE)
    initials @required(action: NONE)
    href @required(action: NONE)

    profile {
      image {
        cropped(height: 45, width: 45) {
          url
        }
      }
    }
    locationsConnection(first: 20) {
      edges {
        node {
          city
          coordinates {
            lat
            lng
          }
        }
      }
    }
  }
`

interface PartnerListItemShortWithSuspenseProps {
  partnerID: string
}

export const PartnerListItemShortWithSuspense = withSuspense<PartnerListItemShortWithSuspenseProps>(
  {
    Component: ({ partnerID }) => {
      const data = useLazyLoadQuery<PartnerListItemShortQuery>(query, { id: partnerID })

      if (!data?.partner) {
        return null
      }

      return <PartnerListItemShort partner={data.partner} />
    },
    LoadingFallback: () => null,
    ErrorFallback: () => null,
  }
)

const query = graphql`
  query PartnerListItemShortQuery($id: String!) {
    partner(id: $id) {
      ...PartnerListItemShort_partner
    }
  }
`
