import { FairMoreInfo_fair$data } from "__generated__/FairMoreInfo_fair.graphql"
import { FairMoreInfoQuery } from "__generated__/FairMoreInfoQuery.graphql"
import { LocationMapContainer } from "app/Components/LocationMap/LocationMap"
import { Markdown } from "app/Components/Markdown"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { defaultRules } from "app/utils/renderMarkdown"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Box, ChevronIcon, Flex, LinkText, Spacer, Text } from "palette"
import React from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { shouldShowFairBMWArtActivationLink } from "./FairBMWArtActivation"

interface FairMoreInfoQueryRendererProps {
  fairID: string
}

interface FairMoreInfoProps {
  fair: FairMoreInfo_fair$data
}

interface LocationCoordinates {
  lat: number | null
  lng: number | null
}

export const shouldShowLocationMap = (
  coordinates: LocationCoordinates | null | undefined
): boolean => {
  return !!(coordinates && coordinates?.lat && coordinates?.lng)
}

export const FairMoreInfo: React.FC<FairMoreInfoProps> = ({ fair }) => {
  const markdownRules = defaultRules({ useNewTextStyles: true })

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.FairMoreInfoPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.FairMoreInfo,
        context_screen_owner_id: fair.internalID,
        context_screen_owner_slug: fair.slug,
      }}
    >
      <ScrollView>
        <Box px={2} pb={2} pt={6}>
          <Text variant="lg">About</Text>

          <Spacer my={1} />

          {!!fair.summary && (
            <>
              <Markdown rules={markdownRules}>{fair.summary}</Markdown>
              <Spacer my={1} />
            </>
          )}
          {!!fair.about && (
            <>
              <Markdown rules={markdownRules}>{fair.about}</Markdown>
              <Spacer my={1} />
            </>
          )}

          {!!fair.tagline && (
            <>
              <Text variant="sm">{fair.tagline}</Text>
              <Spacer my={1} />
            </>
          )}

          {!!fair.location && (
            <>
              <Text variant="sm">Location</Text>
              {!!fair.location?.summary && <Text variant="sm">{fair.location?.summary}</Text>}
              {!!shouldShowLocationMap(fair.location?.coordinates) && (
                <>
                  <Spacer my={1} />
                  <LocationMapContainer
                    location={fair.location}
                    partnerName={fair.profile?.name ?? fair.name}
                  />
                </>
              )}
              <Spacer my={1} />
            </>
          )}

          {!!shouldShowFairBMWArtActivationLink(fair) && (
            <TouchableOpacity onPress={() => navigate(`/fair/${fair.slug}/bmw-sponsored-content`)}>
              <Flex py={2} flexDirection="row" justifyContent="flex-start">
                <Text variant="sm">View BMW art activations</Text>
                <ChevronIcon mr="-5px" mt="3px" />
              </Flex>
            </TouchableOpacity>
          )}

          {!!fair.fairHours && (
            <>
              <Text variant="sm">Hours</Text>
              <Markdown rules={markdownRules}>{fair.fairHours}</Markdown>
              <Spacer my={1} />
            </>
          )}
          {!!fair.fairTickets && (
            <>
              <Text variant="sm">Tickets</Text>
              <Markdown rules={markdownRules}>{fair.fairTickets}</Markdown>
              <Spacer my={1} />
            </>
          )}
          {!!fair.ticketsLink && (
            <>
              <TouchableOpacity onPress={() => navigate(fair.ticketsLink!)}>
                <LinkText>Buy Tickets</LinkText>
              </TouchableOpacity>
              <Spacer my={1} />
            </>
          )}
          {!!fair.fairLinks && (
            <>
              <Text variant="sm">Links</Text>
              <Markdown rules={markdownRules}>{fair.fairLinks}</Markdown>
              <Spacer my={1} />
            </>
          )}
          {!!fair.fairContact && (
            <>
              <Text variant="sm">Contact</Text>
              <Markdown rules={markdownRules}>{fair.fairContact}</Markdown>
              <Spacer my={1} />
            </>
          )}
        </Box>
      </ScrollView>
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
      sponsoredContent {
        activationText
        pressReleaseUrl
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

export const FairMoreInfoQueryRenderer: React.FC<FairMoreInfoQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<FairMoreInfoQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FairMoreInfoQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...FairMoreInfo_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(FairMoreInfoFragmentContainer)}
    />
  )
}
