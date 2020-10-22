import { Show2MoreInfo_show } from "__generated__/Show2MoreInfo_show.graphql"
import { Show2MoreInfoQuery } from "__generated__/Show2MoreInfoQuery.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Show2HoursFragmentContainer as Show2Hours } from "../Components/Show2Hours"
import { Show2LocationFragmentContainer as Show2Location } from "../Components/Show2Location"

export interface Show2MoreInfoProps {
  show: Show2MoreInfo_show
}

export const Show2MoreInfo: React.FC<Show2MoreInfoProps> = ({ show }) => {
  const sections = [
    <Box mx={2}>
      <Text variant="largeTitle">About</Text>
    </Box>,

    // TODO: Partner EntityHeader

    ...(!!show.about
      ? [
          <Box mx={2}>
            <Text variant="mediumText" mb={0.5}>
              Statement
            </Text>
            <Text variant="text">{show.about}</Text>
          </Box>,
        ]
      : []),

    ...(!!show.pressRelease
      ? [
          <Box mx={2}>
            <Text variant="mediumText" mb={0.5}>
              Press Release
            </Text>
            <ReadMore content={show.pressRelease} textStyle="new" maxChars={500} />
          </Box>,
        ]
      : []),

    ...(!!show.location?.openingHours || !!show.fair?.location?.openingHours
      ? [
          <Box mx={2}>
            <Text variant="mediumText" mb={0.5}>
              Hours
            </Text>
            <Show2Hours show={show} />
          </Box>,
        ]
      : []),

    ...((!!show.location || !!show.fair?.location) && !!show.partner
      ? [
          <Box mx={2}>
            <Text variant="mediumText" mb={0.5}>
              Location
            </Text>
            <Show2Location show={show} />
          </Box>,
        ]
      : []),
  ]

  return (
    <FlatList
      data={sections}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={<Spacer mt={6} pt={2} />}
      ListFooterComponent={<Spacer my={2} />}
      ItemSeparatorComponent={() => <Spacer my={15} />}
      renderItem={({ item }) => item}
    />
  )
}

export const Show2MoreInfoFragmentContainer = createFragmentContainer(Show2MoreInfo, {
  show: graphql`
    fragment Show2MoreInfo_show on Show {
      ...Show2Location_show
      ...Show2Hours_show
      href
      about: description
      pressRelease(format: MARKDOWN)
      partner {
        __typename
      }
      fair {
        location {
          __typename
          openingHours {
            __typename
          }
        }
      }
      location {
        __typename
        openingHours {
          __typename
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
