import { ShowMoreInfo_show$data } from "__generated__/ShowMoreInfo_show.graphql"
import { ShowMoreInfoQuery } from "__generated__/ShowMoreInfoQuery.graphql"
import { PartnerEntityHeaderFragmentContainer as PartnerEntityHeader } from "app/Components/PartnerEntityHeader"
import { ReadMore } from "app/Components/ReadMore"
import { defaultEnvironment } from "app/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ShowHoursFragmentContainer as ShowHours } from "../Components/ShowHours"
import { ShowLocationFragmentContainer as ShowLocation } from "../Components/ShowLocation"

const DISPLAYABLE_PARTNER_TYPES = {
  "Institutional Seller": "Institution",
  Institution: "Institution",
  Gallery: "Gallery",
}

interface Section {
  key: string
  element: JSX.Element
}

export interface ShowMoreInfoProps {
  show: ShowMoreInfo_show$data
}

export const ShowMoreInfo: React.FC<ShowMoreInfoProps> = ({ show }) => {
  const displayablePartnerType =
    DISPLAYABLE_PARTNER_TYPES[show.partner?.type as keyof typeof DISPLAYABLE_PARTNER_TYPES]
  const location = show.location ?? show.fair?.location
  const shouldDisplayPartnerType = Object.keys(DISPLAYABLE_PARTNER_TYPES).includes(
    show.partner?.type!
  )
  const shouldDisplayHours =
    (location?.openingHours?.__typename === "OpeningHoursArray" &&
      !!location.openingHours.schedules) ||
    (location?.openingHours?.__typename === "OpeningHoursText" && !!location.openingHours.text)
  const shouldDisplayLocation =
    !!show.partner && !!location?.coordinates?.lat && !!location?.coordinates?.lng

  const sections: Section[] = [
    {
      key: "title",
      element: (
        <Box mx={2}>
          <Text variant="lg">About</Text>
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
                  <Text variant="sm" mb={1}>
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
                <Text variant="sm" mb={0.5}>
                  Statement
                </Text>
                <Text variant="sm">{show.about}</Text>
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
                <Text variant="sm" mb={0.5}>
                  Press Release
                </Text>
                <ReadMore type="show" content={show.pressRelease} textStyle="sans" maxChars={500} />
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
                <Text variant="sm" mb={0.5}>
                  Hours
                </Text>
                <ShowHours show={show} />
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
                <Text variant="sm" mb={0.5}>
                  Location
                </Text>
                <ShowLocation show={show} />
              </Box>
            ),
          },
        ]
      : []),
  ]

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ShowMoreInfoPage,
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

export const ShowMoreInfoFragmentContainer = createFragmentContainer(ShowMoreInfo, {
  show: graphql`
    fragment ShowMoreInfo_show on Show {
      ...ShowLocation_show
      ...ShowHours_show
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

export const ShowMoreInfoQueryRenderer: React.FC<{ showID: string }> = ({ showID }) => {
  return (
    <QueryRenderer<ShowMoreInfoQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ShowMoreInfoQuery($id: String!) {
          show(id: $id) {
            ...ShowMoreInfo_show
          }
        }
      `}
      variables={{ id: showID }}
      render={renderWithLoadProgress(ShowMoreInfoFragmentContainer)}
    />
  )
}
