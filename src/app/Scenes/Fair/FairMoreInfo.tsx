import { Box, LinkText, Screen, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { FairMoreInfoQuery } from "__generated__/FairMoreInfoQuery.graphql"
import { FairMoreInfo_fair$data } from "__generated__/FairMoreInfo_fair.graphql"
import { LocationMapContainer } from "app/Components/LocationMap/LocationMap"
import { Markdown } from "app/Components/Markdown"
import { RouterLink } from "app/system/navigation/RouterLink"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { defaultRules } from "app/utils/renderMarkdown"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { compact } from "lodash"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface FairMoreInfoQueryRendererProps {
  fairID: string
}

interface FairMoreInfoProps {
  fair: FairMoreInfo_fair$data
}

interface LocationCoordinates {
  lat: number | null | undefined
  lng: number | null | undefined
}

export const shouldShowLocationMap = (
  coordinates: LocationCoordinates | null | undefined
): boolean => {
  return !!(coordinates && coordinates?.lat && coordinates?.lng)
}

export const FairMoreInfo: React.FC<FairMoreInfoProps> = ({ fair }) => {
  const markdownRules = defaultRules({ useNewTextStyles: true })
  const space = useSpace()

  const sections = compact([
    {
      title: "ScreeTitle",
      content: <Text variant="lg-display">About</Text>,
    },
    !!fair.summary && {
      title: "Summary",
      content: (
        <>
          <Markdown rules={markdownRules}>{fair.summary}</Markdown>
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.about && {
      title: "About",
      content: (
        <>
          <Markdown rules={markdownRules}>{fair.about}</Markdown>
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.tagline && {
      title: "Tagline",
      content: (
        <>
          <Text variant="sm">{fair.tagline}</Text>
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.location && {
      title: "Location",
      content: (
        <>
          <Text variant="sm">Location</Text>
          {!!fair.location?.summary && <Text variant="sm">{fair.location?.summary}</Text>}
          {!!shouldShowLocationMap(fair.location?.coordinates) && (
            <>
              <Spacer y={1} />
              <LocationMapContainer
                location={fair.location}
                partnerName={fair.profile?.name ?? fair.name}
              />
            </>
          )}
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.fairHours && {
      title: "Hours",
      content: (
        <>
          <Text variant="sm">Hours</Text>
          <Markdown rules={markdownRules}>{fair.fairHours}</Markdown>
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.fairTickets && {
      title: "Tickets",
      content: (
        <>
          <Text variant="sm">Tickets</Text>
          <Markdown rules={markdownRules}>{fair.fairTickets}</Markdown>
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.ticketsLink && {
      title: "Ticket Links",
      content: (
        <>
          <RouterLink to={fair.ticketsLink}>
            <LinkText>Buy Tickets</LinkText>
          </RouterLink>
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.fairLinks && {
      title: "Links",
      content: (
        <>
          <Text variant="sm">Links</Text>
          <Markdown rules={markdownRules}>{fair.fairLinks}</Markdown>
          <Spacer y={1} />
        </>
      ),
    },
    !!fair.fairContact && {
      title: "Contact",
      content: (
        <>
          <Text variant="sm">Contact</Text>
          <Markdown rules={markdownRules}>{fair.fairContact}</Markdown>
          <Spacer y={1} />
        </>
      ),
    },
  ])
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.FairMoreInfoPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.FairMoreInfo,
        context_screen_owner_id: fair.internalID,
        context_screen_owner_slug: fair.slug,
      }}
    >
      <Screen>
        <Screen.AnimatedHeader title={fair.name || ""} onBack={goBack} />

        <Screen.Body fullwidth>
          <Screen.FlatList
            data={sections}
            renderItem={({ item }) => item.content}
            keyExtractor={(item) => item.title}
            ItemSeparatorComponent={() => <Spacer y={2} />}
            contentContainerStyle={{ paddingHorizontal: space(2) }}
          >
            <Box px={2} pb={2} pt={6}>
              <Text variant="lg-display">About</Text>

              <Spacer y={1} />
            </Box>
          </Screen.FlatList>
        </Screen.Body>
      </Screen>
    </ProvideScreenTracking>
  )
}

export const FairMoreInfoFragmentContainer = createFragmentContainer(FairMoreInfo, {
  fair: graphql`
    fragment FairMoreInfo_fair on Fair {
      internalID
      slug
      about
      name
      tagline
      profile {
        name
      }
      location {
        ...LocationMap_location
        coordinates {
          lat
          lng
        }
        summary
      }
      ticketsLink
      fairHours: hours(format: MARKDOWN)
      fairLinks: links(format: MARKDOWN)
      fairTickets: tickets(format: MARKDOWN)
      summary
      fairContact: contact(format: MARKDOWN)
    }
  `,
})

export const FaireMoreInfoScreenQuery = graphql`
  query FairMoreInfoQuery($fairID: String!) {
    fair(id: $fairID) @principalField {
      ...FairMoreInfo_fair
    }
  }
`

export const FairMoreInfoQueryRenderer: React.FC<FairMoreInfoQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<FairMoreInfoQuery>
      environment={getRelayEnvironment()}
      query={FaireMoreInfoScreenQuery}
      variables={{ fairID }}
      render={renderWithLoadProgress(FairMoreInfoFragmentContainer)}
    />
  )
}
