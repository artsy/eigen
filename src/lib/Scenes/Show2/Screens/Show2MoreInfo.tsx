import { Show2MoreInfo_show } from "__generated__/Show2MoreInfo_show.graphql"
import { Show2MoreInfoQuery } from "__generated__/Show2MoreInfoQuery.graphql"
import { PartnerEntityHeaderFragmentContainer as PartnerEntityHeader } from "lib/Components/PartnerEntityHeader"
import { ReadMore } from "lib/Components/ReadMore"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Show2HoursFragmentContainer as Show2Hours } from "../Components/Show2Hours"
import { Show2LocationFragmentContainer as Show2Location } from "../Components/Show2Location"

const DISPLAYABLE_PARTNER_TYPES = {
  "Institutional Seller": "Institution",
  Institution: "Institution",
  Gallery: "Gallery",
}

interface Section {
  key: string
  element: JSX.Element
}

export interface Show2MoreInfoProps {
  show: Show2MoreInfo_show
}

export const Show2MoreInfo: React.FC<Show2MoreInfoProps> = ({ show }) => {
  const displayablePartnerType = DISPLAYABLE_PARTNER_TYPES[show.partner?.type as keyof typeof DISPLAYABLE_PARTNER_TYPES]
  const location = show.location ?? show.fair?.location
  const shouldDisplayPartnerType = Object.keys(DISPLAYABLE_PARTNER_TYPES).includes(show.partner?.type!)
  const shouldDisplayHours =
    (location?.openingHours?.__typename === "OpeningHoursArray" && !!location.openingHours.schedules) ||
    (location?.openingHours?.__typename === "OpeningHoursText" && !!location.openingHours.text)
  const shouldDisplayLocation = !!show.partner && !!location?.coordinates?.lat && !!location?.coordinates?.lng

  const sections: Section[] = [
    {
      key: "title",
      element: (
        <Box mx={2}>
          <Text variant="largeTitle">About</Text>
        </Box>
      ),
    },

    ...(!!show.partner
      ? [
          {
            key: "partner-entity-header",
            element: (
              <Box mx={2}>
                {!!shouldDisplayPartnerType && (
                  <Text variant="mediumText" mb={1}>
                    {displayablePartnerType}
                  </Text>
                )}
                <PartnerEntityHeader partner={show.partner} />
              </Box>
            ),
          },
        ]
      : []),

    ...(!!show.about
      ? [
          {
            key: "about",
            element: (
              <Box mx={2}>
                <Text variant="mediumText" mb={0.5}>
                  Statement
                </Text>
                <Text variant="text">{show.about}</Text>
              </Box>
            ),
          },
        ]
      : []),

    ...(!!show.pressRelease
      ? [
          {
            key: "press-release",
            element: (
              <Box mx={2}>
                <Text variant="mediumText" mb={0.5}>
                  Press Release
                </Text>
                <ReadMore content={show.pressRelease} textStyle="new" maxChars={500} />
              </Box>
            ),
          },
        ]
      : []),

    ...(shouldDisplayHours
      ? [
          {
            key: "hours",
            element: (
              <Box mx={2}>
                <Text variant="mediumText" mb={0.5}>
                  Hours
                </Text>
                <Show2Hours show={show} />
              </Box>
            ),
          },
        ]
      : []),

    ...(shouldDisplayLocation
      ? [
          {
            key: "location",
            element: (
              <Box mx={2}>
                <Text variant="mediumText" mb={0.5}>
                  Location
                </Text>
                <Show2Location show={show} />
              </Box>
            ),
          },
        ]
      : []),
  ]

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Show2MoreInfoPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Show,
        context_screen_owner_id: show.internalID,
        context_screen_owner_slug: show.slug,
      }}
    >
      <FlatList<Section>
        data={sections}
        keyExtractor={({ key }) => key}
        ListHeaderComponent={<Spacer mt={6} pt={2} />}
        ListFooterComponent={<Spacer my={2} />}
        ItemSeparatorComponent={() => <Spacer my={15} />}
        renderItem={({ item: { element } }) => element}
      />
    </ProvideScreenTracking>
  )
}

export const Show2MoreInfoFragmentContainer = createFragmentContainer(Show2MoreInfo, {
  show: graphql`
    fragment Show2MoreInfo_show on Show {
      ...Show2Location_show
      ...Show2Hours_show
      internalID
      slug
      href
      about: description
      pressRelease(format: MARKDOWN)
      partner {
        ...PartnerEntityHeader_partner
        __typename
        ... on Partner {
          type
        }
      }
      fair {
        location {
          __typename
          openingHours {
            __typename
            ... on OpeningHoursArray {
              schedules {
                __typename
              }
            }
            ... on OpeningHoursText {
              text
            }
          }
          coordinates {
            lat
            lng
          }
        }
      }
      location {
        __typename
        openingHours {
          __typename
          ... on OpeningHoursArray {
            schedules {
              __typename
            }
          }
          ... on OpeningHoursText {
            text
          }
        }
        coordinates {
          lat
          lng
        }
      }
    }
  `,
})

export const Show2MoreInfoQueryRenderer: React.FC<{ showID: string }> = ({ showID }) => {
  return (
    <QueryRenderer<Show2MoreInfoQuery>
      environment={defaultEnvironment}
      query={graphql`
        query Show2MoreInfoQuery($id: String!) {
          show(id: $id) {
            ...Show2MoreInfo_show
          }
        }
      `}
      variables={{ id: showID }}
      render={renderWithLoadProgress(Show2MoreInfoFragmentContainer)}
    />
  )
}
