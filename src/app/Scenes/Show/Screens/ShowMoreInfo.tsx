import { Box, Spacer, Text } from "@artsy/palette-mobile"
import { ShowMoreInfoQuery } from "__generated__/ShowMoreInfoQuery.graphql"
import { ShowMoreInfo_show$data } from "__generated__/ShowMoreInfo_show.graphql"
import { PartnerEntityHeaderFragmentContainer as PartnerEntityHeader } from "app/Components/PartnerEntityHeader"
import { ReadMore } from "app/Components/ReadMore"
import { ShowHoursFragmentContainer as ShowHours } from "app/Scenes/Show/Components/ShowHours"
import { ShowLocationFragmentContainer as ShowLocation } from "app/Scenes/Show/Components/ShowLocation"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

const DISPLAYABLE_PARTNER_TYPES = {
  "Institutional Seller": "Institution",
  Institution: "Institution",
  Gallery: "Gallery",
}

interface Section {
  key: string
  element: React.JSX.Element
}

export interface ShowMoreInfoProps {
  show: ShowMoreInfo_show$data
}

export const ShowMoreInfo: React.FC<ShowMoreInfoProps> = ({ show }) => {
  const displayablePartnerType =
    DISPLAYABLE_PARTNER_TYPES[show.partner?.type as keyof typeof DISPLAYABLE_PARTNER_TYPES]
  const location = show.location ?? show.fair?.location
  const shouldDisplayPartnerType =
    !!show.partner?.type && Object.keys(DISPLAYABLE_PARTNER_TYPES).includes(show.partner?.type)
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
          <Text variant="lg-display">About</Text>
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
                <ReadMore content={show.pressRelease} textStyle="sans" maxChars={500} />
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
        ListHeaderComponent={<Spacer y={2} />}
        ListFooterComponent={<Spacer y={2} />}
        ItemSeparatorComponent={() => <Spacer y="15px" />}
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
      environment={getRelayEnvironment()}
      query={ShowMoreInfoScreenQuery}
      variables={{ showID }}
      render={renderWithLoadProgress(ShowMoreInfoFragmentContainer)}
    />
  )
}

export const ShowMoreInfoScreenQuery = graphql`
  query ShowMoreInfoQuery($showID: String!) {
    show(id: $showID) {
      ...ShowMoreInfo_show
    }
  }
`
